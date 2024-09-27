import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class UserRepository {
  async create(data) {
    return await prisma.user.create({ data });
  }

  async findAll() {
    return await prisma.user.findMany({
      include: { journals: true },
    });
  }

  async findById(id) {
    return await prisma.user.findUnique({
      where: { id },
      include: { journals: true },
    });
  }

  async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id, data) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return await prisma.user.delete({
      where: { id },
    });
  }
}

export default new UserRepository();