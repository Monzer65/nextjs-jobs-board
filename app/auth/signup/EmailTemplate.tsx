interface EmailTemplateProps {
  otp: string;
  verificationLink: string;
}

export default function EmailTemplate({
  otp,
  verificationLink,
}: EmailTemplateProps) {
  return `
    <!DOCTYPE html>
    <html lang="fa">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تایید حساب کاربری جابزی</title>
      </head>
      <body style="font-family: Tahoma, Arial, sans-serif; background-color: #f4f4f9; color: #333; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 30px auto; padding: 30px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); text-align: right;">
          <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #f0f0f0; margin-bottom: 20px;">
            <h1 style="font-size: 28px; color: #333; margin: 0;">تایید حساب کاربری جابزی</h1>
          </div>
          <div style="font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 30px;">
            <p>سلام،</p>
            <p>این ایمیل برای تایید حساب کاربری شما در جابزی ارسال شده است.</p>
            <p>برای تکمیل فرایند ثبت‌نام، از کد زیر استفاده کنید:</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; font-size: 32px; font-weight: bold; color: #ffffff; background-color: #007bff; padding: 15px 30px; border-radius: 8px; letter-spacing: 4px;">${otp}</span>
          </div>
          <p style="text-align: center; font-size: 16px; margin-bottom: 20px;">یا می‌توانید با کلیک بر روی دکمه زیر، حساب کاربری خود را تایید کنید:</p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${verificationLink}" style="display: inline-block; font-size: 18px; font-weight: bold; color: #ffffff; background-color: #28a745; padding: 15px 30px; border-radius: 8px; text-decoration: none;">تایید حساب کاربری</a>
          </div>
          <div style="text-align: center; font-size: 14px; color: #999; margin-top: 40px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
            <p>اگر این درخواست توسط شما انجام نشده، این ایمیل را نادیده بگیرید.</p>
            <p>&copy; 2023 جابزی. تمامی حقوق محفوظ است.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
