import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { PushNotificationsService } from 'ng-push-ivy';
import { Observable, Subscription } from 'rxjs';
import { AppService } from './app.service';
import { District, State, States } from './models/center.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private appService: AppService,
    private cd: ChangeDetectorRef,
    private pushNotification: PushNotificationsService
  ) {}
  emailFormControl: FormControl;
  districtFormControl: FormControl;
  authSubscription: Subscription;
  serverSubscription: Subscription;
  states: Observable<State[]>;
  districts: Observable<District[]>;
  disableDistricts: boolean = true;
  selectedDistrict: number;

  @ViewChild(MatSelect) input: MatSelect;

  ngOnInit() {
    this.states = this.appService.getStates();
    this.emailFormControl = new FormControl('', [Validators.required]);
    this.districtFormControl = new FormControl(
      { value: '', disabled: this.disableDistricts },
      [Validators.required]
    );
  }

  ngAfterViewInit() {
    // this.input.focus();
    // this.cd.detectChanges();
  }

  onStateSelectionChange($event) {
    this.districts = this.appService.getDistricts($event.value);
    this.districtFormControl.enable();
  }

  onDistrictSelectionChange($event) {
    this.selectedDistrict = $event.value;
  }

  onClick() {
    this.pushNotification.requestPermission();
    // let options = {
    //   body: 'Slots available in your area.',
    //   icon: 'assets/cowin.jpeg',
    // };
    // this.pushNotification.create('IRON MAN', options).subscribe();
    this.serverSubscription = this.appService
      .startServer(this.selectedDistrict)
      .subscribe(console.log);
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
    this.serverSubscription.unsubscribe();
  }
}
