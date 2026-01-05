import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ClipboardList,
  MapPin,
  Calendar,
  Package,
  Stethoscope,
  Store,
  FileText,
  CheckSquare,
  DollarSign,
  BarChart3,
  Settings,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mrNavItems = [
  { title: 'Dashboard', url: '/mr/dashboard', icon: LayoutDashboard },
  { title: 'Punch Visit', url: '/mr/visit', icon: MapPin },
  { title: 'My Tasks', url: '/mr/tasks', icon: ClipboardList },
  { title: 'Attendance', url: '/mr/attendance', icon: Calendar },
  { title: 'Doctors', url: '/mr/doctors', icon: Stethoscope },
  { title: 'Products', url: '/mr/products', icon: Package },
  { title: 'Daily Report', url: '/mr/explanation', icon: FileText },
];

const adminNavItems = [
  { title: 'Dashboard', url: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'MR Tracking', url: '/admin/mr-tracking', icon: MapPin },
  { title: 'Tasks', url: '/admin/tasks', icon: ClipboardList },
  { title: 'Approvals', url: '/admin/approvals', icon: CheckSquare },
  { title: 'Doctors', url: '/admin/doctors', icon: Stethoscope },
  { title: 'Shops', url: '/admin/shops', icon: Store },
  { title: 'Products', url: '/admin/products', icon: Package },
  { title: 'MR Management', url: '/admin/mrs', icon: Users },
  { title: 'Expenses', url: '/admin/expenses', icon: DollarSign },
  { title: 'Reports', url: '/admin/reports', icon: BarChart3 },
];

export const AppSidebar: React.FC = () => {
  const { user, company, isAdmin } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const navItems = isAdmin ? adminNavItems : mrNavItems;

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg shrink-0">
            R
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-sidebar-foreground truncate">
                {company.name}
              </span>
              <span className="text-xs text-sidebar-foreground/70 capitalize">
                {user?.role} Portal
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="scrollbar-thin">
        <SidebarGroup>
          <SidebarGroupLabel>{isAdmin ? 'Administration' : 'My Work'}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.url || 
                  (item.url !== '/admin/dashboard' && item.url !== '/mr/dashboard' && location.pathname.startsWith(item.url));
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <NavLink to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <NavLink to={isAdmin ? '/admin/settings' : '/mr/settings'}>
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
