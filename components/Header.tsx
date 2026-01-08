/** @format */
"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import path from "path";
import React from "react";

export default function Header() {
  const pathname = usePathname();

  return (
    <header>
      <div className='main-container inner'>
        <Link href='/'>
          <Image src='logo.svg' alt='CoinPulse Logo' width={132} height={40} />
        </Link>
        <nav>
          <Link
            href='/'
            className={cn("nav-link", {
              "is-active": pathname === "/",
              "is-home": true,
            })}
          >
            Home
          </Link>
          <p>Search Modal</p>
          <Link
            href='/coins'
            className={cn("nav-link", {
              "is-active": pathname === "/coins",
              "is-home": true,
            })}
          >
            All coins
          </Link>
        </nav>
      </div>
    </header>
  );
}
