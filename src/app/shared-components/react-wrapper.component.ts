import {
	Component,
	Input,
	OnInit,
	OnDestroy,
	OnChanges,
	AfterViewInit,
  SimpleChanges,
} from "@angular/core";
import * as uuid from "uuid";
import * as invariant from "invariant";

@Component({
  selector: 'react-wrapper',
  template: '',
})
export class ReactWrapper implements OnInit, OnChanges, AfterViewInit {
	// source: https://sdk.gooddata.com/gooddata-ui/docs/4.1.1/ht_use_react_component_in_angular_2.x.html

  public rootDomID: string;

	ngOnInit() {
    this.rootDomID = uuid.v1();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const prop of Object.keys(changes)) {
      const prevValue = JSON.stringify(changes[prop].previousValue);
      const currValue = JSON.stringify(changes[prop].currentValue);
      if (prevValue !== currValue) { // restricting re-render call to only when previous prop value is not equal to current
        this.render();
        break;
      }
    }
  }

  ngAfterViewInit() {
    // this.rootDomID = uuid.v1();
    this.render();
  }

	protected render() { }

  protected getRootDomNode() {
    const node = document.getElementById(this.rootDomID);
    invariant(node, `Node '${this.rootDomID} not found!`);
    return node;
  }

}