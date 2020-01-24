import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EmailValidator, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  //checking email
  email = new FormControl('',[Validators.required, Validators.email]);

  constructor(public as: AuthService) {
   }

  ngOnInit() {
  }

  //returning error msg if email is invalid
  getErrorMsg(){
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' : ''
  }

  forgotPassword(email){
    
    this.as.forgotPassword(email)
  }

}
