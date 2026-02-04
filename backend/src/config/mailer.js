import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/* ===================== ENV VALIDATION ===================== */
const requiredEnvVars = ["EMAIL_USER", "EMAIL_PASS"];
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName],
);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`,
  );
}

/* ===================== TRANSPORTER ===================== */
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP transporter verification failed:", error);
  } else {
    console.log("✅ SMTP transporter is ready");
  }
});

/* ===================== EMAIL TEMPLATE ===================== */
const getEmailTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI Counsellor</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:linear-gradient(135deg,#667eea,#764ba2);min-height:100vh;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:white;border-radius:16px 16px 0 0;padding:32px;text-align:center;">
      <h1 style="margin:0;color:#667eea;">🎓 AI COUNSELLOR</h1>
      <p style="color:#64748b;">Your Study Abroad Companion</p>
    </div>

    <div style="background:white;padding:40px;border-radius:0 0 16px 16px;">
      ${content}

      <div style="margin-top:40px;text-align:center;border-top:1px solid #e5e7eb;padding-top:24px;">
        <p style="font-size:12px;color:#94a3b8;">
          © 2026 AI Counsellor. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;

/* ===================== OTP EMAIL ===================== */
const sendOtpEmail = async (email, otp) => {
  const content = `
    <h2 style="text-align:center;">Verify Your Account</h2>
    <p style="text-align:center;">Use the OTP below:</p>
    <h1 style="text-align:center;letter-spacing:6px;">${otp}</h1>
    <p style="text-align:center;">Valid for 10 minutes</p>
  `;

  const mailOptions = {
    from: `"AI Counsellor" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔐 Verify Your Account",
    html: getEmailTemplate(content),
  };

  await transporter.sendMail(mailOptions);
  return { success: true };
};

/* ===================== RESET PASSWORD ===================== */
const sendResetPasswordEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password/${token}`;

  const content = `
    <h2 style="text-align:center;">Reset Your Password</h2>
    <p style="text-align:center;">
      <a href="${resetUrl}">Click here to reset</a>
    </p>
  `;

  await transporter.sendMail({
    from: `"AI Counsellor" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔑 Reset Password",
    html: getEmailTemplate(content),
  });

  return { success: true };
};

/* ===================== APPLICATION SUBMISSION ===================== */
const sendApplicationSubmissionEmail = async (
  email,
  universityName,
  program,
  applicationDate,
) => {
  const content = `
    <h2>Application Submitted 🎉</h2>
    <p><strong>University:</strong> ${universityName}</p>
    <p><strong>Program:</strong> ${program}</p>
    <p><strong>Date:</strong> ${new Date(applicationDate).toDateString()}</p>
  `;

  await transporter.sendMail({
    from: `"AI Counsellor" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `✅ Application Submitted: ${universityName}`,
    html: getEmailTemplate(content),
  });

  return { success: true };
};

/* ===================== PROFILE REMINDER ===================== */
const sendProfileReminderEmail = async (email, userName) => {
  const content = `
    <h2>Hello ${userName || "there"} 👋</h2>
    <p>Please complete your profile to get better recommendations.</p>
  `;

  await transporter.sendMail({
    from: `"AI Counsellor" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "⏰ Complete Your Profile",
    html: getEmailTemplate(content),
  });

  return { success: true };
};

export {
  sendOtpEmail,
  sendResetPasswordEmail,
  sendApplicationSubmissionEmail,
  sendProfileReminderEmail,
};
