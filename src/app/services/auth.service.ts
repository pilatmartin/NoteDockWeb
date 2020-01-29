import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any
  constructor(
    public af: AngularFirestore,//firebase database
    public afa: AngularFireAuth,//firebase auth database
    public router: Router,//navigation
    public ngZone: NgZone,//performance - come back to angular zone
    public toast: ToastrService,//toasts
  ) {
      //storing data in local storage
      this.afa.authState.subscribe(user =>{
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
       return this.afa.auth.signInWithEmailAndPassword(email,password)
        .then((result)=>{
          this.ngZone.run(()=>{
            this.router.navigate(['home'])
          })
         this.setUserData(result.user)
        }).catch((error)=>{
          this.toast.error(error.message)
        })
     }

     register(email,password, passwordConfirm){
      if(password.localeCompare(passwordConfirm)==0){
        return this.afa.auth.createUserWithEmailAndPassword(email,password)
          .then((result)=>{
            this.verificateUser()
            this.setUserData(result.user)
            this.toast.success("Your account has been created!")
          }).catch((error)=>{
            this.toast.error(error)
          })
      }else{
        this.toast.error("Passwords must match!")
      }
     }

     verificateUser(){
       return this.afa.auth.currentUser.sendEmailVerification()
        .then(()=>{
          this.router.navigate(['login'])
        })
     }

     forgotPassword(email){
       return this.afa.auth.sendPasswordResetEmail(email)
        .then(()=>{
          this.toast.success('Email sent, check your inbox')
        }).catch((error)=>{
          this.toast.error(error.message)
        })
     }

     //check if user is logged in
     get isLogged(){
       const user = JSON.parse(localStorage.getItem('user'))
       return (user !== null && user.emailVerified !== false) ? true : false
     }

     setUserData(user){
      let path = "users/" + user.uid;
      const userRef: AngularFirestoreDocument<any> = this.af.doc(path)
      const data = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified
      }
      return userRef.set(Object.assign({}, data), {merge:true})
     }

     logout(){
       return this.afa.auth.signOut().then(()=>{
         localStorage.removeItem('user')//clears localstorage data
         this.router.navigate(['login'])//navigate to login page
       })
     }

     updateUser(displayName, email){
      try {
        this.updateData(email,displayName)
        this.toast.success("Changes will be updated shortly")
      } catch (error) {}
     }

     //update user data (displayName can be null)
     updateData(email, displayName?){
       this.afa.auth.currentUser.updateProfile({
         displayName: displayName
       }).catch((error)=>{
         this.toast.error(error.message)
       })
       this.afa.auth.currentUser.updateEmail(email)
      .catch((error)=>{
        this.toast.error(error.message)
      })
     }
}
