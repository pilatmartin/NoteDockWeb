import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'NoteDockDoneRight';
  langs: Array<String> = ['en-US', 'sk']
  constructor(private translate: TranslateService){
    this.translate.setDefaultLang(this.getUsersLocale('en-US'))
    console.log(this.getUsersLocale('en-US'))
  }
  getUsersLocale(defVal: string): string {
    if (typeof window === 'undefined') {
      return defVal
    }
    const wn = window.navigator as any
    let lang = wn.languages ? wn.languages[0] : defVal
    lang = lang || wn.language || wn.browserLanguage || wn.userLanguage

    if (this.langs.includes(lang)) {
      return lang
    }else return defVal
    
  }
}
