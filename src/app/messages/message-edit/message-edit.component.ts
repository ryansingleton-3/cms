import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MessageService } from '../message.service';
import { Message } from '../message.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) messageForm: NgForm;
  message: Message = new Message('', '', '', ''); // Ensure message is initialized
  editMode = false;
  loading = true; // Add loading state
  private paramsSubscription: Subscription;
  private messageSelectedSubscription: Subscription;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      const id = params.id;
      if (!id) {
        this.editMode = false;
        this.loading = false; // Set loading to false when no ID
        return;
      }
      this.messageService.getMessageAsync(id).subscribe(
        (messageData: Message) => {
          this.message = messageData;
          this.editMode = true;
          this.loading = false; // Set loading to false after data is fetched
          this.populateForm(); // Populate the form with fetched message data
        },
        (error) => {
          console.error('Error fetching message:', error);
          this.loading = false; // Set loading to false if there is an error
        }
      );
    });

    this.messageSelectedSubscription = this.messageService.messageSelected.subscribe((message: Message) => {
      this.message = message;
      this.editMode = true;
      window.scrollTo(0, document.body.scrollHeight);
      this.populateForm();
    });
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.messageSelectedSubscription) {
      this.messageSelectedSubscription.unsubscribe();
    }
  }

  populateForm() {
    if (this.messageForm && this.message) {
      this.messageForm.setValue({
        subject: this.message.subject,
        msgText: this.message.msgText
      });
    }
  }

  onSaveMessage() {
    if (this.messageForm.valid) {
      const formValues = this.messageForm.value;
      this.message.subject = formValues.subject;
      this.message.msgText = formValues.msgText;

      if (this.editMode) {
        this.messageService.updateMessage(this.message);
        this.onClear();
      } else {
        this.messageService.addMessage(this.message);
        this.onClear();
      }
      this.router.navigate(['/messages']);
    }
  }

  onClear() {
    this.messageForm.reset();
    this.message = new Message('', '', '', ''); // Reset the message object
    this.editMode = false;
    window.scrollTo(0, 0);
  }
}