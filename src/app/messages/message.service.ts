import { Injectable } from '@angular/core';
import { Message } from './message.model';
import { EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ContactService } from '../contacts/contact.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: Message[] = [];
  maxMessageId: number;
  messageListChanged = new Subject<Message[]>();

  constructor(
    private http: HttpClient,
    private contactService: ContactService
  ) {
    this.contactService.contactListChanged.subscribe(() => {
      this.fetchMessages();
    });
  }

  messageSelected = new EventEmitter<Message>();
  messageChangedEvent = new EventEmitter<Message[]>();

  selectMessage(message: Message) {
    this.messageSelected.emit(message);
  }

  getMessages(): Message[] {
    return this.messages.slice();
  }

  getMessage(id: string): Message {
    return this.messages.find((message) => message.id === id);
  }

  getMessageAsync(id: string): Observable<Message> {
    return this.http.get<Message>(`http://localhost:3000/messages/${id}`);
  }

  addMessage(message: Message) {
    if (!message) {
      return;
    }
    message.sender = '101';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{ message: string; response: Message }>(
        'http://localhost:3000/messages',
        message,
        { headers: headers }
      )
      .subscribe(
        (responseData) => {
          // add new message to messages
          this.messages.push(responseData.response);
          this.storeMessages();
          this.messageChangedEvent.emit(this.messages.slice());
        },
        (error) => {
          console.error('Error adding message:', error);
        }
      );
  }

  updateMessage(message: Message) {
    if (!message) {
      return;
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .put<{ message: string; response: Message }>(
        'http://localhost:3000/messages/' + message.id,
        message,
        { headers: headers }
      )
      .subscribe(
        (responseData) => {
          const pos = this.messages.findIndex((m) => m.id === message.id);
          if (pos >= 0) {
            this.messages[pos] = responseData.response;
            this.storeMessages();
            this.messageChangedEvent.emit(this.messages.slice());
          }
        },
        (error) => {
          console.error('Error updating message:', error);
        }
      );
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

  deleteMessage(message: Message) {
    if (!message) {
      return;
    }

    const pos = this.messages.findIndex((m) => m.id === message.id);
    if (pos < 0) {
      return;
    }

    this.http.delete('http://localhost:3000/messages/' + message.id).subscribe(
      (response: Response) => {
        this.messages.splice(pos, 1);
        this.storeMessages();
        this.messageChangedEvent.emit(this.messages.slice());
      },
      (error) => {
        console.error('Error deleting message:', error);
      }
    );
  }

  fetchMessages() {
    this.http
      .get<{ message: string; messages: Message[] }>(
        'http://localhost:3000/messages'
      )
      .subscribe(
        (response) => {
          if (response.messages) {
            this.messages = response.messages.filter(
              (msg) => msg && msg.id !== null && msg.id !== undefined
            ); // Filter out invalid messages
            this.maxMessageId = this.getMaxId();
            this.messages.sort((a, b) => {
              if (a.id < b.id) return -1;
              if (a.id > b.id) return 1;
              return 0;
            });
            this.messageListChanged.next(this.messages.slice());
          } else {
            console.warn('No messages found on the server');
          }
        },
        (error: any) => {
          console.error('Error fetching messages:', error);
        }
      );
  }

  storeMessages() {
    this.messageListChanged.next(this.messages.slice());
  }
}
