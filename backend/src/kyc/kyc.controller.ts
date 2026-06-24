import { Controller, Post, Get, UseInterceptors, UploadedFiles, UseGuards, Req, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { createClient } from '@supabase/supabase-js';

@Controller('api/kyc')
@UseGuards(JwtAuthGuard)
export class KycController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('my-status')
  async getMyKycStatus(@Req() req: any) {
    return this.prisma.kycRequest.findFirst({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 5)) 
  // ПРОМЯНА: Заменяме Array<Express.Multer.File> с any[], за да избегнем сблъсъка с липсващите глобални типове
  async uploadKycDocument(@UploadedFiles() files: any[], @Req() req: any) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Няма прикачени файлове.');
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('CRITICAL: Липсват SUPABASE_URL или SUPABASE_KEY в .env файла!');
      throw new InternalServerErrorException('Системен проблем с конфигурацията на хранилището.');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const userId = req.user.id;
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const fileName = `${userId}-${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalname}`;
      
      const { data, error } = await supabase.storage
        .from('kyc-documents')
        .upload(fileName, file.buffer, { contentType: file.mimetype });

      if (error) {
        throw new BadRequestException('Грешка при качване в хранилището: ' + error.message);
      }
      
      uploadedUrls.push(fileName);
    }

    try {
      return await this.prisma.kycRequest.create({
        data: {
          userId: userId,
          documentType: 'ID_CARD',
          documentUrls: uploadedUrls,
          status: 'PENDING'
        }
      });
    } catch (dbError) {
      throw new InternalServerErrorException('Грешка при запис в базата данни.');
    }
  }
}