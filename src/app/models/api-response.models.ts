export class CoinHistoryResponse {
  status: string;
  data: HistoryData;
}

export class HistoryData {
  change: number;
  history: {price: number, timestamp: number}[][];
}
