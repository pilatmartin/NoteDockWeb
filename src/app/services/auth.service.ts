import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any
  constructor(
    public af: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    public toast: ToastrService) {

      //storing data in local storage
      this.afAuth.authState.subscribe(user =>{
        if(user){
          this.userData = user
          localStorage.setItem('user',JSON.stringify(this.userData))//if logged in
          JSON.parse(localStorage.getItem('user'))
        }else{
          localStorage.setItem('user',null)//if logout
          JSON.parse(localStorage.getItem('user'))
        }
      })
     }

     login(email,password){
       return this.afAuth.auth.signInWithEmailAndPassword(email,password)
        .then((result)=>{
          this.ngZone.run(()=>{
            this.router.navigate(['home'])
          })
         this.setUserData(result.user)
        }).catch((error)=>{
          this.toast.error(error.message)
        })
     }

     register(email,password){
      return this.afAuth.auth.createUserWithEmailAndPassword(email,password)
        .then((result)=>{
          this.sendVerificationMail()
          this.setUserData(result.user)
        }).catch((error)=>{
          this.toast.error(error)
        })
     }

     sendVerificationMail(){
       return this.afAuth.auth.currentUser.sendEmailVerification()
        .then(()=>{
          this.router.navigate(['verify-email'])
        })
     }

     forgotPassword(email){
       return this.afAuth.auth.sendPasswordResetEmail(email)
        .then(()=>{
          this.toast.success('Email sent, check your inbox')
        }).catch((error)=>{
          this.toast.error(error)
        })
     }

     get isLogged(){
       const user = JSON.parse(localStorage.getItem('user'))
       return (user !== null && user.emailVerified !== false) ? true : false
     }

     setUserData(user){
      const userRef: AngularFirestoreDocument<any> = this.af.doc('users/${user.uid}')
      const data: User = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified
      }
      return userRef.set(Object.assign({}, data), {merge:true})
     }

     logout(){
       return this.afAuth.auth.signOut().then(()=>{
         localStorage.removeItem('user')
         this.router.navigate([''])//navigate to login page
       })
     }
}
