import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {

  originalContact: Contact;
  contact: Contact;
  editMode: boolean = false;
  groupContacts: Contact[] = [];

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(
      (params) => {
        let id = params['id'];
        if (!id) {
          this.editMode = false;
          return;
        }
        this.originalContact = this.contactService.getContact(id);
        if (!this.originalContact) {
          return;
        }
        this.editMode = true;
        this.contact = JSON.parse(JSON.stringify(this.originalContact));
      }
    );
  }

  onSubmit(form: NgForm) {
    let value = form.value;
    let newContact = new Contact('', value.name, value.email, value.phone, value.imageUrl, null);
    if (this.editMode) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }
    this.router.navigate(['/contacts']);
  }

  onCancel() {
    this.router.navigate(['/contacts']);
  }

  onDrop(event: CdkDragDrop<Contact[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.groupContacts, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  removeContact(index: number) {
    if(index < 0 || index >= this.groupContacts.length) {
      return;
    }
    this.groupContacts.splice(index, 1);
  }
}