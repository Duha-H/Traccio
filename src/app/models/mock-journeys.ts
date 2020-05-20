import * as mApps from './mock-applications';
import { Journey } from './journey';

export const testJourney1 = new Journey({
  title: "Test1",
  startDate: "2019-4-13",
  active: true,
  id: 0,
  applications: mApps.MOCK_APPS_2,
});
export const testJourney2 = new Journey({
  title: "Test2221",
  startDate: "2017-9-15",
  endDate: "2019-1-20",
  active: false,
  id: 1,
  applications: mApps.MOCK_APPS_1,
});
