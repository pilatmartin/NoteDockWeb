import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    public as: AuthService,
    public router: Router) { }

    canActivate(
      nextDest: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean{
        
        if(!(this.as.isLogged)){

          //this.router.navigate(['login'])

        }
        return true
      }
    }
