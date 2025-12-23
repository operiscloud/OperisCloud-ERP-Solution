import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import GiftCardDetailsForm from '@/components/giftcards/GiftCardDetailsForm';

export default async function GiftCardDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { tenantId: true },
  });

  if (!user) redirect('/onboarding');

  const giftCard = await prisma.giftCard.findFirst({
    where: {
      id,
      tenantId: user.tenantId,
    },
    include: {
      orders: {
        select: {
          id: true,
          orderNumber: true,
          giftCardAmount: true,
          createdAt: true,
          customer: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!giftCard) {
    notFound();
  }

  // Convert Decimal to number for client component
  const serializedGiftCard = {
    ...giftCard,
    initialAmount: Number(giftCard.initialAmount),
    balance: Number(giftCard.balance),
    orders: giftCard.orders.map((order) => ({
      ...order,
      giftCardAmount: Number(order.giftCardAmount),
    })),
  };

  return <GiftCardDetailsForm giftCard={serializedGiftCard} />;
}
