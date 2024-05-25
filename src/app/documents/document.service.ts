import {Injectable} from '@angular/core';
import {Document} from './document.model';
import {MOCKDOCUMENTS} from './MOCKDOCUMENTS';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
   documents: Document [] =[];
   constructor() {
      this.documents = MOCKDOCUMENTS;
   }

   documentSelected = new EventEmitter<Document>();

   getDocuments(): Document[] {
      return this.documents.slice();
    }

    getDocument(id: string): Document {
      for (let document of this.documents) {
         if (document.id === id) {
            return document;
         }
      }
      return null;
   }


}