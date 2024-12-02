import nodemailer from "nodemailer";
import EmailTemplate from "./EmailTemplate";

const sendVerificationEmail = async (contact: string, code: string) => {
  try {
    const verificationLink = `http://localhost:3000/auth/verify?email=${encodeURIComponent(
      contact
    )}&code=${code}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const emailHtml = EmailTemplate({ code, verificationLink });

    const info = await transporter.sendMail({
      from: `"جابزی 👻" <exclusiveautoparts.shop@zohomail.com>`,
      to: contact,
      subject: "کد تایید حساب کاربری",
      html: emailHtml,
    });

    return info.messageId;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending verification email");
  }
};

export default sendVerificationEmail;
