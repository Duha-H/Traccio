import { Component, Input, OnInit } from "@angular/core";
import { FAQItem, faqs } from 'src/app/shared-components/faqs/faq';
import { SafeHTMLPipe } from 'src/app/utils/safe-html.pipe';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
})
export class FAQComponent implements OnInit {

  @Input() rootUrl = '/home/info';

  faqItems: FAQItem[] = faqs;

  constructor(
    public safeHTML: SafeHTMLPipe,
  ) { }

  ngOnInit() { }

}
