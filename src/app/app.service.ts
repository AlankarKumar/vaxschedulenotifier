import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PushNotificationsService } from 'ng-push-ivy';
import { Observable, of, timer } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import {
  Center,
  RootObject,
  Session,
  States,
  State,
  Districts,
} from './models/center.model';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  endpoint: string = 'https://cdn-api.co-vin.in/api';
  constructor(
    private http: HttpClient,
    private pushNotification: PushNotificationsService
  ) {}

  authenticate(cell) {
    return this.http
      .post(`${this.endpoint}/v2/auth/public/generateOTP`, {
        mobile: cell,
      })
      .pipe(map((data) => data['txnId']));
  }

  getCenterByDistrict(district_id, date) {
    return this.http
      .get<RootObject>(
        `${this.endpoint}/v2/appointment/sessions/public/calendarByDistrict`,
        {
          params: {
            district_id,
            date,
          },
        }
      )
      .pipe(
        map((data) => data.centers),
        map((centers: Center[]) =>
          centers.filter(
            (center) =>
              center.sessions.filter(
                (session: Session) => session.available_capacity > 0
              ).length > 0
          )
        ),
        catchError((err) => of(err))
      );
  }

  getStates() {
    return this.http
      .get<States>(`${this.endpoint}/v2/admin/location/states`)
      .pipe(map((data) => data.states));
  }

  getDistricts(state_id) {
    return this.http
      .get<Districts>(
        `${this.endpoint}/v2/admin/location/districts/${state_id}`
      )
      .pipe(map((data) => data.districts));
  }

  startServer(district_id) {
    const date = new Date();
    return timer(1, 900000).pipe(
      switchMap(() =>
        this.getCenterByDistrict(
          district_id,
          `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
        )
      ),
      switchMap((data: Center[]) => {
        const message =
          data.length > 0
            ? `${data.length} centers found @ ${data[0]?.name} located at ${data[0]?.address}`
            : `Please wait for next notification...`;
        let options = {
          body: message,
          icon: 'assets/cowin.jpeg',
        };
        return data.length > 0
          ? this.pushNotification.create(
              `@ ${data[0].name} located at ${data[0].address}`,
              options
            )
          : this.pushNotification.create(`No Centers Found`, options);
      })
    );
  }
}
