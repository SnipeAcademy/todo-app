interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden px-3 py-1.5 bg-white">
      <input
        data-testid="search-bar"
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search todos..."
        className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
      />
      {value.length > 0 && (
        <button
          data-testid="search-clear-btn"
          onClick={() => onChange('')}
          className="ml-2 text-gray-400 hover:text-gray-600 text-base leading-none"
          aria-label="Clear search"
        >
          x
        </button>
      )}
    </div>
  );
}
