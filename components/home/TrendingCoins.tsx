/** @format */

import { fetcher } from "@/lib/coingecko.actions";
import { cn, formatCurrency } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import DataTable from "../DataTable";

async function TrendingCoins() {
  const trendingCoins = await fetcher<{ coins: TrendingCoin[] }>(
    "/search/trending",
    undefined,
    300
  );
  const columns: DataTableColumn<TrendingCoin>[] = [
    {
      header: "Name",
      cellClassName: "name-cell",
      cell: (coin) => {
        const item = coin?.item;
        if (!item) return null;

        return (
          <Link
            href={`/coins/${item.id}`}
            className='group flex flex-col items-center gap-1'
          >
            <Image
              src={item.large}
              alt={item.name}
              width={40}
              height={40}
              unoptimized
              className='rounded-full'
            ></Image>
            <span className='text-xs text-gray-400 transition-colors group-hover:text-white'>
              {item.name}
            </span>
          </Link>
        );
      },
    },
    {
      header: "24h Change",
      cellClassName: "name-cell",
      cell: (coin) => {
        const item = coin?.item;
        if (!item?.data?.price_change_percentage_24h?.usd) return <p>-</p>;

        const isTrendingUp = item.data.price_change_percentage_24h.usd > 0;
        return (
          <div
            className={cn(
              "price-change",
              isTrendingUp ? "text-green-500" : "text-red-500"
            )}
          >
            <p className='flex items-center gap-2'>
              {isTrendingUp ? (
                <TrendingUp width={16} height={16} />
              ) : (
                <TrendingDown width={16} height={16} />
              )}
              {item.data.price_change_percentage_24h.usd.toFixed(2)}%
            </p>
          </div>
        );
      },
    },
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: (coin) => {
        const item = coin?.item?.data?.price;
        if (!item) return <p>-</p>;
        return <p>{formatCurrency(item)}</p>;
      },
    },
  ];

  return (
    <div className='flex h-full flex-col rounded-2xl bg-[#1e2329] p-6 shadow-sm'>
      <h2 className='mb-6 text-xl font-bold'>Trending Coins</h2>
      <div
        id='trending-coins'
        className='custom-scrollbar flex-1 overflow-y-auto'
      >
        <DataTable
          columns={columns}
          data={trendingCoins?.coins || []}
          rowKey={(coin) => coin.item.id}
          tableClassName='border-none'
          headerRowClassName='bg-transparent border-b border-gray-800'
          headerCellClassName='text-gray-400 font-medium py-4!'
          bodyRowClassName='border-b border-gray-800 hover:bg-[#2b3139]! transition-colors'
          bodyCellClassName='py-4!'
        />
      </div>
    </div>
  );
}

export default TrendingCoins;
