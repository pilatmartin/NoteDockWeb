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
    public dialogRef: MatDialogRef<ProfileComponent>,
     @Inject(MAT_DIALOG_DATA) public data: profileData,
     public as: AuthService
  ) { }

  ngOnInit() {
    this.userData = this.as.userData
  }

  onNoClick(){
    this.dialogRef.close()
  }

  updateUser(displayName, email){
    this.as.updateUser(displayName, email)
    this.dialogRef.close()
  }
}
