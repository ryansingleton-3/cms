import { Component} from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent {

  documents: Document[] = [];

  constructor(private documentService: DocumentService) {

  }

  onDocumentSelected(document: Document) {
    this.documentService.documentSelected.emit(document);
  }

  ngOnInit() {
    this.documents = this.documentService.getDocuments();
  }
}