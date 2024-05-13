"use client";
import Image from "next/image"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  Earth,
  ListFilter,
  MoreVertical,
  Package,
  Webhook,
  PanelLeft,
  Search,
  Settings,
  CircleDollarSign,
  Truck,
  Users2,
  Rocket,
  MessageCircleCode,
  Users,
  Share,
  Link2,
  Eye,
  Pencil,
  Plus,
  Sun,
  Moon,
  MapPinned,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip"
import { use, useEffect, useMemo, useState } from "react"
import { ClerkProvider, UserButton } from '@clerk/nextjs'
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

import { Inter } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import { Toggle } from "@/components/ui/toggle";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <NextThemesProvider attribute="class" defaultTheme="dark">
            <Layout>
              {children}
            </Layout>
          </NextThemesProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}


export function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  const { theme, setTheme } = useTheme()

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        {
          (['/dashboard', '/resources', '/mentorship', '/settings', '/messenger', '/'].includes(pathname)) &&
          <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
              <Link
                href="#"
                className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-black dark:bg-white text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
              >
                <Webhook className="h-4 w-4 transition-all group-hover:scale-110" />
                <span className="sr-only">Startup Inc</span>
              </Link>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/"
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${pathname === '/' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground md:h-8 md:w-8`}
                  >
                    <Home className="h-5 w-5" />
                    <span className="sr-only">Home</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Home</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/dashboard"
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${pathname === '/dashboard' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground md:h-8 md:w-8`}
                  >
                    <CircleDollarSign className="h-5 w-5" />
                    <span className="sr-only">Dashboard</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Dashboard</TooltipContent>
              </Tooltip>
              <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/recommendation"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <MapPinned className="h-5 w-5" />
                  <span className="sr-only">Recommendation</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Recommendation</TooltipContent>
            </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/mentorship"
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${pathname === '/mentorship' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground md:h-8 md:w-8`}
                  >
                    <Users2 className="h-5 w-5" />
                    <span className="sr-only">Community</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Community</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/resources"
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${pathname === '/resources' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground md:h-8 md:w-8`}
                  >
                    <Rocket className="h-5 w-5" />
                    <span className="sr-only">Resources</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Resources</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/messenger"
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${pathname === '/messenger' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground md:h-8 md:w-8`}
                  >
                    <MessageCircleCode className="h-5 w-5" />
                    <span className="sr-only">Inbox</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Inbox</TooltipContent>
              </Tooltip>
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Toggle aria-label="Toggle Theme"
                    className="rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  >{
                      theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />
                    }</Toggle>
                </TooltipTrigger>
                <TooltipContent side="right">{
                  theme === 'dark' ? 'Light Mode' : 'Dark Mode'
                }</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/settings"
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${pathname === '/settings' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground md:h-8 md:w-8`}
                  >
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Settings</TooltipContent>
              </Tooltip>
              <UserButton />
            </nav>
          </aside>}
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link
                    href="#"
                    className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                  >
                    <Webhook className="h-5 w-5 transition-all group-hover:scale-110" />
                    <span className="sr-only">Startup Inc</span>
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <Home className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-4 px-2.5 text-foreground"
                  >
                    <CircleDollarSign className="h-5 w-5" />
                    Orders
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <Package className="h-5 w-5" />
                    Products
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <Users2 className="h-5 w-5" />
                    Customers
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <Earth className="h-5 w-5" />
                    Settings
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </header>
          {children}
        </div>
      </div>
    </TooltipProvider>
  )
}
