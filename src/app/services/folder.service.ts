import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChange } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  
  constructor(public afs: AngularFirestore, 
    public afa: AngularFireAuth, 
    public toast: ToastrService, 
    public translate: TranslateService) {


   }

  getFolders(userID): Observable<any>{
    let path: string = 'users/' + userID + '/folders'
    return this.afs.collection(path,ref => ref.orderBy('added', 'desc')).snapshotChanges()
  }

  addFolder(userID, folder):void{
    let path: string = 'users/' + userID + '/folders'
    this.afs.collection(path).add(folder).catch((error)=>{
      this.toast.error(this.translate.instant('error.general'))
    })
  }

  deleteFolder(folderID, userID):void{
      let path: string = "users/"+userID+"/folders/"+folderID
      this.afs.doc(path).delete().catch((error)=>{
        this.toast.error(this.translate.instant('error.general'))
      })
  }

  updateFolder(folderName, userID,folderID):void{
    let path: string = "users/"+userID+"/folders/"+folderID
    this.afs.doc(path).update({name: folderName}).catch((error)=>{
      this.toast.error(this.translate.instant('error.general'))
    })
  }

}


