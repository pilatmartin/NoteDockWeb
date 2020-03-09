import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public as: AuthService, public toast: ToastrService, public translate: TranslateService) { }

  ngOnInit() {}

  login(email,password){
      this.as.login(email,password)
  }  

}
