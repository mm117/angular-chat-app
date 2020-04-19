import { Component, OnInit, OnChanges } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Observable } from 'rxjs';
import { ChatMessage } from '../models/chat.message';


@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, OnChanges {
  feed: Observable<any[]>;

  constructor(private chat: ChatService) { }

  ngOnInit() {
    console.log("on init");
    this.feed = this.chat.getMessages().valueChanges();
  }

  ngOnChanges() {
    console.log("on changes");
    this.feed = this.chat.getMessages().valueChanges();
  }

}
