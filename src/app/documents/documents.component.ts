import { Component } from '@angular/core';
import { Document } from './document.model';
import { DocumentService } from './document.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  providers: [DocumentService]
})
export class DocumentsComponent {
  

  selectedDocument: Document;

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    this.documentService.documentSelected
      .subscribe(
        (document: Document) => {
          this.selectedDocument = document;
        }
      );
  }
}
