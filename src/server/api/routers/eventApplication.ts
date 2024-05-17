import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "../trpc";

const PAGE_SIZE = 20;

export const eventApplicationRouter = createTRPCRouter({
  findAllEventApplications: protectedProcedure
    .input(z.object({ offset: z.number().optional() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.eventApplication.findMany({
        take: PAGE_SIZE, skip: (input.offset || 0) * PAGE_SIZE,
        include: {
          approvingUser: true,
          submittingUser: true,
        }
      })
    }),
  findEventApplicationById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.eventApplication.findUnique({
        where: {
          oid: input.id,
        },
        include: {
          approvingUser: true,
          submittingUser: true,
        }
      });
    }),
  findPendingEventApplicationsByUserId: protectedProcedure
    .input(z.object({
      userId: z.string(),
    }))
    .query(({ ctx, input }) => {
      return ctx.prisma.eventApplication.findMany({
        where: {
          submittingUserId: input.userId,
          status: "Pending Review",
        },
        include: {
          approvingUser: true,
          submittingUser: true,
        }
      });
    }),
  findFinalizedEventApplicationsByUserId: protectedProcedure
    .input(z.object({
      userId: z.string(),
    }))
    .query(({ ctx, input }) => {
      return ctx.prisma.eventApplication.findMany({
        where: {
          submittingUserId: input.userId,
          NOT: {
            status: "Pending Review"
          }
        },
        include: {
          approvingUser: true,
          submittingUser: true,
        }
      });
    }),
  insertOneEventApplication: protectedProcedure
    .input(
      z.object({
        osrsName: z.string(),
        discordName: z.string(),
        teamCaptain: z.boolean(),
        experience: z.string().array(),
        combatLevel: z.number(),
        hasAlt: z.string(),
        altNames: z.string(),
        isIron: z.boolean(),
        willSplit: z.boolean(),
        hoursPerDay: z.number(),
        scheduleDetails: z.string(),
        region: z.string(),
        bankValue: z.number(),
        weapons: z.string().array(),
        confirmRules: z.boolean(),
        status: z.string(),
        submittingUserId: z.string(),
        approvingUserId: z.string().optional(),
        approvingUserName: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.eventApplication.create({
        data: {
          status: input.status,
          osrsName: input.osrsName,
          discordName: input.discordName,
          teamCaptain: input.teamCaptain,
          experience: input.experience,
          combatLevel: input.combatLevel,
          hasAlt: input.hasAlt,
          altNames: input.altNames,
          isIron: input.isIron,
          willSplit: input.willSplit,
          hoursPerDay: input.hoursPerDay,
          scheduleDetails: input.scheduleDetails,
          region: input.region,
          bankValue: input.bankValue,
          weapons: input.weapons,
          confirmRules: input.confirmRules,
          ...input.approvingUserId && { approvingUserId: input.approvingUserId },
          ...input.approvingUserName && { approvingUserName: input.approvingUserName },
          submittingUserId: input.submittingUserId
        }
      });
    }),
});
