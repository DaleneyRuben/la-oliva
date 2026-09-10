import { ROLES, type UserRole } from '@/constants/roles';
import type { AppUser } from '@/features/users/hooks/useUsers';

export const USER_ROLE_DISPLAY_ORDER: UserRole[] = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.AUDIT,
  ROLES.KITCHEN,
  ROLES.DELIVERY,
  ROLES.NUTRITIONIST,
];

const roleRank = new Map(USER_ROLE_DISPLAY_ORDER.map((role, index) => [role, index]));

export const sortUsersByRole = (users: AppUser[]): AppUser[] =>
  [...users].sort(
    (firstUser, secondUser) =>
      (roleRank.get(firstUser.role) ?? Infinity) - (roleRank.get(secondUser.role) ?? Infinity),
  );
