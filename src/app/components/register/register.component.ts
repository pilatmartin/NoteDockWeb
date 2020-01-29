import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(public as: AuthService) { }

  ngOnInit() {
  }

  register(email,password, passwordConfirm){
      this.as.register(email,password, passwordConfirm)
  }

}
