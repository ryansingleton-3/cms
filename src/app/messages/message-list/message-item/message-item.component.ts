import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContactService } from '../../../contacts/contact.service';
import { Message } from '../../message.model';
import { Contact } from '../../../contacts/contact.model';
import { MessageService } from '../../message.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css'],
})
export class MessageItemComponent implements OnInit, OnDestroy {
  @Input() message: Message;
  messageSender: string = 'Unknown sender';
  private contactSubscription: Subscription;

  constructor(
    private contactService: ContactService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadMessageSender();
    this.contactSubscription = this.contactService.contactListChanged.subscribe(
      () => {
        this.loadMessageSender();
      }
    );
  }

  ngOnDestroy() {
    if (this.contactSubscription) {
      this.contactSubscription.unsubscribe();
    }
  }

  onEdit() {
    this.onSelected();
    this.router.navigate([this.message.id, 'edit'], { relativeTo: this.route });
    window.scrollTo(0, document.body.scrollHeight);
  }

  onDelete() {
    this.messageService.deleteMessage(this.message);
    this.router.navigate(['/messages']);
  }

  onSelected() {
    this.messageService.selectMessage(this.message);
  }

  private loadMessageSender() {
    if (this.message) {
      const contact = this.contactService.getContact(this.message.sender);
      if (contact) {
        this.messageSender = contact.name;
      } else {
        this.contactService.getContactAsync(this.message.sender).subscribe(
          (contact: Contact) => {
            this.messageSender = contact ? contact.name : 'Unknown sender';
          },
          () => {
            this.messageSender = 'Unknown sender';
          }
        );
      }
    }
  }
}