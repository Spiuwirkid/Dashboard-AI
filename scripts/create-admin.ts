import { createAdmin } from '../src/services/admin';

const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
  console.error('Usage: ts-node create-admin.ts <username> <password>');
  process.exit(1);
}

createAdmin(username, password)
  .then((id) => {
    console.log(`Admin created successfully with id: ${id}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to create admin:', error);
    process.exit(1);
  }); 