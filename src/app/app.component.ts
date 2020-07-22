import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';

import { DataService } from './services/data.service';


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  markers: ApexMarkers,
  colors: string[]
  stroke: ApexStroke
  fill: ApexFill
  responsive: ApexResponsive[]
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('chart') chart: ApexCharts;
  @ViewChild('BTCSort') BTCSort: MatSort;
  @ViewChild('ETHSort') ETHSort: MatSort;
  @ViewChild('XLMSort') XLMSort: MatSort;

  chartOptions: Partial<ChartOptions>;
  currenciesForm: FormGroup;
  dataForTables;


  constructor(private dataService: DataService,
              private formBuilder: FormBuilder) {
    this.chartOptions = {
      series: [],
      stroke: {
        width: 2
      },
      legend: {
        show: true,
        showForSingleSeries: true,
      },
      chart: {
        height: 470,
        width: '100%',
        type: 'line',
        background: '#E8FFFA',
        parentHeightOffset: 0,
        redrawOnParentResize: true
      },
      xaxis: {
        type: 'datetime'
      }
    };
  }

  ngOnInit(): void {
    this.dataService.dataForChart.subscribe(
      value => {
        this.chartOptions.series = value;
      }
    );

    this.dataService.getAllCoins().subscribe();

    this.buildCurrenciesForm();
    this.handleControlsValueChanges();

    this.dataForTables = this.dataService.dataForTables;
  }

  buildCurrenciesForm(): void {
    this.currenciesForm = this.formBuilder.group({
      bitcoin: [false],
      ethereum: [false],
      stellar: [false]
    });
  }

  getHeaderArray(object): string[] {
    return object ? Object.keys(object) : [];
  }

  handleControlsValueChanges(): void {
    this.bitcoinCheckbox.valueChanges
      .pipe(
        switchMap(value => value ? this.dataService.getCoinHistory('BTC') : this.dataService.removeSeria('BTC'))
      ).subscribe(
      () => this.handleSortChanges('BTC')
    );

    this.ethereumCheckbox.valueChanges
      .pipe(
        switchMap(value => value ? this.dataService.getCoinHistory('ETH') : this.dataService.removeSeria('ETH'))
      ).subscribe(
      () => this.handleSortChanges('ETH')
    );

    this.stellarCheckbox.valueChanges
      .pipe(
        switchMap(value => value ? this.dataService.getCoinHistory('XLM') : this.dataService.removeSeria('XLM'))
      ).subscribe(
      () => this.handleSortChanges('XLM')
    );
  }

  handleSortChanges(currency): void {
    this[`${currency}Sort`].sortChange.subscribe(value => this.dataService.sortTableData(currency, value.active, value.direction));
  }

  get bitcoinCheckbox(): FormControl {
    return this.currenciesForm.get('bitcoin') as FormControl;
  }

  get ethereumCheckbox(): FormControl {
    return this.currenciesForm.get('ethereum') as FormControl;
  }

  get stellarCheckbox(): FormControl {
    return this.currenciesForm.get('stellar') as FormControl;
  }
}
