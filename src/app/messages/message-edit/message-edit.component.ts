import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';
import { ElementRef, ViewChild } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  @ViewChild('subjectInput', { static: false }) subjectInputRef: ElementRef;
  @ViewChild('textInput', { static: false }) textInputRef: ElementRef;

  constructor(private messageService: MessageService) {}

  ngOnInit() {}

  onSendMessage() {
    const subject = this.subjectInputRef.nativeElement.value;
    const text = this.textInputRef.nativeElement.value;
    let id = (Math.floor(Math.random() * 100) + 1).toString();
    const newMessage = new Message(id, subject, text, '1');
    this.messageService.addMessage(newMessage);
  }
}