import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error('Usage: npm run hash-password "your-password"');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log("\nCopy this into .env.local as ADMIN_PASSWORD_HASH:\n");
console.log(hash);
console.log();
