import { Component} from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']  
})
export class MessageListComponent implements OnInit{
  messages: Message[] = [];
  selectedMessage: Message;

  constructor(private messageService: MessageService) {}


  ngOnInit() {
    this.messageService.messageSelected.subscribe((message: Message) => {
      this.selectedMessage = message;
    });
    this.messages = this.messageService.getMessages();
    this.messageService.messageListChanged
      .subscribe(
        (messages: Message[]) => {
          this.messages = messages;
        }
      );
  }
}
