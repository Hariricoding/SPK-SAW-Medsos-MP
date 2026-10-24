// ─── DataTable Component ──────────────────────────────────────────────────────
// UI-GUIDELINE §4.4 — header teal, hover, peringkat 1 kuning, empty state

import { type ReactNode, useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Search, X } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  emptyMessage?: string;
  emptyIcon?: string;
  highlightFirst?: boolean;   // highlight row peringkat 1 dengan kuning
  loading?: boolean;
  actions?: ReactNode;        // tombol di atas tabel (Add, dll)
  caption?: string;
}

type SortDir = 'asc' | 'desc' | null;

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  searchable = false,
  searchPlaceholder = 'Cari...',
  searchKeys = [],
  emptyMessage = 'Belum ada data.',
  emptyIcon = '📭',
  highlightFirst = false,
  loading = false,
  actions,
  caption,
}: DataTableProps<T>) {
  const [sortKey, setSortKey]   = useState<string | null>(null);
  const [sortDir, setSortDir]   = useState<SortDir>(null);
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(1);
  const PER_PAGE = 10;

  // ── Sort ────────────────────────────────────────────────────────────────────
  const handleSort = (key: string) => {
    if (sortKey !== key) { setSortKey(key); setSortDir('asc'); }
    else if (sortDir === 'asc') setSortDir('desc');
    else { setSortKey(null); setSortDir(null); }
    setPage(1);
  };

  // ── Filter ──────────────────────────────────────────────────────────────────
  const filtered = data.filter((row) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return searchKeys.some((k) => String(row[k] ?? '').toLowerCase().includes(q));
  });

  // ── Sort apply ──────────────────────────────────────────────────────────────
  const sorted = sortKey && sortDir
    ? [...filtered].sort((a, b) => {
        const av = a[sortKey] as string | number;
        const bv = b[sortKey] as string | number;
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : filtered;

  // ── Paginate ────────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const paginated  = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // ── Sort icon ───────────────────────────────────────────────────────────────
  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortKey !== colKey) return <ChevronsUpDown size={13} className="text-gray-300" />;
    if (sortDir === 'asc')  return <ChevronUp size={13} className="text-[#287C76]" />;
    return <ChevronDown size={13} className="text-[#287C76]" />;
  };

  return (
    <div className="space-y-3">
      {/* ── Toolbar ──────────────────────────────────────── */}
      {(searchable || actions) && (
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          {searchable && (
            <div className="relative w-full sm:max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#90A4AE]" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-8 py-2 text-sm border border-[#E0E7E6] rounded-lg
                  bg-white text-[#263238] placeholder-[#90A4AE]
                  focus:outline-none focus:border-[#287C76] focus:ring-2 focus:ring-[#287C76]/10"
              />
              {search && (
                <button onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#90A4AE] hover:text-[#263238]">
                  <X size={14} />
                </button>
              )}
            </div>
          )}
          {actions && <div className="flex items-center gap-2 ml-auto">{actions}</div>}
        </div>
      )}

      {/* ── Table ────────────────────────────────────────── */}
      <div className="overflow-x-auto rounded-xl border border-[#E0E7E6] bg-white">
        <table className="w-full text-sm border-collapse" role="table">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr style={{ backgroundColor: '#F8FAF9' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  style={{ width: col.width }}
                  className={[
                    'px-4 py-3 text-xs font-semibold text-[#287C76] border-b border-[#E0E7E6]',
                    'whitespace-nowrap select-none',
                    col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left',
                    col.sortable ? 'cursor-pointer hover:bg-[#F0F7F6] transition-colors' : '',
                  ].join(' ')}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && <SortIcon colKey={col.key} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Skeleton rows
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 border-b border-[#E0E7E6]">
                      <div className="h-4 rounded shimmer" style={{ width: '70%' }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <div className="text-4xl mb-2">{emptyIcon}</div>
                  <p className="text-sm text-[#607D8B]">{emptyMessage}</p>
                  {search && (
                    <button onClick={() => setSearch('')}
                      className="mt-2 text-xs text-[#287C76] hover:underline">
                      Hapus filter
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => {
                const globalIndex = (page - 1) * PER_PAGE + i;
                const isFirst = highlightFirst && globalIndex === 0 && !sortKey && !search;
                return (
                  <tr
                    key={rowKey(row)}
                    style={isFirst ? { backgroundColor: '#FFF5AE' } : undefined}
                    className={[
                      'border-b border-[#E0E7E6] transition-colors last:border-b-0',
                      isFirst ? '' : 'hover:bg-[#F0F7F6]',
                    ].join(' ')}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={[
                          'px-4 py-3 text-[#263238]',
                          col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left',
                        ].join(' ')}
                      >
                        {col.render
                          ? col.render(row, globalIndex)
                          : String(row[col.key] ?? '-')}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ───────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-[#607D8B]">
          <span>
            Menampilkan {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, sorted.length)} dari {sorted.length} data
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1 rounded border border-[#E0E7E6] hover:bg-[#F0F7F6]
                disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ‹
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let p = i + 1;
              if (totalPages > 5) {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                p = start + i;
              }
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={[
                    'w-7 h-7 rounded border text-xs transition-colors',
                    p === page
                      ? 'bg-[#287C76] text-white border-[#287C76]'
                      : 'border-[#E0E7E6] hover:bg-[#F0F7F6]',
                  ].join(' ')}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2.5 py-1 rounded border border-[#E0E7E6] hover:bg-[#F0F7F6]
                disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
