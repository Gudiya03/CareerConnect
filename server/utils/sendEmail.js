const nodemailer = require("nodemailer");

/**
 * Utility function to send an email using Gmail
 * @param {Object} options - Email sending options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Subject line
 * @param {string} options.html - HTML content of the email
 */
const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"CareerConnect Platform" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html
    });

    console.log(`Email successfully dispatched to: ${options.to}`);
  } catch (err) {
    console.error(`Mailer execution failed for ${options.to}:`, err.message);
  }
};

module.exports = sendEmail;
