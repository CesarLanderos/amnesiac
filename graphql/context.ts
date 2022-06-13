import { YogaInitialContext } from '@graphql-yoga/node';
import { PrismaClient } from '@prisma/client';
import prisma from '../lib/prisma';

export type Context = {
  prisma: PrismaClient;
};

export function createContext(initialContext: YogaInitialContext): Context {
  return { prisma };
}
