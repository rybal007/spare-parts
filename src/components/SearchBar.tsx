import { Search } from "lucide-react";

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
}

export default function SearchBar({
  search,
  setSearch,
}: SearchBarProps) {
  return (
    <div className="search-wrap">
      <Search size={18} />

      <input
        type="text"
        placeholder="Search spare parts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}