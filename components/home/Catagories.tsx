"use client";
import { fetcher } from "@/lib/coingecko.actions";
import { Category } from "@/types";
import { CATOGORY_ORDERS } from "@/lib/constants";
import { useEffect, useState } from "react";
import { formatCurrency, formatPercentage } from "@/lib/utils";

function Categories() {
  const [selectCategoryOrder, setSelectCategoryOrder] = useState(
    CATOGORY_ORDERS[0]
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => {
    const getCategoriesData = async () => {
      const res = await fetcher<Category[]>("/coins/categories", {
        order: selectCategoryOrder.value,
      });
      const afterCategories = res?.slice(0, 10);
      if (afterCategories) {
        setCategories(afterCategories);
      }
    };

    getCategoriesData();
  }, [selectCategoryOrder]);
  const handlePageChange = (page: number) => {
    setPage(page);
    const paginatedData = categories.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );
    return paginatedData;
  };
  //   if (loading) return <div>Loading Categories...</div>;

  return (
    <div className='w-full rounded-2xl bg-[#1e2329] p-6 shadow-sm'>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-xl font-bold text-white'>Categories</h2>
        <div className='flex items-center gap-2'>
          <label className='text-sm text-gray-400'>Sort by:</label>
          <select
            value={selectCategoryOrder.value}
            onChange={(e) => {
              const selected = CATOGORY_ORDERS.find(
                (o) => o.value === e.target.value
              );
              if (selected) setSelectCategoryOrder(selected);
            }}
            className='rounded-lg border border-gray-700 bg-[#2b3139] px-3 py-1.5 text-sm text-white focus:border-indigo-500 focus:outline-none'
          >
            {CATOGORY_ORDERS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-gray-800 text-left text-sm text-gray-400'>
              <th className='pb-4 pl-4 font-medium'>#</th>
              <th className='pb-4 font-medium'>Category</th>
              <th className='pb-4 font-medium'>Top Coins</th>
              <th className='pb-4 text-right font-medium'>24h Change</th>
              <th className='pb-4 text-right font-medium'>Market Cap</th>
              <th className='pr-4 pb-4 text-right font-medium'>24h Volume</th>
            </tr>
          </thead>
          <tbody className='text-sm'>
            {categories.map((category, index) => (
              <tr
                key={category.id}
                className='border-b border-gray-800/50 transition-colors last:border-0 hover:bg-white/5'
              >
                <td className='py-4 pl-4 text-gray-400'>{index + 1}</td>
                <td className='py-4 font-bold text-white'>{category.name}</td>
                <td className='py-4'>
                  <div className='flex -space-x-2'>
                    {category.top_3_coins.map((coinUrl, i) => (
                      <img
                        key={i}
                        src={coinUrl}
                        alt=''
                        className='h-7 w-7 rounded-full border-2 border-[#1e2329] bg-gray-800'
                      />
                    ))}
                  </div>
                </td>
                <td
                  className={`py-4 text-right font-medium ${
                    category.market_cap_change_24h >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {formatPercentage(category.market_cap_change_24h)}
                </td>
                <td className='py-4 text-right text-gray-300'>
                  {formatCurrency(category.market_cap)}
                </td>
                <td className='py-4 pr-4 text-right text-gray-300'>
                  {formatCurrency(category.volume_24h)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Categories;
