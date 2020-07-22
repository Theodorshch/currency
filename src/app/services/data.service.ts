import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  necessaryCoins = [
    'BTC',
    'ETH',
    'XLM'
  ];
  allCoins: {id: number, symbol: string}[];

  dataForTables = {
    BTC: new BehaviorSubject([]),
    ETH: new BehaviorSubject([]),
    XLM: new BehaviorSubject([]),
  };
  dataForChart = new BehaviorSubject([]);


  constructor(private apiService: ApiService) { }

  getCoinHistory(currency: string): Observable<any> {
    return this.apiService.getCoinHistory(this.getCurrencyId(currency))
      .pipe(
        map(value => value.data.history),
        tap(value => this.addDataForTable(value, currency)),
        map(value => value.map(object => Object.values(object))),
        // @ts-ignore
        map(value => value.map(item => [item[0], item[1]] = [item[1], +item[0]])),
        map(data => ({ name: currency, data })),
        tap(seria => this.addSeria(seria)),
      );
  }

  addSeria(seria): void {
    const newSeries = [...this.dataForChart.value];
    newSeries.push(seria);
    this.dataForChart.next(newSeries);
  }

  removeSeria(label: string): any {
    const seriaIndex = this.dataForChart.value.findIndex(item => item.name === label);
    const newSeries = [...this.dataForChart.value];
    newSeries.splice(seriaIndex, 1);
    this.dataForChart.next(newSeries);
    return of(null);
  }

  addDataForTable(data, currency): void {
    const dataForTable = data.map(item => ({Date: new Date(item.timestamp).toUTCString(), [currency]: item.price}));
    this.dataForTables[currency].next(dataForTable);
  }

  sortTableData(currency, column, direction): void {
    const newTableData = [...this.dataForTables[currency].value];
    newTableData.sort((a, b) => {
      if (column === 'Date') {
        a.Date = Date.parse(a.Date);
        b.Date = Date.parse(b.Date);
      }
      if (a[column] > b[column]) {
        if (column === 'Date') {
          a.Date = new Date(a.Date).toUTCString();
          b.Date = new Date(b.Date).toUTCString();
        }
        return direction === 'asc' ? 1 : -1;
      }
      if (a[column] < b[column]) {
        if (column === 'Date') {
          a.Date = new Date(a.Date).toUTCString();
          b.Date = new Date(b.Date).toUTCString();
        }
        return direction === 'asc' ? -1 : 1;
      }
      return 0;
    });
    this.dataForTables[currency].next(newTableData);
  }

  getAllCoins(): Observable<any> {
    return this.apiService.getAllCoins()
      .pipe(
        map(value => value.data.coins),
        map(coinsArray => coinsArray.map(coin => {
          return { id: coin.id, symbol: coin.symbol };
        })),
        map(value => value.filter(item => this.necessaryCoins.includes(item.symbol))),
        tap(value => this.allCoins = value),
      );
  }

  getCurrencyId(currency: string): number {
    const itemIndex = this.allCoins.findIndex(item => item.symbol === currency);
    return this.allCoins[itemIndex].id;
  }
}
