import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactsComponent } from './contacts/contacts.component';
import { ContactDetailComponent } from './contacts/contact-detail/contact-detail.component';
import { ContactEditComponent } from './contacts/contact-edit/contact-edit.component';

import { MessagesComponent } from './messages/messages.component';
import { MessageListComponent } from './messages/message-list/message-list.component';
import { MessageEditComponent } from './messages/message-edit/message-edit.component';

import { DocumentsComponent } from './documents/documents.component';
import { DocumentListComponent } from './documents/document-list/document-list.component';
import { DocumentDetailComponent } from './documents/document-detail/document-detail.component';
import { DocumentEditComponent } from './documents/document-edit/document-edit.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/contacts', pathMatch: 'full' },
  {
    path: 'contacts', component: ContactsComponent, children: [
      { path: 'new', component: ContactEditComponent },
      { path: ':id', component: ContactDetailComponent },
      { path: ':id/edit', component: ContactEditComponent },
    ]
  },
  {
    path: 'documents', component: DocumentsComponent, children: [
      { path: 'new', component: DocumentEditComponent },
      { path: ':id', component: DocumentDetailComponent },
      { path: ':id/edit', component: DocumentEditComponent },
    ]
  },
  {
    path: 'messages', component: MessagesComponent, children: [
      { path: '', component: MessageListComponent },
      { path: ':id/edit', component: MessageEditComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }