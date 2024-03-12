import bcrypt from 'bcrypt';
import Admin from '../models/adminModel';
import { sendMail } from '../utils/mailFunc';
import generatePassword from 'generate-password';

async function generateAdminUserAndSendEmail(email: string) {
  try {
    const generatedPassword = generatePassword.generate({
      length: 15,
      numbers: true,
      symbols: true,
      uppercase: true,
      excludeSimilarCharacters: true,
    });

    // Create the Admin user with a generated password
    const admin = await Admin.create({
      email,
      password: await bcrypt.hash(generatedPassword, 10), // Hash the password
    });

    // Send an email to the Admin user with the generated password
    const subject = 'Admin User Password';
    const html = `
      <h1>Admin User Password</h1>
      <p>Your Admin user has been created with the following password:</p>
      <p>Password: ${generatedPassword}</p>
    `;

    // Uncomment the line below when you're ready to send the email
    sendMail(admin.email, subject, html);

    console.log(`Admin user created with email: ${admin.email}`);
  } catch (error: any) {
    console.error('Error generating Admin user:', error.message);
  }
}

// Get the email from the command-line arguments
const userEmail = process.argv[2];

if (!userEmail) {
  console.error('Please provide an email address as a command-line argument.');
} else if (!isValidEmail(userEmail)) {
  console.error('Invalid email address provided.');
} else {
  generateAdminUserAndSendEmail(userEmail);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
