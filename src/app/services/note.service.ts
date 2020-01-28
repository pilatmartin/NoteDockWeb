import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(
    public afs: AngularFirestore,
    public toast: ToastrService
     ) { }

  getNotes(currentFolder,user){
    if(currentFolder != null){
      let path: string = 'users/' + user + '/folders/' + currentFolder.id + '/notes'
      return this.afs.collection(path).snapshotChanges()
    }else{
      return null
    }
  }

  addNote(currentFolder,user){
    let path: string = 'users/' + user + '/folders/' + currentFolder.idcko + '/notes'
    let note = {
      updated: firebase.firestore.Timestamp.now(),
      title: 'Untitled',
      description: ''
    }

    //adding note - on error display popup with error message
    this.afs.collection(path).add(note)
      .catch((error)=>{
        this.toast.error(error)
    })
  }

  updateNote(currentFolder, user, note){
    let path: string = 'users/' + user + '/folders/' + currentFolder.idcko + '/notes/' + note.id
    console.log(note.updated)
    //updating note 
    this.afs.doc(path).set({
      updated: firebase.firestore.Timestamp.now(),
      title: note.title,
      description: note.description
    })
    //on success
    .then(()=>{
      this.toast.success('Note has been successfully updated!')
    })
    //on error
    .catch((error)=>{
      this.toast.error(error.message)
    })
  }

  deleteNote(currentFolder, user, noteID){
    let path: string = 'users/' + user + '/folders/' + currentFolder.idcko + '/notes/' + noteID
    console.log(currentFolder.idcko)
    this.afs.doc(path).delete()
    //on success
    .then(()=>{
      this.toast.success('Note has been succesfully deleted!')
    })
    //on error
    .catch((error)=>{
      this.toast.error(error.message)
    })
  }


}
