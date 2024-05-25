import {Injectable} from '@angular/core';
import {Message} from './message.model';
import {MOCKMESSAGES} from './MOCKMESSAGES';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
   messages: Message [] =[];
   constructor() {
      this.messages = MOCKMESSAGES;
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
      this.messages.push(message);
      this.messageChangedEvent.emit(this.messages.slice());
   }


}