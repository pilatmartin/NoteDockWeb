import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChange } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  
  constructor(public afs: AngularFirestore, public afa: AngularFireAuth, public toast: ToastrService) {


   }

  getFolders(userID): Observable<any>{
    let path: string = 'users/' + userID + '/folders'
    return this.afs.collection(path,ref => ref.orderBy('added', 'desc')).snapshotChanges()
  }

  addFolder(userID, folder): void{
    let path: string = 'users/' + userID + '/folders'
    this.afs.collection(path).add(folder)
  }

  deleteFolder(folderID, userID) :void{
    let path: string = "users/"+userID+"/folders/"+folderID
    console.log(path)
    this.afs.doc(path).delete()
  }

  updateFolder(folderName, userID,folderID):void{
    let path: string = "users/"+userID+"/folders/"+folderID
    this.afs.doc(path).update({name: folderName})
  }

}


