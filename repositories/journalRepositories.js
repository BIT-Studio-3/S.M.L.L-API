import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class JournalRepository {
  async create(data) {
    return prisma.journal.create({ data });
  }

  async findAll() {
    return  prisma.journal.findMany();
  }

  async findById(id) {
    return prisma.journal.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId) {
    return prisma.journal.findMany({
      where: { userId },
    });
  }

  async findByIdAndUserId(id, userId) {
    return prisma.journal.findFirst({
      where: { id, userId },
    });
  }

  async update(id, data) {
    return prisma.journal.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return prisma.journal.delete({
      where: { id },
    });
  }
}

export default new JournalRepository();