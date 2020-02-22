import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';

export interface profileData{
  displayName: string
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userData: any
  constructor(
    public dialog: MatDialogRef<ProfileComponent>,
     @Inject(MAT_DIALOG_DATA) public data: profileData,
     public as: AuthService
  ) { }

  ngOnInit() {
    this.userData = this.as.userData
  }

  onNoClick(){
    this.dialog.close()
  }

  updateUser(displayName){//, email,password
    this.as.updateUser(displayName)//, email, password
    //if (password != null) {
      this.dialog.close({displayName: displayName})   //, email: email
    //}

  }
}
