import { Component, OnInit, Input } from '@angular/core';
import { Document } from '../../document.model';
import { DocumentService } from '../../document.service';


@Component({
  selector: 'app-document-item',
  templateUrl: './document-item.component.html',
  styleUrl: './document-item.component.css'
})
export class DocumentItemComponent implements OnInit {
  @Input() document: Document;
  

  constructor(private documentService: DocumentService) {

   }

  ngOnInit(): void {
    
  }

  onSelected(){
    this.documentService.documentSelected.emit(this.document);
  }
}
