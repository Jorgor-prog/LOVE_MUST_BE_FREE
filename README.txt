
Install
npm install

Generate client
npx prisma generate

Build
npm run build

Run migrations and seed then start
npx prisma migrate deploy
npm run seed
npm run start

Environment
DATABASE_URL
SESSION_SECRET
ADMIN_LOGIN
ADMIN_PASSWORD
NODE_VERSION

Render
Set build command to npm install && npx prisma generate && npm run build
Set start command to npx prisma migrate deploy && node prisma/seed.js && npm run start
