import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard, logout } from '@/routes';
import { type NavItem } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    User,
    Users,
    LogOut,
    ShoppingCart,
    LayoutDashboard,
    ShoppingBagIcon
} from 'lucide-react';
import AppLogo from './app-logo';

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'User',
        href: '/admin/user',
        icon: Users,
    },
    {
        title: 'Toko',
        href: '/admin/toko',
        icon: ShoppingCart,
    },

];

const memberNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutDashboard,
    },
    {
        title: 'Produk',
        href: '/member/produk',
        icon: ShoppingCart,
    },
    {
        title: 'Toko saya',
        href: '/member/toko',
        icon: ShoppingBagIcon,
    }
];

// const footerNavItems: NavItem[] = [];

interface User {
    id: number;
    name: string;
    username: string;
    role: string;
}

interface PageProps {
    auth: {
        user: User;
    };
}

export function AppSidebar() {
    const { props } = usePage<PageProps>();
    const { user } = props.auth;

    const getNavItems = (): NavItem[] => {
        if (user.role === 'admin') {
            return adminNavItems;
        } else if (user.role === 'member') {
            return memberNavItems;
        }

        return memberNavItems;
    };

    const mainNavItems = getNavItems();

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        logout();
        router.post('/logout');
        console.log('Logout clicked');
    };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    {/* Informasi User */}
                    <SidebarMenuItem>
                        <SidebarMenuButton className="flex flex-col items-start gap-1 py-3">
                            <div className="text-sm font-medium text-foreground">
                                {user.name}
                            </div>
                            <div className="text-xs text-muted-foreground capitalize">
                                {user.role}
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Tombol Logout */}
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="text-red-700 hover:text-red-800 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/50"
                        >
                            <button onClick={handleLogout} className="w-full">
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                            </button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
