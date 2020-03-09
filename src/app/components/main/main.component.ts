import { Component, OnInit, Inject } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LOCALE_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  deviceInfo = null

  constructor(public deviceService: DeviceDetectorService,
    public router: Router,
    public as: AuthService,
    @Inject(LOCALE_ID) public locale: string,
    public translate: TranslateService) {
    this.showDevice()
    console.log(this.getUsersLocale(this.locale))
    translate.setDefaultLang('en')
  }
  useLanguage(language: string) {
    this.translate.use(language);
}

  ngOnInit() {
    //this.router.navigate(['login'])
  }

  showDevice() {
    // this.deviceInfo = this.deviceService.getDeviceInfo()

    // // const isMobile = this.deviceService.isMobile()
    // // const isTablet = this.deviceService.isTablet()
    // // const isDesktop = this.deviceService.isDesktop()

  }

  getUsersLocale(defVal: string): string {
    if (typeof window === 'undefined') {
      return defVal
    }
    const wn = window.navigator as any
    let lang = wn.languages ? wn.languages[0] : defVal
    lang = lang || wn.language || wn.browserLanguage || wn.userLanguage
    return lang
  }

}
