import { Component, Input, OnInit } from "@angular/core";
import { FAQItem, faqs, SECTIONED_FAQS } from 'src/app/shared-components/faqs/faq';
import { SafeHTMLPipe } from 'src/app/utils/safe-html.pipe';
import { ValuesPipe } from 'src/app/utils/values.pipe';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
})
export class FAQComponent implements OnInit {

  @Input() rootUrl = '/home/info';
  @Input() tag: string;

  faqItems: FAQItem[] = faqs;
  faqSections = SECTIONED_FAQS;

  constructor(
    public safeHTML: SafeHTMLPipe,
    public values: ValuesPipe,
  ) { }

  ngOnInit() { }

}
