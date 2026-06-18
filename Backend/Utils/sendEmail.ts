import nodemailer, { type TransportOptions } from "nodemailer";
type MailOptions = Record<string, string | undefined>;
export const sendEmail = async (options: MailOptions) => {
  const transporter = nodemailer.createTransport({
    // host: process.env.SMTP_HOST!,
    // port: Number(process.env.SMTP_PORT),
    service: process.env.SMTP_SERVICE,
    secure: false,
    auth: {
      user: process.env.SMTP_MAIL!,
      pass: process.env.SMTP_PASSWORD!,
    },
  } as TransportOptions);
  const mailOptions: MailOptions = {
    from: options.emailFrom, //|| process.env.SMTP_MAIL,
    to: options.emailTo,
    subject: options.subject,
    ...(options.html ? { html: options.html } : { text: options.message }),
  };
  await transporter.sendMail(mailOptions);
};
