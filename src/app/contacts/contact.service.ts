import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { EventEmitter } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contacts: Contact[] = [];
  contactListChanged = new Subject<Contact[]>();
  maxContactId: number = 0;

  constructor(private http: HttpClient) {
    this.fetchContacts();
  }

  contactSelected = new EventEmitter<Contact>();

  getContacts(): Contact[] {
    return this.contacts.slice();
  }

  getContact(id: string): Contact {
    return this.contacts.find(contact => contact.id === id);
  }

  getContactAsync(id: string) {
    return this.http.get<Contact>(`http://localhost:3000/contacts/${id}`);
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    this.http
      .delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe((response: Response) => {
        const updatedContacts = this.contacts.filter((contactEl) => {
          return contactEl.id !== contact.id;
        });
        this.contacts = updatedContacts;
        this.storeContacts();
      });
  }

  getMaxId(): number {
    if (!Array.isArray(this.contacts)) {
      return 0;
    }

    let maxId = 0;
    for (let contact of this.contacts) {
      let currentId = +contact.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addContact(contact: Contact) {
    if (!contact) {
      return;
    }

    // make sure id of the new Contact is empty
    contact.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, contact: Contact }>('http://localhost:3000/contacts',
      contact,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new contact to contacts
          this.contacts.push(responseData.contact);
          this.storeContacts();
        }
      );
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }
  
    const pos = this.contacts.findIndex(d => d.id === originalContact.id);
  
    if (pos < 0) {
      return;
    }
  
    // Set the id of the new Contact to the id of the old Contact
    newContact.id = originalContact.id;
  
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
  
    // Update database
    this.http.put('http://localhost:3000/contacts/' + originalContact.id,
      newContact, { headers: headers })
      .subscribe(
        (response) => {
          this.contacts[pos] = newContact;
          this.storeContacts();
        },
        (error) => {
          console.error('Error updating contact:', error); // Add logging for errors
        }
      );
  }

  fetchContacts() {
    this.http
      .get<{ message: string; contacts: Contact[] }>(
        'http://localhost:3000/contacts'
      )
      .subscribe(
        (response) => {
          this.contacts = response.contacts;
          this.maxContactId = this.getMaxId();
          this.contacts.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          });
          this.contactListChanged.next(this.contacts.slice());
        },
        (error: any) => {
          console.error('Error fetching contacts:', error);
        }
      );
  }

  storeContacts() {
    this.contactListChanged.next(this.contacts.slice());
  }
}
