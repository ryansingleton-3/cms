import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Router, ActivatedRoute } from '@angular/router';
import { WindowRefService } from '../../wind-ref.service';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.css'
})
export class ContactDetailComponent implements OnInit{
  contact: Contact;
  nativeWindow: any;

  constructor(private contactService: ContactService,
     private router: Router,
    private route: ActivatedRoute,
    private windowRefService: WindowRefService) { 
      this.nativeWindow = windowRefService.getNativeWindow();
    }

  ngOnInit() {
    this.nativeWindow = this.windowRefService.getNativeWindow();
    this.route.params
      .subscribe(
        (params) => {
          this.contact = this.contactService.getContact(params['id']);
        }
      );
  }

  onDelete() {
    this.contactService.deleteContact(this.contact);
    this.router.navigate(['/contacts']);
 }
   
}
