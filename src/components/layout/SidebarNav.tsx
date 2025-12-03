
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
  SidebarContent,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/icons/Logo"
import { Home, BarChart2, Bell, Settings, LifeBuoy, Bot } from "lucide-react"

export function SidebarNav() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo />
          <h2 className="text-lg font-semibold tracking-tight">CryptoVision</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/" passHref>
              <SidebarMenuButton
                isActive={isActive("/")}
                tooltip="Dashboard"
              >
                <Home />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/trade" passHref>
              <SidebarMenuButton
                isActive={isActive("/trade")}
                tooltip="AI Trade Advisor"
              >
                <Bot />
                <span>AI Trade Advisor</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <Link href="/charts" passHref>
              <SidebarMenuButton
                isActive={isActive("/charts")}
                tooltip="Charts"
              >
                <BarChart2 />
                <span>Charts</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <Link href="/alerts" passHref>
              <SidebarMenuButton
                isActive={isActive("/alerts")}
                tooltip="Alerts"
              >
                <Bell />
                <span>Alerts</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="#" passHref>
              <SidebarMenuButton isActive={false} tooltip="Settings" disabled>
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="#" passHref>
              <SidebarMenuButton isActive={false} tooltip="Support" disabled>
                <LifeBuoy />
                <span>Support</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )
}
