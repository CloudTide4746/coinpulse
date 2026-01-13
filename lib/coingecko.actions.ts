/** @format */

"use server";
import qs from "query-string";
import { CoinGeckoErrorBody, QueryParams } from "@/types";

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60
): Promise<T | null> {
  if (!BASE_URL || !API_KEY || API_KEY === "YOUR_API_KEY") {
    console.error(
      "❌ CoinGecko API Configuration Missing: Please set COINGECKO_API_KEY in .env.local"
    );
    return null;
  }

  try {
    const url = qs.stringifyUrl(
      {
        url: `${BASE_URL}${endpoint}`,
        query: params,
      },
      { skipEmptyString: true, skipNull: true }
    );

    // 根据 URL 自动选择 Header 键名
    const authHeader = BASE_URL.includes("pro-api")
      ? "x-cg-pro-api-key"
      : "x-cg-demo-api-key";

    const response = await fetch(url, {
      method: "GET",
      headers: {
        [authHeader]: API_KEY,
        Accept: "application/json",
      },
      next: {
        revalidate,
      },
    });

    if (!response.ok) {
      const errorData: CoinGeckoErrorBody = await response
        .json()
        .catch(() => ({}));
      // console.error(
      //   `CoinGecko API Error: ${response.status} - ${
      //     errorData.status?.error_message || response.statusText
      //   }`
      // );
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Fetcher Error:", error);
    return null;
  }
}
