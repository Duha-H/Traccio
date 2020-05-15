import * as mApps from './mock-applications';
import { Journey } from './journey';

export const testJourney1 = new Journey({
  title: "Test1",
  startDate: [13, 4, 2019],
  active: true,
  id: 0,
  apps: mApps.MOCK_APPS_2,
});
export const testJourney2 = new Journey({
  title: "Test2221",
  startDate: [15, 9, 2017],
  endDate: [20, 1, 2019],
  active: false,
  id: 1,
  apps: mApps.MOCK_APPS_1,
});
