import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
console.log("💡 USER:", process.env.SMTP_USER);
console.log("🔐 PASS:", process.env.SMTP_PASS ? "CARGADA ✅" : "FALTA ❌");


export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false //  Esto ignora el error de certificado quitar en produccion
  }
});



export const sendMail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"Terranova Connect" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html
  });
};
