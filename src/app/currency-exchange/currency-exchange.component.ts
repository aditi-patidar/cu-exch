import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ExchangeRatesService} from '../exchange-rates.service';
import {Observable, Subscription} from 'rxjs';
import {NgForm} from '@angular/forms';
import {AlertService} from '../alert.service';

@Component({
  selector: 'app-currency-exchange',
  templateUrl: './currency-exchange.component.html',
  styleUrls: ['./currency-exchange.component.css']
})
export class CurrencyExchangeComponent implements OnInit, OnDestroy {

  rates: Observable<any>[];
  model = {
    amount: 1
  };
  allCurrencies: Observable<any>[];
  doAddCurrency = false;
  ratesSubscription: Subscription;
  ratesUpdatedSubscription: Subscription;
  currencySubscription: Subscription;

  constructor(private exchRates: ExchangeRatesService, private alertService: AlertService) { }

  ngOnInit() {
    this.ratesSubscription = this.exchRates.getRates().subscribe(
      (data) => {
        this.rates = data;
      }
    );
    this.ratesUpdatedSubscription = this.exchRates.ratesUpdated.subscribe(
      (data: Observable<any>[]) => {
        this.rates = data;
      }
    );
  }

  showAddCurrency() {
    this.doAddCurrency = true;
    if (!this.allCurrencies) {
      this.currencySubscription = this.exchRates.getAllCurrencies().subscribe(
        (data) => {
          this.allCurrencies = data;
        }
      );
    }
  }

  hideAddCurrency() {
    this.doAddCurrency = false;
  }

  findRates(form: NgForm) {
    if (form.valid) {
      this.model.amount = form.value.amount;
    }
  }

  removeCurrency(currency: string) {
    this.exchRates.removeSupportedCurrency(currency);
  }

  addCurrency(form: NgForm) {
    if (form.valid) {
      const supportedCurrencies = this.exchRates.getSupportedCurrencies();
      const currency = form.value.currency;
      if (supportedCurrencies.length !== 0 && supportedCurrencies.includes(currency)) {
        this.alertService.setAlert('Currency ' + currency +' Already Added.', 'danger');
      } else {
        this.exchRates.addSupportedCurrency(currency);
      }
    }
  }

  ngOnDestroy() {
    this.ratesSubscription.unsubscribe();
    this.ratesUpdatedSubscription.unsubscribe();
    this.currencySubscription.unsubscribe();
  }
}
