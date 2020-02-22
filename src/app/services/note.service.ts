import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(
    public afs: AngularFirestore,
    public toast: ToastrService
     ) { }

  getNotes(currentFolder,user): Observable<any>{
    if(currentFolder != null){
      let path: string = 'users/' + user + '/folders/' + currentFolder.id + '/notes'
      //SELECT Notes ORDER BY updated
      return this.afs.collection(path, ref => ref.orderBy('updated', 'desc')).snapshotChanges()
    }else{
      return null
    }
  }

  addNote(currentFolder,user){
    let path: string = 'users/' + user + '/folders/' + currentFolder.idcko + '/notes'
    let note = {
      updated: firebase.firestore.Timestamp.now(),
      title: 'Untitled',
      description: '',
      marked: false
    }

    //adding note - on error display popup with error message
    this.afs.collection(path).add(note).then((doc)=>{
      return doc.id
    })
      .catch((error)=>{
        this.toast.error(error)
    })
  }

  updateNote(currentFolder, user, note):void{
    let path: string = 'users/' + user + '/folders/' + currentFolder.idcko + '/notes/' + note.id
    console.log(note.updated)
    //updating note 
    this.afs.doc(path).update({
      updated: firebase.firestore.Timestamp.now(),
      title: note.title,
      description: note.description
    })
    //on success
    .then(()=>{
      //this.toast.success("Note has been succesfully updated!")
    })
    //on error
    .catch((error)=>{
      this.toast.error(error.message)
    })
  }

  deleteNote(currentFolder, user, noteID):void{
    let path: string = 'users/' + user + '/folders/' + currentFolder.idcko + '/notes/' + noteID
    
    this.afs.doc(path).delete()
    .then(()=>{
      //this.toast.success('Note has been succesfully deleted!')
    })
    .catch((error)=>{
      this.toast.error(error.message)
    })
  }
  pinNote(noteID, userID, currentFolder):void{
    let path: string = 'users/' + userID + '/folders/' + currentFolder.idcko + '/notes/' + noteID
    this.afs.doc(path).update({
      marked: true
    }).catch((error)=>{
      this.toast.error(error.message)
    })
  }
  unpinNote(noteID, userID, currentFolder):void{
    let path: string = 'users/' + userID + '/folders/' + currentFolder.idcko + '/notes/' + noteID
    this.afs.doc(path).update({
      marked: false
    }).catch((error)=>{
      this.toast.error(error.message);
    })
  }


}
