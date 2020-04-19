import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase/app';

import { ChatMessage } from '../models/chat.message';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  user: firebase.User;
  itemsRef: AngularFireList<any>;
  chatMessages: Observable<any[]>;
  chatMessage: ChatMessage;
  userName: Observable<string>;

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
    ) {
        this.afAuth.authState.subscribe(auth => {
          if (auth !== undefined && auth !== null) {
            this.user = auth;
          }

          this.getUser().subscribe(a => {
            this.userName = (a as any).displayName;
          });
        });

        this.itemsRef = db.list('messages', ref => {
          return ref.limitToLast(25).orderByKey();
        });


    }

  getUser() {
    const userId = this.user.uid;
    const path = `/users/${userId}`;
    return this.db.object(path).valueChanges();
  }

  getUsers() {
    const path = '/users';
    return this.db.list(path).valueChanges();
  }

  sendMessage(msg: string) {
    const timestamp = this.getTimeStamp();
    const email = this.user.email;
    // const email = 'test@example.com';
   // this.chatMessages = this.getMessages();
    this.itemsRef.push({
      message: msg,
      timeSent: timestamp,
      userName: this.userName,
      // userName:"test-user",
      email: email });
  }

  // getMessages(): FirebaseListObservable<ChatMessage[]> {
  //   // query to create our message feed binding
  //   return this.db.list('messages', {
  //     query: {
  //       limitToLast: 25,
  //       orderByKey: true
  //     }
  //   });
  // }

  getMessages():  AngularFireList<any> {
   return  this.itemsRef;
  }

  getTimeStamp() {
    const now = new Date();
    const date = now.getUTCFullYear() + '/' +
                 (now.getUTCMonth() + 1) + '/' +
                 now.getUTCDate();
    const time = now.getUTCHours() + ':' +
                 now.getUTCMinutes() + ':' +
                 now.getUTCSeconds();

    return (date + ' ' + time);
  }
}
