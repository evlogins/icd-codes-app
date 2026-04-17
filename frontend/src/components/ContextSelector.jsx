import { useAppContext } from '../state/AppContext';
import './ContextSelector.css';

const CONTEXTS = [
  { id: 'clinical',     label: 'Clinical' },
  { id: 'billing',      label: 'Billing' },
  { id: 'research',     label: 'Research' },
  { id: 'public_health', label: 'Public Health' }
];

export default function ContextSelector({ variant = 'default' }) {
  const { context, setContext } = useAppContext();
  return (
    <div className={'ctx ctx--' + variant} role="radiogroup" aria-label="Purpose">
      <span className="ctx-label">Purpose</span>
      <div className="ctx-pills">
        {CONTEXTS.map((c) => {
          const active = context === c.id;
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={active}
              className={'ctx-pill' + (active ? ' is-active' : '')}
              onClick={() => setContext(c.id)}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
