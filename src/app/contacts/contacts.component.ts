import { Component } from '@angular/core';
import { Contact } from './contact.model';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
})
export class ContactsComponent {
  

  selectedContact = Contact;

  constructor() {}
}
