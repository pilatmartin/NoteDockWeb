import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  deviceInfo = null
  constructor(public deviceService: DeviceDetectorService) { 
    this.showDevice()
  }

  ngOnInit() {
  }

  showDevice(){
    this.deviceInfo = this.deviceService.getDeviceInfo()

    const isMobile = this.deviceService.isMobile()
    const isTablet = this.deviceService.isTablet()
    const isDesktop = this.deviceService.isDesktop()

    console.log(this.deviceInfo)
    console.log(isMobile," - Mobile")
    console.log(isTablet, " - Tablet")
    console.log(isDesktop, " - Desktop")
  }

}
