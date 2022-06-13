import { extendType, objectType } from 'nexus';
import { resolve } from 'path';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.string('name');
  },
});

export const UsersQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('users', {
      type: 'User',
      resolve(parent, arg, context) {
        return context.prisma.user.findMany();
      },
    });
  },
});
