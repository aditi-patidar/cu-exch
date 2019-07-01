import {Subject} from 'rxjs';

export class AlertService {
  alert = new Subject();

  setAlert(text: string, type: string) {
    this.alert.next({'alertText': text, 'alertType': type});
  }
}
