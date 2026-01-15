"use client";
import React, { useEffect, useRef, useState, useTransition } from "react";
import {
  getCandlestickConfig,
  getChartConfig,
  PERIOD_BUTTONS,
  PERIOD_CONFIG,
} from "@/lib/constants";
import { fetcher } from "@/lib/coingecko.actions";
import {
  CandlestickSeries,
  createChart,
  IChartApi,
  ISeriesApi,
} from "lightweight-charts";
import { cn, convertOHLCData } from "@/lib/utils";
import { Spinner } from "../ui/Spinner";

const CandlestickChart = ({
  children,
  data,
  ohlcData,
  coinId,
  height = 360,
  initialPeriod = "daily",
}: CandlestickChartProps) => {
  const [period, setPeriod] = useState(initialPeriod);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);

  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const fetchOHLCData = async (selectedPeriod: Period) => {
    try {
      setLoading(true);
      const config = PERIOD_CONFIG[selectedPeriod];
      if (!config) {
        console.log("Invalid period selected");
        return;
      }
      const newData = await fetcher<OHLCData[]>(`/coins/${coinId}/ohlc`, {
        vs_currency: "usd",
        days: config.days,
        interval: config.interval || "daily",
        precision: "full",
      });
      console.log("Fetched OHLC data:", newData);
    } catch (e) {
      console.log("Error fetching OHLC data:", e);
    }
  };
  function handlePeriodChange(newPeriod: Period) {
    if (period === newPeriod) {
      return;
    }
    startTransition(async () => {
      setPeriod(newPeriod);
      await fetchOHLCData(newPeriod);
    });
  }
  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const showTime = ["daily", "weekly", "monthly"].includes(period);
    const chart = createChart(container, {
      ...getChartConfig(height, showTime),
      width: container.clientWidth,
    });

    const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());

    series.setData(convertOHLCData(data));
    setLoading(false);
    chartRef.current = chart;
    candleSeriesRef.current = series;

    const handleResize = () => {
      if (container && chart) {
        chart.applyOptions({ width: container.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
    };
  }, [height, ohlcData, period]);

  return (
    <div className='relative flex h-full w-full flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium text-gray-400'>Period:</span>
          <div className='flex rounded-lg bg-[#2b3139] p-1'>
            {PERIOD_BUTTONS.map((button) => (
              <button
                key={button.value}
                onClick={() => handlePeriodChange(button.value)}
                disabled={isPending}
                className={cn(
                  "rounded-md px-3 py-1 text-sm font-medium transition-colors",
                  period === button.value
                    ? "bg-[#363c45] text-white"
                    : "text-gray-400 hover:text-white"
                )}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div ref={chartContainerRef} className='relative w-full flex-1'>
        {(loading || isPending) && (
          <div className='absolute inset-0 z-10 flex items-center justify-center bg-[#1e2329]/80 backdrop-blur-sm transition-opacity'>
            <Spinner size={40} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CandlestickChart;
