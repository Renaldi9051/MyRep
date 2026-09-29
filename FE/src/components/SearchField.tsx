import { Search, X } from 'lucide-react';

// F1.3: hasil muncul sambil mengetik, tanpa tekan enter
export function SearchField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="search">
      <Search size={20} strokeWidth={1.75} />
      <input
        type="search"
        inputMode="search"
        placeholder="Cari latihan"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        enterKeyHint="search"
        autoComplete="off"
        aria-label="Cari latihan"
      />
      {value && (
        <button type="button" className="search__clear" aria-label="Hapus pencarian" onClick={() => onChange('')}>
          <X size={18} strokeWidth={1.75} />
        </button>
      )}
    </label>
  );
}
