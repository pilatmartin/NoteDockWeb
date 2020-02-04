import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  
  constructor(public afs: AngularFirestore, public afa: AngularFireAuth, public toast: ToastrService) {


   }

  getFolders(userID){
    let path: string = 'users/' + userID + '/folders'
    return this.afs.collection(path,ref => ref.orderBy('added', 'desc')).snapshotChanges()
  }

  addFolder(userID, folder){
    let path: string = 'users/' + userID + '/folders'
    this.afs.collection(path).add(folder)
  }

  deleteFolder(userID, folderID){
    console.log(userID, folderID)
    let path: string = "users/"+userID+"/folders/"+folderID
    this.afs.doc(path).delete()
  }

}


