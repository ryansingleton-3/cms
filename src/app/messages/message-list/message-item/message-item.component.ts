import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContactService } from '../../../contacts/contact.service';
import { Message } from '../../message.model';
import { Contact } from '../../../contacts/contact.model';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit, OnDestroy {
  @Input() message: Message;
  messageSender: string;
  private contactSubscription: Subscription;

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.loadMessageSender();
    this.contactSubscription = this.contactService.contactListChanged.subscribe(() => {
      this.loadMessageSender();
    });
  }

  ngOnDestroy() {
    if (this.contactSubscription) {
      this.contactSubscription.unsubscribe();
    }
  }

  private loadMessageSender() {
    if (this.message && this.message.sender) {
      const contact: Contact = this.contactService.getContact(this.message.sender);
      if (contact) {
        this.messageSender = contact.name;
      } else {
        this.messageSender = 'Unknown sender';
      }
    } else {
      this.messageSender = 'Unknown sender';
    }
  }
}