import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  //checking email
  email = new FormControl('',[Validators.required, Validators.email]);

  constructor(public as: AuthService,
    public translate: TranslateService) {
   }

  ngOnInit() {
  }

  //returning error msg if email is invalid
  getErrorMsg(){
    return this.email.hasError('required') ? this.translate.instant('error.emailEmpty') :
      this.email.hasError('email') ? this.translate.instant('error.emailInvalid') : ''
  }

  forgotPassword(email){
    
    this.as.forgotPassword(email)
  }

}
