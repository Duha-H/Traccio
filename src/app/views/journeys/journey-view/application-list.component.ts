import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  OnChanges,
} from "@angular/core";
import { Application } from 'src/app/models/application';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { UserStoreService } from 'src/app/models/user-store.service';
import { AppFilterPipe } from 'src/app/views/dashboard/app-filter.pipe';
import { MatSort } from '@angular/material/sort';
import { ResizeService } from 'src/app/controllers/resize.service';

@Component({
  selector: "application-list",
  templateUrl: "./application-list.component.html",
  styleUrls: ["./journey-view.component.css"],
})
export class ApplicationListComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @Input() journeyid = '';
  @Output() deleteButtonPress = new EventEmitter();
  @Output() applicationClick = new EventEmitter<object>();
  applications: Application[] = [];
  deleteButtonPressed = false;
  dataSource = new MatTableDataSource<Application>(this.applications);
  displayedColumnsDefault = [
    "select",
    "positionTitle",
    "companyName",
    "appDate",
    "source",
    "status",
    "remove",
  ];
  displayedColumnsMobile = [
    "select",
    "positionTitle",
    "appDate",
    "status",
    "remove",
  ];
  selection = new SelectionModel<Application>(true, []);
  filterObjects = {
    status: [],
    source: []
  };

  constructor(
    private userStore: UserStoreService,
    private filterPipe: AppFilterPipe,
    public rs: ResizeService,
  ) { }

  ngOnInit() {
    if (this.journeyid !== undefined) {
      this.applications = this.userStore.getJourney(this.journeyid).applications;
      this.dataSource.data = this.applications;
      this.dataSource.sort = this.sort;
      this.updateView();
    } else {
      console.error("Journey ID not specified"); // this should not happen
    }
  }

  updateView() {
    this.applications = this.userStore.getJourney(this.journeyid).applications;
    this.dataSource.data = this.filterObjects.source.length !== 0 || this.filterObjects.status.length !== 0
      ? this._getFilteredData() // if any filters are selected, apply those
      : this.applications;
  }

  onApplicationClick(application: Application) {
    if (this.deleteButtonPressed) {
      this.deleteButtonPressed = false;
      return;
    }
    this.applicationClick.emit(application);
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  checkboxLabel(app?: Application): string {
    if (!app) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${this.selection.isSelected(app) ? "deselect" : "select"} row ${
      app.positionTitle
    }`;
  }

  removeApplications(apps: Application[]) {
    const prompt = apps.length > 1
      ? 'all selected applications'
      : `your application for ${apps[0].positionTitle} at ${apps[0].companyName}`;
    this.deleteButtonPressed = true;
    if (confirm(`Are you sure you'd like to remove ${prompt}?`)) {
      apps.forEach((app) => {
        this.userStore.removeApplication(this.journeyid, app.id);
      });
      this.selection.deselect(...apps);
      // Update current journey details and view
      this.updateView();
    }
  }

  applyFilters(updatedFilters: {
    status: any[],
    source: any[]
  }) {
    this.filterObjects = updatedFilters;
    this.updateView();
  }

  private _getFilteredData(): Application[] {
    // applies filters to applications using pipe
    return this.filterPipe.transform(this.applications, [
      {
        property: "status",
        value: this.filterObjects.status.join(""),
      },
      {
        property: "source",
        value: this.filterObjects.source.join(""),
      },
    ]);
  }

}
