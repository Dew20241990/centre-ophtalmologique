import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-h-screen flex-col transition-all duration-300 lg:ms-[264px]" style={{ marginLeft: collapsed ? '76px' : '264px' }}>
        <TopNav
          onToggleSidebar={() => setCollapsed(!collapsed)}
          onToggleMobile={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-4 lg:p-6">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
