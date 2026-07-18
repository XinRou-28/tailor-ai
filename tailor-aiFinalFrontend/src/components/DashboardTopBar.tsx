interface DashboardTopBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onProfileClick?: () => void;
  userEmail?: string;
}

export default function DashboardTopBar({ searchQuery, onSearchChange, onProfileClick, userEmail }: DashboardTopBarProps) {
  return null;
}
