import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface addFolderData{
  name: string
}

@Component({
  selector: 'app-add-folder',
  templateUrl: './add-folder.component.html',
  styleUrls: ['./add-folder.component.scss']
})
export class AddFolderComponent implements OnInit {

  constructor(
     public dialogRef: MatDialogRef<AddFolderComponent>,
     @Inject(MAT_DIALOG_DATA) public data: addFolderData
     ) { }

  ngOnInit() {
  }

  onNoClick(){
    this.dialogRef.close()
  }

}
