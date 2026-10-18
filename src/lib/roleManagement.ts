export const ROLE_ASSIGNMENTS_STORAGE_KEY = 'farsRoleAssignments';

export type SystemRole = 'STAFF' | 'ADMIN' | 'SUPER_ADMIN';

export interface RoleAssignmentRecord {
  id: string;
  roleTitle: string;
  systemRole: SystemRole;
  staffIds: string[];
  permissions: string[];
  createdAt: string;
}

export const API_PERMISSIONS = ['VIEW_CLIENTS', 'EDIT_TRANSACTIONS'] as const;

/** Map UI permission toggles to backend permission names. */
export function permissionsFromToggleState(toggles: Record<string, boolean>): string[] {
  const selected = new Set<string>();

  const clientKeys = [
    'createClient',
    'editClientInformation',
    'accessOwnerInformation',
    'accountInformation',
    'accountsBalance',
  ];
  const transactionKeys = [
    'allTansactions',
    'transactionMatched',
    'editStandingOrder',
    'bankStatement',
    'accountActivities',
  ];

  for (const key of clientKeys) {
    if (toggles[key]) selected.add('VIEW_CLIENTS');
  }
  for (const key of transactionKeys) {
    if (toggles[key]) selected.add('EDIT_TRANSACTIONS');
  }

  const anyToggle = Object.values(toggles).some(Boolean);
  if (anyToggle && selected.size === 0) {
    selected.add('VIEW_CLIENTS');
  }

  return Array.from(selected);
}

export function loadRoleAssignments(): RoleAssignmentRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ROLE_ASSIGNMENTS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as RoleAssignmentRecord[];
  } catch {
    return [];
  }
}

export function saveRoleAssignments(records: RoleAssignmentRecord[]) {
  localStorage.setItem(ROLE_ASSIGNMENTS_STORAGE_KEY, JSON.stringify(records));
}

export function getLatestAssignmentForStaff(
  assignments: RoleAssignmentRecord[],
  staffId: string,
): RoleAssignmentRecord | undefined {
  for (let i = assignments.length - 1; i >= 0; i--) {
    if (assignments[i].staffIds.includes(staffId)) return assignments[i];
  }
  return undefined;
}

export function extractPermissionNames(user: { permissions?: unknown }): string[] {
  const p = user.permissions;
  if (!Array.isArray(p)) return [];
  return p
    .map((item) => (typeof item === 'string' ? item : (item as { name?: string })?.name))
    .filter((name): name is string => Boolean(name));
}
