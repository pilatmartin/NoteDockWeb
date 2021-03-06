import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, ErrorStateMatcher } from '@angular/material';
import * as firebase from 'firebase/app';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any
  password: string
  constructor(
    public af: AngularFirestore,//firebase database
    public afa: AngularFireAuth,//firebase auth database
    public router: Router,//navigation
    public ngZone: NgZone,//performance - come back to angular zone
    public toast: ToastrService,//toasts
    public dialog: MatDialog,
    public translate: TranslateService
  ) {
    //setting cache size
    firebase.firestore().settings({
      cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
    });
    //enable offline persistence
    firebase.firestore().enablePersistence().catch((error)=> {
      if (error.code == 'failed-precondition') {
        this.toast.error(this.translate.instant('error.multipleTabs'))

      } else if (error.code == 'unimplemented') {
          this.toast.error(this.translate.instant('error.unimplemented'))
      }
  });

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
       //this.afa.auth.signInWithEmailAndPassword(email,password)
       
        return this.afa.auth.signInWithEmailAndPassword(email,password)
        .then((result)=>{
          this.ngZone.run(()=>{
            this.router.navigate(['home'])
          })
         this.setUserData(result.user)
        }).catch((error)=>{
          this.toast.error(this.translate.instant('error.'+error.code))
        })
     }

     register(email,password, passwordConfirm){
      if(password.localeCompare(passwordConfirm)==0){
        return this.afa.auth.createUserWithEmailAndPassword(email,password)
          .then((result)=>{
            this.verificateUser()
            this.setUserData(result.user)
            this.toast.success(this.translate.instant('success.accountCreated'))
          }).catch((error)=>{
            this.toast.error(this.translate.instant('error.'+error.code))
          })
      }else{
        this.toast.error(this.translate.instant('error.passwords'))
      }
     }

     verificateUser(){
       return this.afa.auth.currentUser.sendEmailVerification()
        .then(()=>{
          this.router.navigate(['login'])
          this.toast.info('pre prihlase')
        })
     }

     forgotPassword(email){
       return this.afa.auth.sendPasswordResetEmail(email)
        .then(()=>{
          this.toast.success(this.translate.instant('success.emailSent'))
        }).catch((error)=>{
          this.toast.error(this.translate.instant('error.'+error.code))
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

     updateUser(displayName){//, email, password
      try {
        this.updateData( displayName)//email, password,
      } catch (error) {
        this.toast.error(this.translate.instant('error.'+error.code))
      }
     }

     //update user data (displayName can be null)
     updateData( displayName?){//email, password,

      // var user = firebase.auth().currentUser;
      // var credential = firebase.auth.EmailAuthProvider.credential(
      // firebase.auth().currentUser.email,
      // password
      // );

      // Prompt the user to re-provide their sign-in credentials

      //user.reauthenticateAndRetrieveDataWithCredential(credential).then(()=> {

        this.afa.auth.currentUser.updateProfile({
          displayName: displayName
        }).then(()=>{

         this.toast.success(this.translate.instant('success.profileUpdated'))

        }).catch((error)=>{

          this.toast.error(this.translate.instant('error.'+error.code))

        })

      //   this.afa.auth.currentUser.updateEmail(email).then(()=>{

      //    const credential = firebase.auth.EmailAuthProvider.credential(this.afa.auth.currentUser.email, password)

      //    this.afa.auth.currentUser.reauthenticateWithCredential(credential)
         
      //    localStorage.removeItem('user')
      //   })
      //  .catch((error)=>{
      //    this.toast.error(error.message)
      //  })

      // }).catch((error)=> {
      //   this.toast.error(error.message)
      // });


     }

     deleteUser(){
       this.afa.auth.currentUser.delete().then(()=>{
         this.logout()
       }).catch((error)=>{
        this.toast.error(this.translate.instant('error.auth/'+error.code))
       })
     }
}
