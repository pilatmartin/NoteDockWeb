import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Folder } from 'src/app/models/folder';
import { Note } from 'src/app/models/note';
import {ViewEncapsulation } from '@angular/core';
import { MatDialog, MatMenuTrigger, _MatMenuDirectivesModule, MatMenuModule } from '@angular/material';
import { AddFolderComponent } from 'src/app/dialogs/add-folder/add-folder.component';
import { FolderService } from 'src/app/services/folder.service';
import { NoteService } from 'src/app/services/note.service';
import * as firebase from 'firebase/app';
import { ProfileComponent } from 'src/app/dialogs/profile/profile.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


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
  newNote: string
  folderName: string
  showNoteBtn: boolean = false
  showContent: boolean = false
  showImgCrop: boolean = false
  menuTrigger: MatMenuTrigger

  constructor(
    public as: AuthService,
    public afs: AngularFirestore,
    public afa: AngularFireAuth,
    public dialog: MatDialog,
    public fs: FolderService,
    public ns: NoteService,
    public toast: ToastrService,
    public matMenuModule: MatMenuModule,
    public router: Router,
    public translate: TranslateService,
    ) {

      if(!(this.as.isLogged)){
        this.router.navigate(['login'])
      }
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

    //########################### NOTHING TO SEE HERE #########################

    // //offline notifications folders
    // let pathFolders: string = 'users/' + this.user.uid + '/folders'
    // firebase.firestore().collection(pathFolders).onSnapshot((snapshot)=>{
    //   if (!(snapshot.docChanges().length>2)) {    
    //     snapshot.docChanges().forEach((change)=>{
    //       switch (change.type) {
    //         case 'added':
    //           this.toast.success('Folder added')
    //           break;
    //         case 'modified':
    //           this.toast.success('Folder modified')
    //           break;
    //         case 'removed':
    //           this.toast.success('Folder removed')
    //           break;
    //         default:
    //           break;
    //       }
    //     })
    //   }  
    // })

    //getting folders 
    this.getFolders().subscribe((data)=>{
      let folders = data.map((value)=>{
        return {
          uid: value.payload.doc.id,
          ...value.payload.doc.data()
        } as Folder;
      })
      this.folders = folders
      this.currentFolder.idcko = this.folders[0].uid
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
        if(note.marked==true){
          this.pinnedNotes.push(note)
        }else{
          this.notes.push(note)
        }
      })
    })
       })


  }

  getFolders(){
    return this.fs.getFolders(this.user.uid)
  }

  addFolder(folderName){
    let folder = { added: firebase.firestore.Timestamp.now(), name: folderName, notesCount: 0}
    this.fs.addFolder(this.user.uid,folder)
  }

  deleteFolder(){
    this.fs.deleteFolder(this.currentFolder.idcko, this.user.uid)
    setTimeout(()=>{
      this.currentFolder.idcko = ""
    },100)

    this.showNoteBtn = false
  }

  updateFolder(folderName){
    this.fs.updateFolder(folderName, this.user.uid, this.currentFolder.idcko)
  }

  getNotes(){
    this.showNoteBtn = true
    return this.ns.getNotes(this.currentFolder, this.user.uid)
  }

  addNote(){
    this.ns.addNote(this.currentFolder, this.user.uid)
  }
  
  deleteNote(){
    this.ns.deleteNote(this.currentFolder, this.user.uid,this.currentNote.uid)
    this.currentNote = {}
    this.showContent = false
  }

  pinNote(noteID){
    this.ns.pinNote(noteID, this.user.uid,this.currentFolder)
  }
  unpinNote(noteID){
    this.ns.unpinNote(noteID, this.user.uid,this.currentFolder)
  }

  updateNote(title, desc,marked?){
    let note = {
      id: this.currentNote.uid,
      updated: firebase.firestore.Timestamp.now(),
      title: title,
      description: desc,
      marked: marked
    }

    this.ns.updateNote(this.currentFolder, this.user.uid, note)
  }

  setCurrentFolderId(id){
    this.currentFolder.idcko = id
    this.currentNote = null
    this.showContent = false
    this.showNoteBtn = true
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

  openFolderDialog(action){
    const dialogRef = this.dialog.open(AddFolderComponent, {
      width: '250px',
      data: {name: ""}
    })

    dialogRef.afterClosed().subscribe(result => {
      if(result != null){
        let name = result.trim()
        if(name.length>0){
          if (action == 'create') {
            this.addFolder(name)
          }
          else if(action == 'update'){
            this.updateFolder(name)
          }
      }else{
        this.toast.error(this.translate.instant('error.general'))
      }
    }

    })
  }

  openProfileDialog(){
    const dialogRef = this.dialog.open(ProfileComponent, {
      width: '350px',
      data: {displayName: this.user.displayName}
    })
    dialogRef.afterClosed().subscribe(result=>{

      if (result != undefined) {
        this.user.displayName = result.displayName
      }
      
    })
  }

  openImageCrop(){
    this.toast.info(this.translate.instant('error.featureUnavailable'))
  }
  pinHover(divId: string, ihide: number, ishow:number):void{
    (<HTMLElement>document.getElementById(divId).childNodes.item(ihide)).style.display = "none";
    (<HTMLElement>document.getElementById(divId).childNodes.item(ishow)).style.display = "block";
  }
}
