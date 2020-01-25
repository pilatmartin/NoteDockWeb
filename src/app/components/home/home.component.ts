import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Folder } from 'src/app/models/folder';
import { Note } from 'src/app/models/note';
import {ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  folders: Folder[] = null
  notes: Note[] = null
  user: any = JSON.parse(localStorage.getItem('user'))
  currentFolder: any

  constructor(
    public as: AuthService,
    public afs: AngularFirestore,
    public afa: AngularFireAuth
    ) {
      //LISTENING TO VARIABLE CHANGES    
      this.currentFolder = {
      id: null,
      idListener: function(val) {},
      set idcko(val) {
        this.id = val;
        this.idListener(val);
      },
      get idcko(){
        return this.id
      },
      registerListener: function(listener) {
        this.idListener = listener;
      }
    } 
  }

  ngOnInit() {
    //getting folders 
    this.getFolders().subscribe((data)=>{
      let folders = data.map((value)=>{
        return {
          uid: value.payload.doc.id,
          ...value.payload.doc.data()
        } as Folder;
      })
      this.folders = folders
    })

    //registering listener
    this.currentFolder.registerListener((val)=>{
      console.log('works')
    this.getNotes().subscribe((data)=>{
      let notes = data.map((value)=>{
        return {
          uid: value.payload.doc.id,
          ...value.payload.doc.data()
        } as Note
      })
      this.notes = notes
    })
       })

  }

  getFolders(){
    //let path: string = 'users/' + this.user.uid + '/folders'
    return this.afs.collection('users').doc(this.user.uid).collection('folders').snapshotChanges()
  }

  getNotes(){
    if(this.currentFolder != null){
      return this.afs.collection('users')
      .doc(this.user.uid).collection('folders')
      .doc(this.currentFolder.id).collection('notes')
      .snapshotChanges()
    }else{
      return null
    }


  }
  
  setCurrentFolderId(id){
    this.currentFolder.idcko = id
  }

  logOut(){
    this.as.logout()
  }

  showNoteData(note){
    (<HTMLInputElement>document.getElementById('note-title')).value = note.title;
     (<HTMLInputElement>document.getElementById('note-description')).value = note.description;
  }

}
