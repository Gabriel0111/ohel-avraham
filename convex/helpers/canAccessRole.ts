import { RoleType } from "../enums";

const ROLE_HIERARCHY: Record<RoleType, number> = {
  admin: 3,
  user: 1,
  guest: 1,
  host: 1,
  "guest:host": 1,
} as const;

export function canAccess(
  actorRole: RoleType | undefined,
  minRoleRequired?: RoleType,
): boolean {
  if (!minRoleRequired) return true;

  const actorLevel = ROLE_HIERARCHY[actorRole ?? "guest"] ?? 0;
  const targetLevel = ROLE_HIERARCHY[minRoleRequired] ?? 0;

  return actorLevel >= targetLevel;
}
