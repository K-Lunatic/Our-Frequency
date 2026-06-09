import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="relative min-h-screen bg-[#FCF9F2] text-stone-800 overflow-x-hidden font-suit">
      <div className="relative z-10">
        <Outlet />
      </div>
    </div>
  );
}