import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    public as: AuthService,
    public router: Router,
    public deviceService: DeviceDetectorService) { }
    deviceInfo = null
    canActivate(
      nextDest: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean{
        this.deviceInfo = this.deviceService.getDeviceInfo()
        if(!(this.as.isLogged ) || this.deviceService.isMobile() || this.deviceService.isTablet()){

          this.router.navigate(['main'])

        }
        return true
      }
    }
