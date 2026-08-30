import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 465),
    secure: process.env.EMAIL_SECURE !== "false", // true for port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export async function sendVerificationEmail({ to, codeName, token }) {
  const transporter = getTransporter();
  const verifyUrl = `${process.env.BASE_URL}/api/verify?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject: "Confirm your interest",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2>Hey ${codeName || "there"},</h2>
        <p>Thanks for signing up. Please confirm your email to complete your entry:</p>
        <p>
          <a href="${verifyUrl}"
             style="display:inline-block;padding:12px 20px;background:#8E3A50;color:#fff;
                    text-decoration:none;border-radius:6px;">
            Verify my email
          </a>
        </p>
        <p>Or copy this link into your browser:</p>
        <p>${verifyUrl}</p>
      </div>
    `,
  });
}

export async function sendConfirmationEmail({ to, codeName }) {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject: "You're in!",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <p>Hey ${codeName || "there"},</p>
        <p>You're in! We'll be in touch shortly.</p>
      </div>
    `,
  });
}
