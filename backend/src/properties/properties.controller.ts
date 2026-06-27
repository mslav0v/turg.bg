import { Controller, Get, Post, Body, UseGuards, Req, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { createClient } from '@supabase/supabase-js';

@Controller('api/properties')
@UseGuards(JwtAuthGuard)
export class PropertiesController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10)) // Позволява до 10 снимки
  async createProperty(@Req() req: any, @UploadedFiles() files: Array<Express.Multer.File>, @Body() body: any) {
    if (!body.title || !body.description || !body.location) {
      throw new Error('Основните полета (Заглавие, Описание, Локация) са задължителни.');
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error('Липасва Supabase конфигурация.');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // ТУК Е ПОПРАВКАТА: Изрично дефинираме, че това е масив от стрингове (текстове)
    const uploadedImages: string[] = [];

    // Качване на снимките в Supabase
    if (files && files.length > 0) {
      for (const file of files) {
        const fileName = `${req.user.id}-${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalname}`;
        const { data, error } = await supabase.storage
          .from('property-images')
          .upload(fileName, file.buffer, { contentType: file.mimetype });
        
        if (!error) {
          uploadedImages.push(fileName);
        }
      }
    }

    // Запис в базата данни
    return this.prisma.asset.create({
      data: {
        sellerId: req.user.id,
        assetType: body.assetType || 'PROPERTY',
        title: body.title,
        description: body.description,
        location: body.location,
        latitude: body.latitude ? parseFloat(body.latitude) : null,
        longitude: body.longitude ? parseFloat(body.longitude) : null,
        startPrice: body.startPrice ? parseFloat(body.startPrice) : null,
        reservePrice: body.reservePrice ? parseFloat(body.reservePrice) : null,
        images: uploadedImages,
        specifications: body.specifications ? (typeof body.specifications === 'string' ? JSON.parse(body.specifications) : body.specifications) : {},
      }
    });
  }

  @Get()
  async getMyProperties(@Req() req: any) {
    return this.prisma.asset.findMany({
      where: { sellerId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: { auction: true }
    });
  }
}