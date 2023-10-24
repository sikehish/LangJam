const bcrypt = require('bcrypt');
const saltRounds = 10; // You can adjust the number of salt rounds as needed

const password = process.argv[2]; // Get the password from the command line argument

if (!password) {
  console.error('Please provide a password as a command-line argument.');
  process.exit(1);
}

// Generate the hash
bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating the hash:', err);
  } else {
    console.log('Generated Hash:', hash);
    
  }
});
