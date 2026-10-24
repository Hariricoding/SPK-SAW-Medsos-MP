// ─── Data Kriteria ────────────────────────────────────────────────────────────
import { useState } from 'react';
import { ListChecks, Plus, Edit2, Trash2, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import DataTable, { type Column } from '../components/ui/DataTable';
import { JenisBadge } from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { generateId } from '../utils/sawCalculation';
import type { Kriteria, KriteriaJenis } from '../types';

interface KriteriaRow extends Record<string, unknown> {
  id: string;
  kode: string;
  nama: string;
  jenis: KriteriaJenis;
  keterangan: string;
}

interface FormState {
  kode: string;
  nama: string;
  jenis: KriteriaJenis;
  keterangan: string;
}

const emptyForm: FormState = { kode: '', nama: '', jenis: 'benefit', keterangan: '' };

export default function DataKriteria() {
  const { state, dispatch } = useApp();
  const { kriteria } = state;

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Kriteria | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const rows: KriteriaRow[] = kriteria.map((k) => ({
    id: k.id,
    kode: k.kode,
    nama: k.nama,
    jenis: k.jenis,
    keterangan: k.keterangan,
  }));

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (k: Kriteria) => {
    setEditTarget(k);
    setForm({ kode: k.kode, nama: k.nama, jenis: k.jenis, keterangan: k.keterangan });
    setErrors({});
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.kode.trim()) errs.kode = 'Kode wajib diisi';
    else if (form.kode.trim().length > 5) errs.kode = 'Kode maksimal 5 karakter';
    else {
      const duplikat = kriteria.find(
        (k) =>
          k.kode.toLowerCase() === form.kode.trim().toLowerCase() &&
          k.id !== editTarget?.id
      );
      if (duplikat) errs.kode = 'Kode sudah digunakan';
    }
    if (!form.nama.trim()) errs.nama = 'Nama kriteria wajib diisi';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editTarget) {
      dispatch({
        type: 'UPDATE_KRITERIA',
        payload: {
          ...editTarget,
          kode: form.kode.trim().toUpperCase(),
          nama: form.nama.trim(),
          jenis: form.jenis,
          keterangan: form.keterangan.trim(),
        },
      });
    } else {
      const newKriteria: Kriteria = {
        id: generateId('CR'),
        kode: form.kode.trim().toUpperCase(),
        nama: form.nama.trim(),
        jenis: form.jenis,
        keterangan: form.keterangan.trim(),
      };
      dispatch({ type: 'ADD_KRITERIA', payload: newKriteria });
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setTimeout(() => {
      dispatch({ type: 'DELETE_KRITERIA', payload: deleteTarget });
      setDeleteTarget(null);
      setDeleting(false);
    }, 300);
  };

  const columns: Column<KriteriaRow>[] = [
    {
      key: 'no',
      header: 'No',
      width: '48px',
      align: 'center',
      render: (_row, idx) => <span className="text-[#607D8B] text-xs">{idx + 1}</span>,
    },
    {
      key: 'kode',
      header: 'Kode',
      width: '80px',
      render: (row) => (
        <span className="font-mono font-bold text-[#287C76] text-xs bg-[#F0F7F6] px-2 py-0.5 rounded">
          {row.kode}
        </span>
      ),
    },
    {
      key: 'nama',
      header: 'Nama Kriteria',
      render: (row) => <span className="font-medium text-[#263238]">{row.nama}</span>,
    },
    {
      key: 'jenis',
      header: 'Jenis',
      render: (row) => <JenisBadge jenis={row.jenis as KriteriaJenis} />,
    },
    {
      key: 'keterangan',
      header: 'Keterangan',
      render: (row) => (
        <span className="text-sm text-[#607D8B]">
          {(row.keterangan as string) || '-'}
        </span>
      ),
    },
    {
      key: 'aksi',
      header: 'Aksi',
      align: 'center',
      width: '100px',
      render: (row) => {
        const k = kriteria.find((c) => c.id === row.id);
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
          <ListChecks size={20} style={{ color: '#287C76' }} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#263238]">Data Kriteria</h2>
          <p className="text-sm text-[#607D8B]">Kelola kriteria penilaian konten media sosial</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E0E7E6] p-5 shadow-[0_2px_8px_rgba(40,124,118,0.08)]">
        <DataTable<KriteriaRow>
          columns={columns}
          data={rows}
          rowKey={(r) => r.id as string}
          searchable
          searchPlaceholder="Cari kode atau nama kriteria..."
          searchKeys={['kode', 'nama']}
          emptyMessage="Belum ada kriteria. Tambahkan kriteria pertama."
          emptyIcon="📋"
          actions={
            <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={openAdd}>
              Tambah Kriteria
            </Button>
          }
        />
      </div>

      {/* Info Card */}
      <div
        className="flex items-start gap-3 rounded-xl p-4 border"
        style={{ backgroundColor: '#F0F7F6', borderColor: '#C8D8D6' }}
      >
        <Info size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#287C76' }} />
        <p className="text-sm text-[#607D8B]">
          <span className="font-semibold text-[#263238]">Jenis Kriteria: </span>
          Kriteria <span className="font-medium text-green-600">Benefit</span> — semakin besar nilai semakin baik (dihitung dari nilai maksimum).
          Kriteria <span className="font-medium text-red-500">Cost</span> — semakin kecil nilai semakin baik (dihitung dari nilai minimum).
        </p>
      </div>

      {/* Modal Tambah/Edit */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'Edit Kriteria' : 'Tambah Kriteria Baru'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {editTarget ? 'Simpan Perubahan' : 'Tambah Kriteria'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Kode */}
          <div>
            <label className="block text-sm font-medium text-[#263238] mb-1">
              Kode <span className="text-red-500">*</span>
              <span className="text-xs font-normal text-[#607D8B] ml-1">(maks. 5 karakter)</span>
            </label>
            <input
              type="text"
              value={form.kode}
              onChange={(e) => setForm((f) => ({ ...f, kode: e.target.value }))}
              placeholder="C1, C2, ..."
              maxLength={5}
              className="w-full px-3 py-2 text-sm border border-[#E0E7E6] rounded-lg text-[#263238] placeholder-[#90A4AE] font-mono"
            />
            {errors.kode && <p className="text-xs text-red-500 mt-1">{errors.kode}</p>}
          </div>

          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-[#263238] mb-1">
              Nama Kriteria <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.nama}
              onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
              placeholder="Nama kriteria, mis. Views, Likes"
              className="w-full px-3 py-2 text-sm border border-[#E0E7E6] rounded-lg text-[#263238] placeholder-[#90A4AE]"
            />
            {errors.nama && <p className="text-xs text-red-500 mt-1">{errors.nama}</p>}
          </div>

          {/* Jenis */}
          <div>
            <label className="block text-sm font-medium text-[#263238] mb-1">Jenis</label>
            <select
              value={form.jenis}
              onChange={(e) => setForm((f) => ({ ...f, jenis: e.target.value as KriteriaJenis }))}
              className="w-full px-3 py-2 text-sm border border-[#E0E7E6] rounded-lg text-[#263238] bg-white"
            >
              <option value="benefit">Benefit (semakin besar semakin baik)</option>
              <option value="cost">Cost (semakin kecil semakin baik)</option>
            </select>
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-sm font-medium text-[#263238] mb-1">Keterangan</label>
            <textarea
              value={form.keterangan}
              onChange={(e) => setForm((f) => ({ ...f, keterangan: e.target.value }))}
              placeholder="Deskripsi singkat kriteria..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-[#E0E7E6] rounded-lg text-[#263238] placeholder-[#90A4AE] resize-none"
            />
          </div>
        </div>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Kriteria?"
        message="Kriteria ini beserta bobotnya akan dihapus. Semua penilaian yang terkait juga akan dihapus dan hasil SAW akan direset."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
