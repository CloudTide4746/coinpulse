"use client";
import DataTable from "@/components/DataTable";
import { fetcher } from "@/lib/coingecko.actions";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import { CoinMarket } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [coins, setCoins] = useState<CoinMarket[]>([]);
  useEffect(() => {
    const getAllCoins = async () => {
      try {
        const data = await fetcher<CoinMarket[]>("/coins/markets", {
          vs_currency: "usd",
        });

        if (data) {
          console.log(data);
          setCoins(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAllCoins();
  }, []);

  const columns: DataTableColumn<CoinMarket>[] = [
    {
      header: "Rank",
      headerClassName: "w-16",
      cellClassName: "w-16 text-gray-400",
      cell: (coin) => `#${coin.market_cap_rank}`,
    },
    {
      header: "Token",
      headerClassName: "text-left",
      cellClassName: "text-left",
      cell: (coin) => (
        <Link
          href={`/coins/${coin.id}`}
          className='flex items-center gap-3 hover:opacity-80'
        >
          <Image
            src={coin.image}
            alt={coin.name}
            width={32}
            height={32}
            unoptimized
            className='rounded-full'
          />
          <div className='flex flex-col'>
            <span className='font-bold text-white'>{coin.name}</span>
            <span className='text-xs text-gray-500'>
              {coin.symbol.toUpperCase()}
            </span>
          </div>
        </Link>
      ),
    },
    {
      header: "Price",
      headerClassName: "text-right",
      cellClassName: "text-right font-medium text-white",
      cell: (coin) => formatCurrency(coin.current_price),
    },
    {
      header: "24h Change",
      headerClassName: "text-right",
      cellClassName: "text-right",
      cell: (coin) => {
        const isPositive = coin.price_change_percentage_24h > 0;
        return (
          <span
            className={cn(
              "font-medium",
              isPositive ? "text-green-400" : "text-red-400"
            )}
          >
            {isPositive ? "+" : ""}
            {formatPercentage(coin.price_change_percentage_24h)}
          </span>
        );
      },
    },
    {
      header: "Market Cap",
      headerClassName: "text-right",
      cellClassName: "text-right text-gray-300",
      cell: (coin) => formatCurrency(coin.market_cap),
    },
    {
      header: "Volume (24h)",
      headerClassName: "text-right pr-6",
      cellClassName: "text-right text-gray-300 pr-6",
      cell: (coin) => formatCurrency(coin.total_volume),
    },
  ];

  return (
    <div className='main-container py-10'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-white'>Market Explorer</h1>
        <p className='text-gray-400'>
          Track top cryptocurrencies by market cap
        </p>
      </div>

      <DataTable
        columns={columns}
        data={coins}
        rowkey={(coin) => coin.id}
        tableClassName='w-full rounded-2xl bg-[#1e2329] shadow-sm overflow-hidden'
        headerRowClassName='bg-[#2b3139]/50'
        bodyRowClassName='border-b border-gray-800/50 hover:bg-white/5 transition-colors last:border-0'
      />
    </div>
  );
};

export default Page;
