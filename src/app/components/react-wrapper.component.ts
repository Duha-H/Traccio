import {
	Component,
	Input,
	OnInit,
	OnDestroy,
	OnChanges,
	AfterViewInit,
} from "@angular/core";
import * as uuid from "uuid";
import * as invariant from "invariant";

@Component({
  selector: 'react-wrapper',
  template: '',
})
export class ReactWrapper implements OnInit, OnDestroy, OnChanges, AfterViewInit {
	// source: https://sdk.gooddata.com/gooddata-ui/docs/4.1.1/ht_use_react_component_in_angular_2.x.html

  public rootDomID: string;

	ngOnInit() {
    this.rootDomID = uuid.v1();
  }

  ngOnChanges() {
    this.render();
  }

  ngAfterViewInit() {
    // this.rootDomID = uuid.v1();
    this.render();
  }

  ngOnDestroy() {
    // Uncomment if Angular 4 issue that ngOnDestroy is called AFTER DOM node removal is resolved
    // ReactDOM.unmountComponentAtNode(this.getRootDomNode())
	}

	protected render() { }

  protected getRootDomNode() {
    const node = document.getElementById(this.rootDomID);
    invariant(node, `Node '${this.rootDomID} not found!`);
    return node;
  }

}