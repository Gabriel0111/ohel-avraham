import { RoleType } from "../enums";

const ROLE_HIERARCHY: Record<RoleType, number> = {
  admin: 3,
  rabbi: 2,
  user: 1,
  guest: 1,
  host: 1,
  "guest:host": 1,
} as const;

export function canModifyRole(
  actorRole: RoleType,
  targetRole: RoleType,
): boolean {
  const actorLevel =
    ROLE_HIERARCHY[actorRole as keyof typeof ROLE_HIERARCHY] || 0;
  const targetLevel =
    ROLE_HIERARCHY[targetRole as keyof typeof ROLE_HIERARCHY] || 0;
  return actorLevel >= targetLevel;
}
