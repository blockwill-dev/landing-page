import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { env } from "@/env";
import { TRPCError } from "@trpc/server";

export const waitlistRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        page: z.number().min(0).default(0),
        limit: z.number().min(1).max(100).default(100),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit } = input;
      const skip = page * limit;

      const [entries, total] = await Promise.all([
        ctx.db.waitlist.findMany({
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        ctx.db.waitlist.count(),
      ]);

      return {
        entries,
        total,
        hasMore: skip + entries.length < total,
      };
    }),

  getCount: publicProcedure.query(async ({ ctx }) => {
    const count = await ctx.db.waitlist.count();
    return { count };
  }),
});
