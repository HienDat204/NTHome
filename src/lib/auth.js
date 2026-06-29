import bcrypt from "bcryptjs";
import prisma from "./prisma";

export async function verifyAdmin(email, password) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return null;
  const valid = await bcrypt.compare(password, admin.password);
  return valid ? admin : null;
}
