import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import * as ApiResponseModels from '../models/api-response.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getCoinHistory(coinId: number = 1, timeframe: string = '30d'): Observable<ApiResponseModels.CoinHistoryResponse> {
    const url = `https://api.coinranking.com/v1/public/coin/${coinId}/history/${timeframe}`;
    return this.http.get<ApiResponseModels.CoinHistoryResponse>(url);
  }

  getAllCoins(): Observable<any> {
    const url = `https://api.coinranking.com/v1/public/coins`;
    return this.http.get<ApiResponseModels.CoinHistoryResponse>(url);
  }
}
