"use client";

import { CodeBlock, Objectives, ProgressCheck, Quiz, Section, Table, TipBox } from "../LessonComponents";

export default function Lesson_5_3_2() {
  return (
    <div className="lesson-content">
      <h1 className="text-3xl font-bold mb-6">In-App Purchases</h1>

      <Objectives
        items={[
          "ออกแบบ Virtual Economy",
          "Integrate Stripe",
          "สร้าง In-Game Store",
          "Handle transactions อย่างปลอดภัย",
        ]}
      />

      <Section title="Virtual Economy Design" icon="💰">
        <Table
          headers={["Currency", "Description", "Use"]}
          rows={[
            ["Soft Currency (Gold)", "หาได้ในเกม", "Basic items"],
            ["Hard Currency (Gems)", "ซื้อด้วยเงินจริง", "Premium items"],
            ["Premium Items", "เฉพาะเงินจริง", "Cosmetics, DLC"],
          ]}
        />

        <TipBox type="warning">
          <strong>หลีกเลี่ยง Pay-to-Win:</strong> ขายเฉพาะ cosmetics และ convenience
          ไม่ใช่ power
        </TipBox>
      </Section>

      <Section title="Stripe Integration" icon="💳">
        <CodeBlock
          title="Server: Create Checkout Session"
          language="typescript"
          code={`
// pages/api/checkout.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { priceId, userId, itemId } = await req.json();
  
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card', 'promptpay'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: \`\${process.env.DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}\`,
    cancel_url: \`\${process.env.DOMAIN}/store\`,
    metadata: {
      userId,
      itemId,
    },
  });
  
  return Response.json({ url: session.url });
}
          `}
        />

        <CodeBlock
          title="Client: Purchase Flow"
          language="typescript"
          code={`
async function purchaseItem(itemId: string, priceId: string) {
  // 1. Create checkout session
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      priceId,
      userId: currentUser.id,
      itemId,
    }),
  });
  
  const { url } = await response.json();
  
  // 2. Redirect to Stripe Checkout
  window.location.href = url;
}

// Usage
<button onClick={() => purchaseItem('gem-pack-100', 'price_xxxx')}>
  ซื้อ 100 Gems - $0.99
</button>
          `}
        />
      </Section>

      <Section title="Webhook Handler" icon="🔔">
        <CodeBlock
          title="Handle Successful Payment"
          language="typescript"
          code={`
// pages/api/webhooks/stripe.ts
import Stripe from 'stripe';

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response('Webhook Error', { status: 400 });
  }
  
  // ─────────────────────────────────
  // Handle successful payment
  // ─────────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, itemId } = session.metadata!;
    
    // Grant item to user
    await grantItemToUser(userId, itemId);
    
    // Log transaction
    await logTransaction({
      userId,
      itemId,
      amount: session.amount_total! / 100,
      stripeSessionId: session.id,
    });
  }
  
  return new Response('OK', { status: 200 });
}

async function grantItemToUser(userId: string, itemId: string) {
  // Add gems, unlock character, etc.
  if (itemId.startsWith('gem-pack')) {
    const gems = parseInt(itemId.split('-')[2]);
    await db.users.update(userId, {
      gems: { increment: gems }
    });
  }
}
          `}
        />
      </Section>

      <Section title="📝 ทดสอบความเข้าใจ" icon="🧠">
        <Quiz
          questions={[
            {
              question: "Hard Currency ควรใช้ซื้ออะไร?",
              options: ["Everything", "Power items", "Cosmetics และ convenience", "ไม่ควรมี"],
              correctIndex: 2,
              explanation: "Hard currency ควรซื้อ cosmetics เพื่อหลีกเลี่ยง pay-to-win"
            },
            {
              question: "Webhook ใช้ทำอะไร?",
              options: ["แสดงโฆษณา", "รับแจ้งเตือนเมื่อ payment สำเร็จ", "ส่ง email", "Login user"],
              correctIndex: 1,
              explanation: "Stripe webhook แจ้ง server เมื่อ payment complete เพื่อ grant items"
            }
          ]}
        />
      </Section>

      <Section title="สรุป" icon="✅">
        <ProgressCheck
          items={[
            "ออกแบบ virtual economy ได้",
            "Integrate Stripe ได้",
            "Handle webhooks ได้",
            "พร้อมเรียน Publishing!"
          ]}
        />
      </Section>
    </div>
  );
}
