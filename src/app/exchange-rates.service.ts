import {HttpClient} from '@angular/common/http';
import {Injectable, OnDestroy} from '@angular/core';
import {Observable, Subject, of, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {AlertService} from './alert.service';
import {AngularButtonLoaderService} from 'angular-button-loader';

@Injectable()
export class ExchangeRatesService implements OnDestroy {

  constructor(private httpClient: HttpClient, private alertService: AlertService,
              private btnLoaderService: AngularButtonLoaderService) {}

  supportedCurrencies: string;
  ratesUpdated = new Subject<Observable<any>[]>();
  ratesSubscription: Subscription;

  getRates() {
    if (!this.supportedCurrencies) {
      return of([]);
    } else {
      return this.httpClient.get('https://api.exchangeratesapi.io/latest?base=USD&symbols=' + this.supportedCurrencies).pipe(
        map((data: Observable<any>[]) => {
          return data['rates'];
        })
      );
    }
  }

  getAllCurrencies() {
    return this.httpClient.get('https://api.exchangeratesapi.io/latest').pipe(
      map((data: Observable<any>[]) => {
        return data['rates'];
      })
    );
  }

  updateRates() {
    this.ratesSubscription = this.getRates().subscribe(
      (data) => {
        this.ratesUpdated.next(data);
        this.alertService.setAlert('Action Performed Successfully.', 'success');
        this.btnLoaderService.hideLoader();
      }
    );
  }

  storeSupportedCurrencies(currencies: string) {
    localStorage.setItem('currencies', currencies);
    this.supportedCurrencies = currencies;
  }

  getSupportedCurrencies() {
    this.supportedCurrencies = localStorage.getItem('currencies');
    return this.supportedCurrencies;
  }

  removeSupportedCurrency(currency: string) {
    this.btnLoaderService.displayLoader();
    if (this.supportedCurrencies.indexOf(currency) === 0) {
      this.supportedCurrencies = this.supportedCurrencies.length > 3 ?
          this.supportedCurrencies.replace(currency + ',', '') :
          this.supportedCurrencies.replace(currency, '');
    } else {
      this.supportedCurrencies = this.supportedCurrencies.replace(',' + currency, '');
    }
    this.storeSupportedCurrencies(this.supportedCurrencies);
    this.updateRates();
  }

  addSupportedCurrency(currency: string) {
    this.btnLoaderService.displayLoader();
    this.supportedCurrencies = !this.supportedCurrencies ? currency : (this.supportedCurrencies + ',' + currency);
    this.storeSupportedCurrencies(this.supportedCurrencies);
    this.updateRates();
  }

  ngOnDestroy() {
    this.ratesSubscription.unsubscribe();
  }
}
