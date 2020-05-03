import { Component, OnInit, Injector } from '@angular/core';
import { API } from 'aws-amplify';

@Component({
  selector: 'app-journeys',
  templateUrl: './journeys.component.html',
  styleUrls: ['./journeys.component.css']
})
export class JourneysComponent implements OnInit {

  constructor(injector: Injector) { }

  ngOnInit() {
    // API
    //   .get("apicef3c0a9", "/journeys", {})
    //   .then(response => {
    //     // Add your code here
    //     console.log("something happened");
    //     console.log(response.data);
    //   })
    //   .catch(error => {
    //     console.log(error.response);
    // });
  }

}
