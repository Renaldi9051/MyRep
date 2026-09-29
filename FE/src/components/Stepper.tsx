import { Minus, Plus } from 'lucide-react';
import { useHoldRepeat } from './useHoldRepeat';

type Props = {
  label: string;
  // Nilai lengkap dengan satuan, mis. "40 kg"
  value: string;
  onDec: () => void;
  onInc: () => void;
  canDec?: boolean;
  canInc?: boolean;
};

// DESIGN §5.6: pil ( −  Beban 40 kg  + ). Tahan tombol untuk mengulang cepat.
export function Stepper({ label, value, onDec, onInc, canDec = true, canInc = true }: Props) {
  const dec = useHoldRepeat(onDec, !canDec);
  const inc = useHoldRepeat(onInc, !canInc);

  return (
    <div className="stepper">
      <button type="button" className="icon-circle" aria-label={`Kurangi ${label.toLowerCase()}`} disabled={!canDec} {...dec}>
        <Minus size={22} strokeWidth={1.75} />
      </button>
      <output className="stepper__text" aria-live="polite">
        <span className="muted">{label} </span>
        <span className="stepper__value">{value}</span>
      </output>
      <button type="button" className="icon-circle" aria-label={`Tambah ${label.toLowerCase()}`} disabled={!canInc} {...inc}>
        <Plus size={22} strokeWidth={1.75} />
      </button>
    </div>
  );
}
