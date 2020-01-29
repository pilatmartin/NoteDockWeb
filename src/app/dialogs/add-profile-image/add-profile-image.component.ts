import { Component, OnInit, ChangeDetectionStrategy, Inject} from '@angular/core';
import {ImageCroppedEvent} from 'ngx-image-cropper'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface profileImgData{
  base64: any
}

@Component({
  selector: 'app-add-profile-image',
  templateUrl: './add-profile-image.component.html',
  styleUrls: ['./add-profile-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProfileImageComponent implements OnInit {

  imageChangedEvent: any = ''
  croppedImage: any = ''

  constructor(public dialogRef: MatDialogRef<AddProfileImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data:profileImgData
    ) { }

  fileChangeEvent(event: any){
    this.imageChangedEvent = event
  }_
  imageCropped(event: ImageCroppedEvent){
    this.croppedImage = event.base64
  }

  imageLoaded() {
    // show cropper
}
cropperReady() {
    // cropper ready
}
loadImageFailed() {
    // show message
}

  ngOnInit() {
  }

}
