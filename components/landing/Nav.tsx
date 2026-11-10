"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useReducedMotion } from "./useReducedMotion";
import { ChevronDown, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { a11y, brand, navItems, type NavItem } from "@/lib/content";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "./Logo";
import { EASE } from "./motion";

const triggerClass =
  "h-8 rounded-md bg-transparent px-3 text-[14px] font-normal text-muted-fg transition-colors hover:bg-transparent hover:text-fg focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-fg data-open:bg-transparent data-open:hover:bg-transparent";

export function CtaButton({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={brand.ctaHref}
      onClick={() => onNavigate?.()}
      className={cn(
        "inline-flex h-8 items-center justify-center rounded-lg bg-bright px-3.5 text-[13px] font-medium text-black transition-colors hover:bg-white/85",
        className
      )}
    >
      {brand.cta}
    </Link>
  );
}

function IntegrationCluster({ chips }: { chips: string[] }) {
  const reduce = useReducedMotion();
  return (
    <div className="dot-grid flex min-h-[150px] flex-wrap content-center justify-center gap-2 rounded-[10px] border border-line bg-bg/60 p-4">
      {chips.map((chip, i) => (
        <motion.span
          key={chip}
          className="rounded-full border border-line-strong bg-surface-2 px-2.5 py-1 text-[12px] text-muted-fg"
          animate={reduce ? undefined : { y: [0, i % 2 ? -3 : 3, 0] }}
          transition={{
            duration: 4 + i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {chip}
        </motion.span>
      ))}
    </div>
  );
}

function MegaContent({ item }: { item: Extract<NavItem, { kind: "mega" }> }) {
  return (
    <div className="grid w-[760px] grid-cols-[260px_1fr] gap-2 p-2">
      <div className="flex flex-col gap-3 rounded-[10px] border border-line bg-bg p-4">
        <p className="text-[12px] text-faint">{item.panel.eyebrow}</p>
        <div>
          <p className="text-[17px] font-medium text-fg">{item.panel.title}</p>
          <p className="mt-1.5 text-[13px] leading-[1.5] text-muted-fg">
            {item.panel.body}
          </p>
        </div>
        <IntegrationCluster chips={item.panel.chips} />
      </div>
      <div className="p-2">
        <p className="px-2 pb-2 text-[12px] text-faint">{item.groupLabel}</p>
        <ul className="grid grid-cols-2 gap-1">
          {item.items.map((f) => (
            <li key={f.label}>
              <NavigationMenuLink
                href={f.href}
                className="flex flex-row items-start gap-3 rounded-[10px] p-3 hover:bg-white/[0.04] focus:bg-white/[0.04]"
              >
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md border border-line bg-surface-2 text-muted-fg">
                  <f.icon className="size-3.5" aria-hidden />
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-medium text-fg">
                    {f.label}
                  </span>
                  <span className="text-[13px] leading-[1.45] text-muted-fg">
                    {f.description}
                  </span>
                </span>
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ListContent({ item }: { item: Extract<NavItem, { kind: "list" }> }) {
  return (
    <ul className="flex w-[260px] flex-col p-1.5">
      {item.items.map((l) => (
        <li key={l.label}>
          <NavigationMenuLink
            href={l.href}
            className="rounded-md px-3 py-2 text-[14px] text-muted-fg hover:bg-white/[0.04] hover:text-fg focus:bg-white/[0.04] focus:text-fg"
          >
            {l.label}
          </NavigationMenuLink>
        </li>
      ))}
    </ul>
  );
}

function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label={a11y.openMenu}
          className="grid size-9 place-items-center rounded-md text-muted-fg hover:text-fg md:hidden"
        >
          <Menu className="size-5" aria-hidden />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full border-none bg-bg p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-none"
      >
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <SheetDescription className="sr-only">Site navigation</SheetDescription>
        <div className="flex h-14 items-center px-6">
          <Logo />
        </div>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-6 pb-6">
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.label} className="border-b border-line">
                {item.kind === "link" ? (
                  <SheetClose asChild>
                    <a
                      href={item.href}
                      className="block py-4 text-[17px] text-fg"
                    >
                      {item.label}
                    </a>
                  </SheetClose>
                ) : (
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[17px] text-fg [&::-webkit-details-marker]:hidden">
                      {item.label}
                      <ChevronDown
                        className="size-4 text-muted-fg transition-transform group-open:rotate-180"
                        aria-hidden
                      />
                    </summary>
                    <ul className="flex flex-col gap-1 pb-4">
                      {(item.kind === "mega" ? item.items : item.items).map(
                        (l) => (
                          <li key={l.label}>
                            <SheetClose asChild>
                              <a
                                href={l.href}
                                className="block py-1.5 text-[15px] text-muted-fg hover:text-fg"
                              >
                                {l.label}
                              </a>
                            </SheetClose>
                          </li>
                        )
                      )}
                    </ul>
                  </details>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-line p-6">
          <CtaButton
            className="h-11 w-full text-[15px]"
            onNavigate={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={reduce ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-line bg-[rgba(11,12,14,0.72)] backdrop-blur-md"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="container-page grid h-14 grid-cols-[1fr_auto] items-center md:grid-cols-[1fr_auto_1fr]">
        <a
          href={a11y.homeHref}
          aria-label={a11y.home}
          className="justify-self-start rounded-sm"
        >
          <Logo />
        </a>

        <NavigationMenu className="hidden md:flex" aria-label="Main">
          <NavigationMenuList className="gap-0.5">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.label}>
                {item.kind === "link" ? (
                  <NavigationMenuLink
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={cn(
                      triggerClass,
                      "flex-row items-center py-0",
                      pathname === item.href && "text-fg"
                    )}
                  >
                    {item.label}
                  </NavigationMenuLink>
                ) : (
                  <>
                    <NavigationMenuTrigger className={triggerClass}>
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="p-0">
                      {item.kind === "mega" ? (
                        <MegaContent item={item} />
                      ) : (
                        <ListContent item={item} />
                      )}
                    </NavigationMenuContent>
                  </>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center justify-self-end gap-2">
          <CtaButton className="hidden md:inline-flex" />
          <MobileMenu />
        </div>
      </div>
    </motion.header>
  );
}
