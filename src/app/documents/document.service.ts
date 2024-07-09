import { Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documents: Document[] = [];
  documentListChanged = new Subject<Document[]>();
  maxDocumentId: number;

  constructor(private http: HttpClient) {
    this.fetchDocuments();
    this.maxDocumentId = this.getMaxId();
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

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    this.storeDocuments();
  }

  getMaxId(): number {
    let maxId = 0;

    for (let document of this.documents) {
      let currentId = +document.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  addDocument(newDocument: Document) {
    if (newDocument === undefined || newDocument === null) {
      return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (
      originalDocument === undefined ||
      originalDocument === null ||
      newDocument === undefined ||
      newDocument === null
    ) {
      return;
    }

    let pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    this.storeDocuments();
  }

  fetchDocuments() {
    this.http.get<Document[]>('https://rbs-cms-default-rtdb.firebaseio.com/documents.json')
      .subscribe(
        (documents: Document[]) => {
          this.documents = documents;
          this.maxDocumentId = this.getMaxId();
          this.documents.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          });
          this.documentListChanged.next(this.documents.slice());
        },
        (error: any) => {
          console.error('Error fetching documents:', error);
        }
      );
  }

  storeDocuments() {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.put('https://rbs-cms-default-rtdb.firebaseio.com/documents.json', JSON.stringify(this.documents), { headers })
      .subscribe(
        () => {
          this.documentListChanged.next(this.documents.slice());
        },
        (error: any) => {
          console.error('Error storing documents:', error);
        }
      );
  }
}