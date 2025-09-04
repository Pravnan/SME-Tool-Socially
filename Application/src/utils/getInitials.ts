export function getInitials(name?: string | null) {
  if (!name) return 'U';
  const parts = name.trim().split(' ').filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + (last || '') || 'U').toUpperCase();
}
