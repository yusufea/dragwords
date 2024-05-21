import { z } from "zod";
import { router, procedure } from "../trpc";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const gameRouter = router({
  // getChars: procedure.query(async ({ ctx }) => {
  //   const locale = ctx.locale;
  //   const chars = await prisma.turkishchar.findMany({
  //     where: { language: locale },
  //   });
  //   return chars;
  // }),
  // getWords: procedure.query(async ({ ctx }) => {
  //   const locale = ctx.locale;
  //   const words = await prisma.turkishword.findMany({
  //     where: { language: locale },
  //   });
  //   return words;
  // }),
  getChars: procedure
    .input(
      z.object({
        locale: z.string(),
        chapter: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const chars = await prisma.chars.findMany({
        where: { language: input.locale, chapter: input.chapter },
      });
      return chars;
    }),
  getWords: procedure
    .input(
      z.object({
        locale: z.string(),
        chapter: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const words = await prisma.words.findMany({
        where: { language: input.locale, chapter: input.chapter },
      });
      return words;
    }),
  getChapters: procedure.query(async ({ ctx }) => {
    const chapters = await prisma.chars.findMany({
      distinct: ["chapter"],
      select: {
        chapter: true,
      },
    });
    return chapters.map((chapter) => chapter.chapter).reverse();
  }),
});
