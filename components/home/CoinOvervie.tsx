/** @format */

import { fetcher } from "@/lib/coingecko.actions";
import React from "react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { CoinOverviewSkeleton } from "./fallback";
import CandlestickChart from "./CandlestickChart";

const CoinOvervie = async () => {
  try {
    const [coin, coinOHLCData] = await Promise.all([
      fetcher<CoinDetailsData>("/coins/bitcoin", {
        dex_pair_format: "symbol",
      }),
      fetcher<OHLCData[]>("/coins/bitcoin/ohlc", {
        vs_currency: "usd",
        days: `1`,
        precision: `full`,
      }),
    ]);

    if (!coin || !coinOHLCData) {
      console.log("CoinOverview: Data missing", {
        coin: !!coin,
        ohlc: !!coinOHLCData,
      });
      console.log(coinOHLCData, coin);
      return <CoinOverviewSkeleton />;
    }
    return (
      <div className='flex h-full flex-col rounded-2xl bg-[#1e2329] p-8 shadow-sm'>

        <div className='flex items-center gap-4'>
          {coin.image?.large && (
            <Image
              src={coin.image.large}
              alt={coin.name}
              width={64}
              height={64}
              unoptimized
              className='rounded-full'
            />
          )}
          <div className='flex flex-col'>
            <p className='font-medium text-gray-400'>
              {coin.name} / {coin.symbol?.toUpperCase()}
            </p>
            <h1 className='mt-1 text-4xl font-bold'>
              {formatCurrency(coin.market_data?.current_price?.usd || 0)}
            </h1>
          </div>
        </div>
        <CandlestickChart
          data={coinOHLCData}
          coinId='bitcoin'
        ></CandlestickChart>
        {/* <div className='mt-8 flex w-full flex-1 items-center justify-center text-gray-500 italic'>
          Chart will be displayed here
        </div> */}
      </div>
    );
  } catch (error) {
    // console.error("CoinOverview Error:", error);
    return <CoinOverviewSkeleton />;
  }
};
export default CoinOvervie;
