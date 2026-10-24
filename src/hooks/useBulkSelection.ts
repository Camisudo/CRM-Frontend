import { useCallback, useState } from "react";

/**
 * Selection state for list pages. The API has no bulk endpoints,
 * so bulk actions run per-item requests; this only tracks the selection.
 */
export function useBulkSelection<T extends { id: string }>(items: T[]) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const allSelected = items.length > 0 && items.every((i) => selected.has(i.id));

  const toggleAll = useCallback(() => {
    setSelected(allSelected ? new Set() : new Set(items.map((i) => i.id)));
  }, [allSelected, items]);

  const clear = useCallback(() => setSelected(new Set()), []);

  return { selected, selectedIds: [...selected], toggle, toggleAll, allSelected, clear };
}
