import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/**
 * Extracts a capitalized name from an email address
 * @param {string} email - The recipient's email address
 * @returns {string} Capitalized name extracted from the email
 */
function extractNameFromEmail(email) {
  // Check if the email starts with "cia-"
  if (email.startsWith("cia-")) {
    return "QM";
  }

  // Split the email at the '@' and take the first part
  const name = email.split("@")[0];

  // Capitalize the first letter, make the rest lowercase
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

// Create the transporter object using SMTP credentials from .env
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for port 465, false for 587
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Sends an email to multiple recipients with error tracking.
 *
 * @param {string[]} recipients - Array of recipient email addresses.
 * @param {string} subject - Subject of the email.
 * @param {string} body - HTML content of the email.
 * @returns {Promise<object>} - Returns an object with success and failure counts.
 */
async function sendEmail(recipients, subject, body) {
  let successCount = 0;
  let failureCount = 0;
  const failureList = [];

  // Loop through each recipient to send emails individually
  for (const recipient of recipients) {
    // Check if body already contains Hello and Micromax Dashboard to avoid duplication
    let personalizedBody;
    if (!body.includes("Hello") && !body.includes("Micromax Dashboard")) {
      personalizedBody = `\nHello ${extractNameFromEmail(
        recipient
      )},\n\n${body}\n\nMicromax Dashboard\n`;
    } else {
      personalizedBody = body;
    }

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: recipient,
      subject: subject,
      text: personalizedBody.replace(/<[^>]*>/g, ""), // Plain text version of the body (remove HTML tags)
      html: personalizedBody.replace(/\n/g, "<br>"),
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Message sent to ${recipient}: %s`, info.messageId);
      successCount++;
    } catch (error) {
      console.error(`Error sending email to ${recipient}:`, error.message);
      failureCount++;
      failureList.push({
        recipient,
        error: error.message,
        errorType: error.code || "UNKNOWN_ERROR",
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Log summary of email sending results
  console.log(`Emails sent: ${successCount}`);
  console.log(`Failures: ${failureCount}`);
  if (failureList.length > 0) {
    console.log("Failed recipients:", failureList);
  }

  // Return detailed results for further handling
  return {
    successCount,
    failureCount,
    failures: failureList,
  };
}

export default sendEmail;
