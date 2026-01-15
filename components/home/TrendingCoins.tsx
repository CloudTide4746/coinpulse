/** @format */

import { fetcher } from "@/lib/coingecko.actions";
import { cn, formatCurrency } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import DataTable from "../DataTable";
import ImageWithSpinner from "../ui/ImageWithSpinner";

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
        console.log(item);
        if (!item) return null;

        return (
          <Link href={`/coins/${item.id}`}>
            <ImageWithSpinner
              height={36}
              width={36}
              src={item.large}
              alt={item.name}
            ></ImageWithSpinner>
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
    <>
      <div id='trending-coins'>
        <p className='mb-4 text-2xl font-bold text-white'> ...Trending Coins</p>
        <DataTable
          columns={columns}
          data={trendingCoins?.coins || []}
          rowKey={(coin) => coin.item.id}
          headerCellClassName='py-3!'
          bodyCellClassName='py-2!'
        ></DataTable>
      </div>
    </>
  );
}

export default TrendingCoins;
