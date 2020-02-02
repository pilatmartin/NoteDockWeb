import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Folder } from 'src/app/models/folder';
import { Note } from 'src/app/models/note';
import {ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddFolderComponent } from 'src/app/dialogs/add-folder/add-folder.component';
import { FolderService } from 'src/app/services/folder.service';
import { NoteService } from 'src/app/services/note.service';
import * as firebase from 'firebase/app';
import { ProfileComponent } from 'src/app/dialogs/profile/profile.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class HomeComponent implements OnInit {
  folders: Folder[] = null
  notes: Note[] = []
  pinnedNotes: Note[] = []
  user: any = JSON.parse(localStorage.getItem('user'))
  noteData: any
  currentFolder: any
  currentNote: any
  newFolder: string
  showNoteBtn: boolean = false
  showContent: boolean = false
  showImgCrop: boolean = false

  constructor(
    public as: AuthService,
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public dialog: MatDialog,
    public fs: FolderService,
    public ns: NoteService
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

    //registering listener (on note ID change)
    this.currentFolder.registerListener((val)=>{
    this.getNotes().subscribe((data)=>{
      let notes = data.map((value)=>{
        return {
          uid: value.payload.doc.id,
          ...value.payload.doc.data()
        } as Note
      })
      this.notes=[]
      this.pinnedNotes = []
      notes.forEach((note)=>{
        note.updated = note.updated.toDate().toLocaleString()
        console.log(note.pinned)
        if(note.pinned==true){
          this.pinnedNotes.push(note)
        }else{
          this.notes.push(note)
        }
      })
    })
    console.log(this.pinnedNotes)
       })
  }

  getFolders(){
    return this.fs.getFolders(this.user.uid)
  }

  addFolder(){
    let folder = { added: firebase.firestore.Timestamp.now(), name: this.newFolder, notesCount: 0}
    this.fs.addFolder(this.user.uid,folder)
  }

  getNotes(){
    this.showNoteBtn = true
    return this.ns.getNotes(this.currentFolder, this.user.uid)
  }

  addNote(){
    this.ns.addNote(this.currentFolder, this.user.uid)
  }
  
  deleteNote(){
    console.log(this.currentFolder, this.user.uid,this.currentNote.uid)
    this.ns.deleteNote(this.currentFolder, this.user.uid,this.currentNote.uid)
  }

  updateNote(title, desc,pinned?){
    console.log(pinned)
    let note = {
      id: this.currentNote.uid,
      updated: firebase.firestore.Timestamp.now(),
      title: title,
      description: desc,
      pinned: pinned
    }

    this.ns.updateNote(this.currentFolder, this.user.uid, note)
  }

  setCurrentFolderId(id){
    this.currentFolder.idcko = id
  }

  logOut(){
    this.as.logout()
  }

  showNoteData(note){
    this.showContent = true
    this.currentNote = note      
  }

  changeDisplayName(name){
    this.user.displayName = name
  }

  openFolderDialog(){
    const dialogRef = this.dialog.open(AddFolderComponent, {
      width: '250px',
      data: {name: this.newFolder}
    })

    dialogRef.afterClosed().subscribe(result => {
      this.newFolder = result
      if(this.newFolder != null){
        this.addFolder()
      }

    })
  }

  openProfileDialog(){
    const dialogRef = this.dialog.open(ProfileComponent, {
      width: '350px',
      data: {displayName: this.user.displayName}
    })
    dialogRef.afterClosed().subscribe(result=>{
      this.user.displayName = result.displayName
      console.log(this.user.displayName)
    })
  }

  openImageCrop(){
    this.showImgCrop = !this.showImgCrop
  }

}
