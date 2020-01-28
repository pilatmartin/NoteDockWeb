import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

  constructor(public afs: AngularFirestore) { }

  getFolders(userID){
    let path: string = 'users/' + userID + '/folders'
    return this.afs.collection(path).snapshotChanges()
  }

  addFolder(userID, folder){
    let path: string = 'users/' + userID + '/folders'
    this.afs.collection(path).add(folder)
  }

}


