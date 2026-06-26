import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({ apiKey: process.env.MAILERSEND_API_KEY ?? "" });
const FROM_EMAIL = process.env.MAILERSEND_FROM_EMAIL ?? "";
const FROM_NAME = "BOSS IT";

const fmtOrderId = (id: number) => `ORD-${id.toString().padStart(6, "0")}`;

type OrderItem = {
  productName: string;
  price: number;
  quantity: number;
};

type SendOrderConfirmationParams = {
  to: string;
  orderId: number;
  items: OrderItem[];
  totalAmount: number;
  shipping: {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    subdistrict: string;
    city: string;
    province: string;
    postalCode: string;
  };
};

export const sendOrderConfirmation = async (params: SendOrderConfirmationParams) => {
  const { to, orderId, items, totalAmount, shipping } = params;

  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333;">${item.productName}</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #666; text-align: center;">×${item.quantity}</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333; text-align: right;">฿${(item.price * item.quantity).toLocaleString()}</td>
      </tr>`
    )
    .join("");

  const shippingAddress = [
    shipping.address,
    shipping.subdistrict,
    shipping.city,
    shipping.province,
    shipping.postalCode,
  ]
    .filter(Boolean)
    .join(" ");

  const html = `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #333; background: #fff;">

      <!-- Header -->
      <div style="background: #111; padding: 28px 32px; border-radius: 12px 12px 0 0;">
        <p style="color: #fff; font-size: 18px; font-weight: 700; margin: 0; letter-spacing: 1px;">BOSS IT</p>
      </div>

      <!-- Body -->
      <div style="padding: 32px; border: 1px solid #eee; border-top: none; border-radius: 0 0 12px 12px;">

        <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 6px;">ขอบคุณสำหรับคำสั่งซื้อ!</h2>
        <p style="color: #666; font-size: 14px; margin: 0 0 24px;">
          คำสั่งซื้อ <strong style="color: #111;">${fmtOrderId(orderId)}</strong> ได้รับการยืนยันแล้ว
        </p>

        <!-- Items -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr>
              <th style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999; text-align: left; padding-bottom: 8px; border-bottom: 2px solid #eee;">สินค้า</th>
              <th style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999; text-align: center; padding-bottom: 8px; border-bottom: 2px solid #eee;">จำนวน</th>
              <th style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999; text-align: right; padding-bottom: 8px; border-bottom: 2px solid #eee;">ราคา</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <!-- Total -->
        <div style="display: flex; justify-content: space-between; padding: 14px 0; border-top: 2px solid #111; margin-bottom: 28px;">
          <span style="font-size: 15px; font-weight: 700;">ยอดรวม</span>
          <span style="font-size: 17px; font-weight: 700;">฿${totalAmount.toLocaleString()}</span>
        </div>

        <!-- Shipping -->
        <div style="background: #f9f9f9; border-radius: 10px; padding: 18px 20px; margin-bottom: 28px;">
          <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999; margin: 0 0 10px;">ที่อยู่จัดส่ง</p>
          <p style="font-size: 14px; font-weight: 600; margin: 0 0 4px;">${shipping.firstName} ${shipping.lastName}</p>
          <p style="font-size: 14px; color: #555; margin: 0 0 4px;">${shippingAddress}</p>
          <p style="font-size: 14px; color: #555; margin: 0;">${shipping.phone}</p>
        </div>

        <p style="font-size: 13px; color: #999; margin: 0; text-align: center;">
          หากมีคำถามเกี่ยวกับคำสั่งซื้อ กรุณาติดต่อทีมงาน
        </p>
      </div>
    </div>
  `;

  const emailParams = new EmailParams()
    .setFrom(new Sender(FROM_EMAIL, FROM_NAME))
    .setTo([new Recipient(to)])
    .setSubject(`ยืนยันคำสั่งซื้อ ${fmtOrderId(orderId)}`)
    .setHtml(html);

  await mailerSend.email.send(emailParams);
};
