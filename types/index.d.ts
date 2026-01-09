/** @format */

export interface TrendingCoin {
  item: {
    id: string;
    coin_id: number;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    small: string;
    large: string;
    slug: string;
    price_btc: number;
    score: number;
    data: {
      price: number;
      price_btc: string;
      price_change_percentage_24h: {
        [currency: string]: number;
      };
      market_cap: string;
      market_cap_btc: string;
      total_volume: string;
      total_volume_btc: string;
      sparkline: string;
      content: {
        description: string;
      } | null;
    };
  };
}

export interface DataTableColumn<T> {
  header: string;
  accessorKey?: keyof T;
  cellClassName?: string;
  cell: (row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowkey: (row: T, index: number) => string | number;
  tableClassName?: string;
  headerClassName?: string;
  headerRowClassName?: string;
  headerCellClassName?: string;
  bodyRowClassName?: string;
  bodyCellClassName?: string;
}

export interface CoinDetailsData {
  id: string;
  symbol: string;
  name: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_data: {
    current_price: {
      [currency: string]: number;
    };
    price_change_percentage_24h: number;
  };
}

export interface QueryParams {
  [key: string]: string | number | boolean | null | undefined;
}

export interface CoinGeckoErrorBody {
  status?: {
    error_code: number;
    error_message: string;
  };
}
