import { Component, Output, EventEmitter } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent {
  @Output() documentWasSelected = new EventEmitter<Document>();

  documents: Document[] = [
    new Document(1, 'Document 1', 'This is document 1', 'http://example.com/1', []),
    new Document(2, 'Document 2', 'This is document 2', 'http://example.com/2', []),
    new Document(3, 'Document 3', 'This is document 3', 'http://example.com/3', []),
    new Document(4, 'Document 4', 'This is document 4', 'http://example.com/4', []),
    new Document(5, 'Document 5', 'This is document 5', 'http://example.com/5', []),
  ];

  onDocumentSelected(document: Document) {
    this.documentWasSelected.emit(document);
  }
}