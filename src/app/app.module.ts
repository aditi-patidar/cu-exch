import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CurrencyExchangeComponent } from './currency-exchange/currency-exchange.component';
import {NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {ExchangeRatesService} from './exchange-rates.service';
import {FormsModule} from '@angular/forms';
import {AlertService} from './alert.service';
import {AngularButtonLoaderModule} from 'angular-button-loader';

const routes = [
  {path: '', component: CurrencyExchangeComponent},
  {path: '**', component: CurrencyExchangeComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    CurrencyExchangeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule,
    NgbAlertModule,
    AngularButtonLoaderModule.forRoot()
  ],
  providers: [ExchangeRatesService, AlertService],
  bootstrap: [AppComponent]
})
export class AppModule { }
