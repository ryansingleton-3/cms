import { Component } from '@angular/core';
import { Contact } from './contact.model';
import { ContactService } from './contact.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  providers: [ContactService],
})
export class ContactsComponent {
  selectedContact: Contact;

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.contactService.contactSelected.subscribe((contact: Contact) => {
      this.selectedContact = contact;
    });
  }
}
