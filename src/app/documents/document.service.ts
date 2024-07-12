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

    const pos = this.documents.findIndex(d => d.id === document.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete('http://localhost:3000/documents/' + document.id)
      .subscribe(
        (response: Response) => {
          this.documents.splice(pos, 1);
          this.storeDocuments();
        }
      );
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

  addDocument(document: Document) {
    if (!document) {
      return;
    }

    // make sure id of the new Document is empty
    document.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents',
      document,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.documents.push(responseData.document);
          this.storeDocuments();
        }
      );
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }
  
    const pos = this.documents.findIndex(d => d.id === originalDocument.id);
  
    if (pos < 0) {
      return;
    }
  
    // Set the id of the new Document to the id of the old Document
    newDocument.id = originalDocument.id;
  
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
  
    // Update database
    this.http.put('http://localhost:3000/documents/' + originalDocument.id,
      newDocument, { headers: headers })
      .subscribe(
        (response) => {
          console.log('Update response:', response); // Add logging for the response
          this.documents[pos] = newDocument;
          this.storeDocuments();
        },
        (error) => {
          console.error('Error updating document:', error); // Add logging for errors
        }
      );
  }

  fetchDocuments() {
    this.http.get<{ message: string, documents: Document[] }>('http://localhost:3000/documents')
      .subscribe(
        (response) => {
          this.documents = response.documents;
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
    this.documentListChanged.next(this.documents.slice());
    
  }
}