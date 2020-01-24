import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Folder } from 'src/app/models/folder';
import { User } from 'src/app/models/User';
import { Note } from 'src/app/models/note';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  folders: Folder[] = null
  notes: Note[] = null
  user: any = JSON.parse(localStorage.getItem('user'))
  constructor(
    public as: AuthService,
    public afs: AngularFirestore,
    public afa: AngularFireAuth
    ) {  }

  ngOnInit() {
    //getting folders 
    this.getFolders().subscribe((data)=>{
      let folders = data.map((e)=>{
        return {
          uid: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Folder;
      })
      this.folders = folders
    })
    
    //getting notes
     this.getNotes().subscribe((data)=>{
       this.folders = data.map((e)=>{
         return {
           uid: e.payload.doc.id,
           ...e.payload.doc.data()
         } as Note
       })
     }).unsubscribe()
  }

  getFolders(){
    //let path: string = 'users/' + this.user.uid + '/folders'
    return this.afs.collection('users').doc(this.user.uid).collection('folders').snapshotChanges()
  }

  getNotes(){
    let path: string = 'users/' + this.user.uid + '/folders/' + 'nxSWOwsoD6HmfOPY2G3J' + '/notes'
    return this.afs.collection(path).snapshotChanges()
  }

  logOut(){
    this.as.logout()
  }

}
