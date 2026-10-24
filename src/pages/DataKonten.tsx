// ─── Data Konten ──────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Database, Plus, Edit2, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import DataTable, { type Column } from '../components/ui/DataTable';
import { PlatformBadge } from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { generateId } from '../utils/sawCalculation';
import type { Konten, Platform } from '../types';

const PLATFORMS: Platform[] = ['instagram', 'tiktok', 'youtube', 'twitter', 'facebook'];

function formatTanggal(iso: string): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

interface KontenRow extends Record<string, unknown> {
  id: string;
  nama: string;
  platform: Platform;
  url: string;
  tanggalPublikasi: string;
}

interface FormState {
  nama: string;
  platform: Platform;
  url: string;
  tanggalPublikasi: string;
}

const emptyForm: FormState = {
  nama: '',
  platform: 'instagram',
  url: '',
  tanggalPublikasi: '',
};

export default function DataKonten() {
  const { state, dispatch } = useApp();
  const { konten } = state;

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Konten | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const rows: KontenRow[] = konten.map((k) => ({
    id: k.id,
    nama: k.nama,
    platform: k.platform,
    url: k.url,
    tanggalPublikasi: k.tanggalPublikasi,
  }));

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (k: Konten) => {
    setEditTarget(k);
    setForm({
      nama: k.nama,
      platform: k.platform,
      url: k.url,
      tanggalPublikasi: k.tanggalPublikasi,
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.nama.trim()) errs.nama = 'Nama konten wajib diisi';
    if (!form.platform) errs.platform = 'Platform wajib dipilih';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editTarget) {
      dispatch({
        type: 'UPDATE_KONTEN',
        payload: {
          ...editTarget,
          nama: form.nama.trim(),
          platform: form.platform,
          url: form.url.trim(),
          tanggalPublikasi: form.tanggalPublikasi,
        },
      });
    } else {
      const newKonten: Konten = {
        id: generateId('K'),
        nama: form.nama.trim(),
        platform: form.platform,
        url: form.url.trim(),
        tanggalPublikasi: form.tanggalPublikasi,
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_KONTEN', payload: newKonten });
    }
    dispatch({ type: 'CLEAR_HASIL_SAW' });
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setTimeout(() => {
      dispatch({ type: 'DELETE_KONTEN', payload: deleteTarget });
      dispatch({ type: 'CLEAR_HASIL_SAW' });
      setDeleteTarget(null);
      setDeleting(false);
    }, 300);
  };

  const columns: Column<KontenRow>[] = [
    {
      key: 'no',
      header: 'No',
      width: '48px',
      align: 'center',
      render: (_row, idx) => <span className="text-[#607D8B] text-xs">{idx + 1}</span>,
    },
    {
      key: 'nama',
      header: 'Nama Konten',
      render: (row) => <span className="font-medium text-[#263238]">{row.nama}</span>,
    },
    {
      key: 'platform',
      header: 'Platform',
      render: (row) => <PlatformBadge platform={row.platform as Platform} />,
    },
    {
      key: 'url',
      header: 'URL',
      render: (row) => (
        <a
          href={row.url as string}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#287C76] hover:underline text-xs truncate max-w-[200px] block"
          title={row.url as string}
        >
          {(row.url as string).replace(/^https?:\/\//, '').slice(0, 30)}
          {(row.url as string).length > 30 ? '…' : ''}
        </a>
      ),
    },
    {
      key: 'tanggalPublikasi',
      header: 'Tanggal Publikasi',
      render: (row) => (
        <span className="text-sm text-[#607D8B]">{formatTanggal(row.tanggalPublikasi as string)}</span>
      ),
    },
    {
      key: 'aksi',
      header: 'Aksi',
      align: 'center',
      width: '100px',
      render: (row) => {
        const k = konten.find((c) => c.id === row.id);
        return (
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={() => k && openEdit(k)}
              className="p-1.5 rounded-lg text-[#287C76] hover:bg-[#F0F7F6] transition-colors"
              title="Edit"
            >
              <Edit2 size={15} />
            </button>
            <button
              onClick={() => setDeleteTarget(row.id as string)}
              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
              title="Hapus"
            >
              <Trash2 size={15} />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(40,124,118,0.1)' }}
        >
          <Database size={20} style={{ color: '#287C76' }} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#263238]">Data Konten</h2>
          <p className="text-sm text-[#607D8B]">Kelola daftar konten media sosial yang akan dinilai</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E0E7E6] p-5 shadow-[0_2px_8px_rgba(40,124,118,0.08)]">
        <DataTable<KontenRow>
          columns={columns}
          data={rows}
          rowKey={(r) => r.id as string}
          searchable
          searchPlaceholder="Cari nama atau platform..."
          searchKeys={['nama', 'platform']}
          emptyMessage="Belum ada konten. Tambahkan konten pertama."
          emptyIcon="📄"
          actions={
            <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={openAdd}>
              Tambah Konten
            </Button>
          }
        />
      </div>

      {/* Modal Tambah/Edit */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'Edit Konten' : 'Tambah Konten Baru'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {editTarget ? 'Simpan Perubahan' : 'Tambah Konten'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-[#263238] mb-1">
              Nama Konten <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.nama}
              onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
              placeholder="Judul atau nama konten"
              className="w-full px-3 py-2 text-sm border border-[#E0E7E6] rounded-lg text-[#263238] placeholder-[#90A4AE]"
            />
            {errors.nama && <p className="text-xs text-red-500 mt-1">{errors.nama}</p>}
          </div>

          {/* Platform */}
          <div>
            <label className="block text-sm font-medium text-[#263238] mb-1">
              Platform <span className="text-red-500">*</span>
            </label>
            <select
              value={form.platform}
              onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value as Platform }))}
              className="w-full px-3 py-2 text-sm border border-[#E0E7E6] rounded-lg text-[#263238] bg-white"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
            {errors.platform && <p className="text-xs text-red-500 mt-1">{errors.platform}</p>}
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-[#263238] mb-1">URL</label>
            <input
              type="url"
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              placeholder="https://..."
              className="w-full px-3 py-2 text-sm border border-[#E0E7E6] rounded-lg text-[#263238] placeholder-[#90A4AE]"
            />
          </div>

          {/* Tanggal Publikasi */}
          <div>
            <label className="block text-sm font-medium text-[#263238] mb-1">
              Tanggal Publikasi
            </label>
            <input
              type="date"
              value={form.tanggalPublikasi}
              onChange={(e) => setForm((f) => ({ ...f, tanggalPublikasi: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-[#E0E7E6] rounded-lg text-[#263238]"
            />
          </div>
        </div>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Konten?"
        message="Konten ini beserta semua penilaiannya akan dihapus permanen. Hasil SAW akan direset."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
