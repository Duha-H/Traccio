import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from "@angular/core";
import { UserStoreService } from "src/app/models/user-store.service";
import * as mockData from "src/app/models/data";
import { Journey } from "src/app/models/journey";
import { STATUS } from "src/app/models/constants";
import { Application } from 'src/app/models/application';
import { Router } from '@angular/router';
import { PreferencesStoreService } from 'src/app/controllers/preferences-store.service';
import { PALETTES, THEMES } from 'src/styling/palettes';
import { ResizeService } from 'src/app/controllers/resize.service';
import { FormattedFrequencyData, WEEKDAYS, MONTHS } from 'src/app/controllers/types';
import { ArrayFilterPipe } from 'src/app/utils/array-filter.pipe';
import { Subscription } from 'rxjs';
import { ArrayFormatterPipe } from 'src/app/utils/array-formatter.pipe';
import { DatumValue } from '@nivo/line';
import { PieDatum } from '@nivo/pie';
import { LoaderService } from 'src/app/controllers/loader.service';
import { map } from 'rxjs/internal/operators/map';
import { Title } from '@angular/platform-browser';
import html2canvas from 'html2canvas';
import { MESSAGES } from 'src/assets/template-messages';
import { NotificationService } from "src/app/controllers/notification.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  name = "";
  greeting = "";
  pieChartData = mockData.pieChartData;
  activeJourneys: Journey[];
  selectedJourney: JourneyDropdownItem;
  dropdownContent: JourneyDropdownItem[] = [];
  currentYear: string = new Date().getFullYear().toString();
  from: string;
  to: string;
  statuses = [
    {value: '', viewValue: 'All Statuses'},
    {value: STATUS.IN_REVIEW.toString(), viewValue: STATUS.IN_REVIEW.toString()},
    {value: STATUS.ASSESSMENT.toString(), viewValue: STATUS.ASSESSMENT.toString()},
    {value: STATUS.INTERVIEW.toString(), viewValue: STATUS.INTERVIEW.toString()},
    {value: STATUS.OFFER.toString(), viewValue: STATUS.OFFER.toString()},
    {value: STATUS.REJECTED.toString(), viewValue: STATUS.REJECTED.toString()},
    {value: STATUS.STALE.toString(), viewValue: STATUS.STALE.toString()}
  ];
  selectedStatus = this.statuses[0];
  theme = THEMES.light;
  pieChartPalette = ['#AC98FB', '#6E89F8', '#81BEFA', '#C1E0F8', '#D1C3EB'];
  calendarPalette = ['#AC98FB', '#6E89F8', '#81BEFA', '#C1E0F8', '#D1C3EB'];
  lineChartMode: 'week' | 'month' | 'year' = 'week';
  journeySub: Subscription;
  prefSub: Subscription;
  displayDownloadOverlay = false;
  downloadImgSrc: string | HTMLCanvasElement = '';
  downloadName = '';

  downloadImg: HTMLImageElement;
  @ViewChild('downloadImg') set imgRef(ref: HTMLImageElement) {
    if (ref) {
      this.downloadImg = ref;
    }
  }

  constructor(
    public userStore: UserStoreService,
    public router: Router,
    private prefStore: PreferencesStoreService,
    public resizeService: ResizeService,
    private arrayFilter: ArrayFilterPipe,
    private arrayFormatter: ArrayFormatterPipe,
    public loaderService: LoaderService,
    private titleService: Title,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Dashboard | Traccio');
    this.greeting = `${MESSAGES.greetings[Math.floor(Math.random() * Object.keys(MESSAGES.greetings).length)]}`;
    try {
      this.journeySub = this.userStore._journeys.pipe(map(journey => Object.values(journey))).subscribe(journeys => {
        this.activeJourneys = journeys.filter(journey => journey.active);
        this.setDropdownContent();
        const journeyID = sessionStorage.getItem('dashboardJourney');
        let currSelection = this.dropdownContent.filter(entry => entry.value.id === journeyID)[0];
        if (!currSelection && this.dropdownContent[0]) { // no ID stored in local storage, or journey was removed
          currSelection = this.dropdownContent[0];
        }

        if (currSelection) {
          this.onJourneySelect(currSelection);
          this._setLineChartAxes(this.selectedJourney.frequencyData);
        }

      });
      this.prefSub = this.prefStore.preferences.subscribe(preferences => {
        this.theme = preferences.theme;
        this.pieChartPalette = preferences.colorPalette.colors;
        this.calendarPalette = preferences.colorPalette.colors;
      });
    } catch (error) {
      this.name = '';
      this.activeJourneys = [];
    }
  }

  ngOnDestroy() {
    this.journeySub.unsubscribe();
    this.prefSub.unsubscribe();
  }

  setDropdownContent() {
    const newContent: JourneyDropdownItem[] = [];
    this.activeJourneys.forEach((journey) => {
      const journeyData = this.userStore.getCalendarData(journey.id);
      const journeyStatusData = this.userStore.getStatusData(journey.id);
      const frequencyData = this.userStore.getFrequencyData(journey.id);
      newContent.push({
        value: journey,
        viewValue: journey.title,
        calendarData: journeyData,
        years: this._setCalendarYears(journeyData),
        statusData: journeyStatusData,
        frequency: this._getApplicationFrequency(journey.startDate, journey.applications.length),
        frequencyData,
        frequencyAxes: this._setLineChartAxes(frequencyData)
      });
    });
    this.dropdownContent = newContent;
  }

  onJourneySelect(selection?: JourneyDropdownItem) {
    if (selection) {
      this.selectedJourney = selection;
    }
    this.currentYear = this.selectedJourney.years[0]
      ? this.selectedJourney.years[this.selectedJourney.years.length - 1]
      : new Date().getUTCFullYear().toString();
    sessionStorage.setItem('dashboardJourney', this.selectedJourney.value.id);
  }

  selectYear(year: string) {
    this.currentYear = year ? year : new Date().getUTCFullYear().toString();
  }

  selectApplication(app: Application) {
    this.router.navigate(['/home/journeys', this.selectedJourney.value.id, app.id]);
  }

  isEmpty(obj: {[key: string]: any}) {
    return (obj && Object.keys(obj).length === 0);
  }

  toggleLineChartMode() {
    switch (this.lineChartMode) {
      case 'week':
        this.lineChartMode = 'month';
        break;
      case 'month':
        this.lineChartMode = 'year';
        break;
      case 'year':
        this.lineChartMode = 'week';
        break;
      default:
        break;
    }
  }

  setCustomTooltip(value?: DatumValue): string {
    return value ? value.toString() : '';
  }

  selectPieSlice(slice?: PieDatum, event?: any) {
    const container = document.querySelector('#appListContainer');
    const selector = document.querySelector('#statusSelect');
    if (slice) {
      this.selectedStatus = this.statuses.filter(entry => {
        return entry.value === slice.id;
      })[0];
      container.scrollIntoView({behavior: "smooth", block: "end", inline: "center"});
      selector.classList.add('pulse');
      setTimeout(() => {
        selector.classList.remove('pulse');
      }, 700);
    }
  }

  navigateToAddJourney() {
    this.router.navigate(['/home/journeys', { displayDrawer: true }]);
  }

  saveAsImg(element: HTMLElement, downloadName: string) {
    this.displayDownloadOverlay = true;
    html2canvas(element, {
      backgroundColor: null,
    }).then(canvas => {
        const imgUrl = canvas.toDataURL('image/png');
        this.downloadImgSrc = imgUrl;
        this.downloadName = downloadName;
      }).catch(error => {
        this.notificationService.sendNotification('Error downloading image, please try again.', 'error');
      });
  }

  hideImgOverlay() {
    this.displayDownloadOverlay = false;
    this.downloadImgSrc = '';
  }

  private _setLineChartAxes(frequencyData: FormattedFrequencyData): {
    week: AxisValues,
    month: AxisValues,
    year: AxisValues
  } {
    const weekXVals = frequencyData.week[0].data.map(value => value.x);
    const weekYVals = frequencyData.week[0].data.map(value => value.y);

    const monthXVals = frequencyData.month[0].data.reduce((accumulator, currentValue, index) => {
      if (index % 2 !== 0) {
        accumulator.push(currentValue.x);
      }
      return accumulator;
    }, []);
    const monthYVals = frequencyData.month[0].data.map(value => value.y);

    const yearXVals = frequencyData.year[0].data.map(value => value.x);
    const yearYVals = frequencyData.year[0].data.map(value => value.y);

    return {
      week: { x: weekXVals, y: weekYVals },
      month: { x: monthXVals, y: monthYVals },
      year: { x: yearXVals, y: yearYVals },
    };
  }

  private _setCalendarYears(data: { day: string; value: number }[]): string[] {
    const years = [];
    data.sort((a, b) => {
      return a.day > b.day ? 1 : -1;
    });
    if (data.length === 0) {
      return years;
    }
    // okay, we can't be parsing a date string because that creates unpredictable messes
    // so we're gonna use the date string to create a new Date object, then extract the year from that
    const startYear = new Date(data[0].day).getUTCFullYear(); // extract year as a number
    const endYear = new Date(data[data.length - 1].day).getUTCFullYear();
    for (let i = startYear; i <= endYear; i++) {
      years.push(i);
    }
    return years;
  }

  private _getApplicationFrequency(startDate: Date, count: number): string {
    let daysElapsed = (new Date()).getTime() - startDate.getTime(); // returns difference in milliseconds
    daysElapsed = Math.floor(daysElapsed / (1000 * 3600 * 24)); // convert
    const result = daysElapsed === 0
      ? count.toFixed(2)  // if no days have passed, frequency is number of apps submitted today
      : (count / daysElapsed).toFixed(2);
    return result;
  }
}

export interface JourneyDropdownItem {
  value: Journey;
  viewValue: string;
  calendarData: object;
  years: string[];
  statusData: object;
  frequency: string;
  frequencyData: FormattedFrequencyData;
  frequencyAxes: {
    week: AxisValues,
    month: AxisValues,
    year: AxisValues
  };
}

export interface AxisValues {
  x: number[] | string[];
  y: number[];
}
