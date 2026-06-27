import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Стартиране на посяването (seeding) на базата данни...');

  // 1. Създаваме Продавач (KYC Одобрен)
  const seller = await prisma.user.upsert({
    where: { email: 'seller@turg.bg' },
    update: {},
    create: {
      email: 'seller@turg.bg',
      passwordHash: 'hashed_password_123',
      fullName: 'Инвест Билд ООД',
      role: 'SELLER',
      kycVerified: true,
    },
  });

  // 2. Създаваме Купувач (KYC Одобрен)
  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@turg.bg' },
    update: {},
    create: {
      email: 'buyer@turg.bg',
      passwordHash: 'hashed_password_456',
      fullName: 'Иван Иванов',
      role: 'BUYER',
      kycVerified: true,
    },
  });

  console.log('👤 Потребителите са създадени.');

  // 3. Създаваме Актив
  const asset = await prisma.asset.create({
    data: {
      title: 'Екологична къща от конопени панели',
      description: 'Иновативна сглобяема къща с висока енергийна ефективност.',
      location: 'обл. Варна, с. Рогачево',
      assetType: 'PROPERTY',
      specifications: {
        totalArea: 120,
        constructionType: 'Еко строителство',
      },
      sellerId: seller.id,
    },
  });

  console.log('🏠 Активът е създаден.');

  // 4. Създаваме Търг (Започва сега, завършва след 2 дни)
  const now = new Date();
  const endTime = new Date();
  endTime.setDate(now.getDate() + 2); // Добавяме 48 часа

  const auction = await prisma.auction.create({
    data: {
      assetId: asset.id,
      startPrice: 125000,
      reservePrice: 140000,
      currentPrice: 125000,
      startTime: now,
      endTime: endTime,
      status: 'ACTIVE',
    },
  });

  console.log('🔨 Търгът е създаден и е АКТИВЕН.');

  // 5. Купувачът внася Гаранционен депозит (10% от началната цена)
  await prisma.deposit.create({
    data: {
      userId: buyer.id,
      auctionId: auction.id,
      amount: 12500,
      status: 'LOCKED',
      paymentReference: 'BANK-TX-987654321',
    },
  });

  console.log('💰 Гаранционният депозит е заключен успешно.');
  console.log('\n✅ БАЗАТА ДАННИ Е УСПЕШНО ЗАРЕДЕНА!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });