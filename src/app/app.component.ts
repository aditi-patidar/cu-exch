import {Component, OnDestroy, OnInit} from '@angular/core';
import {ExchangeRatesService} from './exchange-rates.service';
import {AlertService} from './alert.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  alertText: string;
  alertType: string;
  showAlert = false;
  alertSubscription: Subscription;

  constructor(private exchRates: ExchangeRatesService, private alertService: AlertService) {}

  ngOnInit() {
    if (!this.exchRates.getSupportedCurrencies()) {
      this.exchRates.storeSupportedCurrencies('CAD,IDR,GBP,CHF,SGD,INR,MYR,JPY,KRW');
    } else {
      this.exchRates.getSupportedCurrencies();
    }
    this.alertSubscription = this.alertService.alert.subscribe(
      (alert: object) => {
        this.alertText = alert['alertText'];
        this.alertType = alert['alertType'];
        this.showAlert = true;
        setTimeout(() => {
          this.closeAlert();
        }, 3000);
      }
    );
  }

  closeAlert() {
    this.showAlert = false;
  }

  ngOnDestroy() {
    this.alertSubscription.unsubscribe();
  }
}
