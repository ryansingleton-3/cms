import { Injectable } from '@angular/core';
import { Message } from './message.model';
import { EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: Message[] = [];
  maxMessageId: number;
  messageListChanged = new Subject<Message[]>();

  constructor(private http: HttpClient) {
    console.log("MessageService constructor called");
    this.fetchMessages();
  }

  messageSelected = new EventEmitter<Message>();
  messageChangedEvent = new EventEmitter<Message[]>();

  getMessages(): Message[] {
    return this.messages.slice();
  }

  getMessage(id: string): Message {
    for (let message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }
    return null;
  }

  addMessage(message: Message) {
    console.log("Adding message:", message);
    this.messages.push(message);
    this.messageChangedEvent.emit(this.messages.slice());
    this.storeMessages();
  }

  getMaxId(): number {
    let maxId = 0;

    if (!this.messages || this.messages.length === 0) {
      return maxId;
    }

    for (let message of this.messages) {
      if (message && message.id) {
        let currentId = +message.id;
        if (currentId > maxId) {
          maxId = currentId;
        }
      }
    }

    return maxId;
  }

  fetchMessages() {
    console.log("Fetching messages from server");
    this.http
      .get<Message[]>(
        'https://rbs-cms-default-rtdb.firebaseio.com/messages.json'
      )
      .subscribe(
        (messages: Message[]) => {
          console.log("Messages fetched:", messages);
          if (messages) {
            this.messages = messages.filter(msg => msg && msg.id !== null && msg.id !== undefined); // Filter out invalid messages
            this.maxMessageId = this.getMaxId();
            this.messages.sort((a, b) => {
              if (a.id < b.id) return -1;
              if (a.id > b.id) return 1;
              return 0;
            });
            this.messageListChanged.next(this.messages.slice());
          } else {
            console.warn("No messages found on the server");
          }
        },
        (error: any) => {
          console.error('Error fetching messages:', error);
        }
      );
  }

  storeMessages() {
    console.log("Storing messages to server");
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .put(
        'https://rbs-cms-default-rtdb.firebaseio.com/messages.json',
        JSON.stringify(this.messages),
        { headers }
      )
      .subscribe(
        () => {
          console.log("Messages successfully stored");
          this.messageListChanged.next(this.messages.slice());
        },
        (error: any) => {
          console.error('Error storing messages:', error);
        }
      );
  }
}