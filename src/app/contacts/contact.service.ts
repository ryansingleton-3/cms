import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
    for (let contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
    return null;
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    this.storeContacts();
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

  addContact(newContact: Contact) {
    if (newContact === undefined || newContact === null) {
      return;
    }

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.http.post<{message: string}>('http://localhost:3000/api/contacts', newContact)
    .subscribe(
      (responseData) => {
        console.log(responseData.message)
        console.log(newContact);
        this.contacts.push(newContact);
        this.storeContacts();
      }
    );
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (
      originalContact === undefined ||
      originalContact === null ||
      newContact === undefined ||
      newContact === null
    ) {
      return;
    }

    let pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.storeContacts();
  }

  fetchContacts() {
    this.http.get<Contact[]>('http://localhost:3000/api/contacts')
      .subscribe(
        (contacts: Contact[]) => {
          this.contacts = contacts;
          console.log('contacts fetched successfully');
          console.log(contacts);
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
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.put('https://rbs-cms-default-rtdb.firebaseio.com/contacts.json', JSON.stringify(this.contacts), { headers })
      .subscribe(
        () => {
          this.contactListChanged.next(this.contacts.slice());
        },
        (error: any) => {
          console.error('Error storing contacts:', error);
        }
      );
  }
}