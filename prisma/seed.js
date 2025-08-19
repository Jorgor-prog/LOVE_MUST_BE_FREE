
import { PrismaClient } from "@prisma/client"
import crypto from "crypto"
const prisma = new PrismaClient()

async function main() {
  const adminLogin = process.env.ADMIN_LOGIN || "Admin303"
  const adminPass = process.env.ADMIN_PASSWORD || "T7#jZx9!rB2mLq4@"
  const a = await prisma.user.upsert({
    where: { loginId: adminLogin },
    update: { loginPassword: adminPass, role: "ADMIN" },
    create: { loginId: adminLogin, loginPassword: adminPass, role: "ADMIN" }
  })
  const demoUser = await prisma.user.upsert({
    where: { loginId: "demo_user" },
    update: {},
    create: { loginId: "demo_user", loginPassword: "demo_pass", role: "USER",
      profile: { create: { nameOnSite: "Demo", idOnSite: "ID12345", residence: "NYC"} },
      codeConfig: { create: { lastStep: 1, paused: false } }
    }
  })
}

main().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1)})
