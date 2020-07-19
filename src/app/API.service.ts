/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.
import { Injectable } from "@angular/core";
import API, { graphqlOperation } from "@aws-amplify/api";
// import { GraphQLResult } from "@aws-amplify/api/lib/types";
import * as Observable from "zen-observable";

export type CreateUserEntryInput = {
  id?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

export type ModelUserEntryConditionInput = {
  firstName?: ModelStringInput | null;
  lastName?: ModelStringInput | null;
  and?: Array<ModelUserEntryConditionInput | null> | null;
  or?: Array<ModelUserEntryConditionInput | null> | null;
  not?: ModelUserEntryConditionInput | null;
};

export type ModelStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null"
}

export type ModelSizeInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
};

export type UpdateUserEntryInput = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
};

export type DeleteUserEntryInput = {
  id?: string | null;
};

export type CreateJourneyInput = {
  id?: string | null;
  title: string;
  startDate: string;
  endDate?: string | null;
  active: boolean;
  journeyUseridId?: string | null;
};

export type ModelJourneyConditionInput = {
  title?: ModelStringInput | null;
  startDate?: ModelStringInput | null;
  endDate?: ModelStringInput | null;
  active?: ModelBooleanInput | null;
  and?: Array<ModelJourneyConditionInput | null> | null;
  or?: Array<ModelJourneyConditionInput | null> | null;
  not?: ModelJourneyConditionInput | null;
};

export type ModelBooleanInput = {
  ne?: boolean | null;
  eq?: boolean | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
};

export type UpdateJourneyInput = {
  id: string;
  title?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  active?: boolean | null;
  journeyUseridId?: string | null;
};

export type DeleteJourneyInput = {
  id?: string | null;
};

export type CreateApplicationInput = {
  id?: string | null;
  company: string;
  title: string;
  date: string;
  status?: string | null;
  source?: string | null;
  notes?: string | null;
  applicationJourneyidId?: string | null;
};

export type ModelApplicationConditionInput = {
  company?: ModelStringInput | null;
  title?: ModelStringInput | null;
  date?: ModelStringInput | null;
  status?: ModelStringInput | null;
  source?: ModelStringInput | null;
  notes?: ModelStringInput | null;
  and?: Array<ModelApplicationConditionInput | null> | null;
  or?: Array<ModelApplicationConditionInput | null> | null;
  not?: ModelApplicationConditionInput | null;
};

export type UpdateApplicationInput = {
  id: string;
  company?: string | null;
  title?: string | null;
  date?: string | null;
  status?: string | null;
  source?: string | null;
  notes?: string | null;
  applicationJourneyidId?: string | null;
};

export type DeleteApplicationInput = {
  id?: string | null;
};

export type ModelUserEntryFilterInput = {
  id?: ModelIDInput | null;
  firstName?: ModelStringInput | null;
  lastName?: ModelStringInput | null;
  and?: Array<ModelUserEntryFilterInput | null> | null;
  or?: Array<ModelUserEntryFilterInput | null> | null;
  not?: ModelUserEntryFilterInput | null;
};

export type ModelIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export type ModelJourneyFilterInput = {
  id?: ModelIDInput | null;
  title?: ModelStringInput | null;
  startDate?: ModelStringInput | null;
  endDate?: ModelStringInput | null;
  active?: ModelBooleanInput | null;
  and?: Array<ModelJourneyFilterInput | null> | null;
  or?: Array<ModelJourneyFilterInput | null> | null;
  not?: ModelJourneyFilterInput | null;
};

export type ModelApplicationFilterInput = {
  id?: ModelIDInput | null;
  company?: ModelStringInput | null;
  title?: ModelStringInput | null;
  date?: ModelStringInput | null;
  status?: ModelStringInput | null;
  source?: ModelStringInput | null;
  notes?: ModelStringInput | null;
  and?: Array<ModelApplicationFilterInput | null> | null;
  or?: Array<ModelApplicationFilterInput | null> | null;
  not?: ModelApplicationFilterInput | null;
};

export type CreateUserEntryMutation = {
  __typename: "UserEntry";
  id: string;
  firstName: string | null;
  lastName: string | null;
  journeys: {
    __typename: "ModelJourneyConnection";
    items: Array<{
      __typename: "Journey";
      id: string;
      title: string;
      startDate: string;
      endDate: string | null;
      active: boolean;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

export type UpdateUserEntryMutation = {
  __typename: "UserEntry";
  id: string;
  firstName: string | null;
  lastName: string | null;
  journeys: {
    __typename: "ModelJourneyConnection";
    items: Array<{
      __typename: "Journey";
      id: string;
      title: string;
      startDate: string;
      endDate: string | null;
      active: boolean;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

export type DeleteUserEntryMutation = {
  __typename: "UserEntry";
  id: string;
  firstName: string | null;
  lastName: string | null;
  journeys: {
    __typename: "ModelJourneyConnection";
    items: Array<{
      __typename: "Journey";
      id: string;
      title: string;
      startDate: string;
      endDate: string | null;
      active: boolean;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

export type CreateJourneyMutation = {
  __typename: "Journey";
  id: string;
  title: string;
  startDate: string;
  endDate: string | null;
  active: boolean;
  userid: {
    __typename: "UserEntry";
    id: string;
    firstName: string | null;
    lastName: string | null;
    journeys: {
      __typename: "ModelJourneyConnection";
      nextToken: string | null;
    } | null;
  } | null;
  applications: {
    __typename: "ModelApplicationConnection";
    items: Array<{
      __typename: "Application";
      id: string;
      company: string;
      title: string;
      date: string;
      status: string | null;
      source: string | null;
      notes: string | null;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

export type UpdateJourneyMutation = {
  __typename: "Journey";
  id: string;
  title: string;
  startDate: string;
  endDate: string | null;
  active: boolean;
  userid: {
    __typename: "UserEntry";
    id: string;
    firstName: string | null;
    lastName: string | null;
    journeys: {
      __typename: "ModelJourneyConnection";
      nextToken: string | null;
    } | null;
  } | null;
  applications: {
    __typename: "ModelApplicationConnection";
    items: Array<{
      __typename: "Application";
      id: string;
      company: string;
      title: string;
      date: string;
      status: string | null;
      source: string | null;
      notes: string | null;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

export type DeleteJourneyMutation = {
  __typename: "Journey";
  id: string;
  title: string;
  startDate: string;
  endDate: string | null;
  active: boolean;
  userid: {
    __typename: "UserEntry";
    id: string;
    firstName: string | null;
    lastName: string | null;
    journeys: {
      __typename: "ModelJourneyConnection";
      nextToken: string | null;
    } | null;
  } | null;
  applications: {
    __typename: "ModelApplicationConnection";
    items: Array<{
      __typename: "Application";
      id: string;
      company: string;
      title: string;
      date: string;
      status: string | null;
      source: string | null;
      notes: string | null;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

export type CreateApplicationMutation = {
  __typename: "Application";
  id: string;
  company: string;
  title: string;
  date: string;
  status: string | null;
  source: string | null;
  notes: string | null;
  journeyid: {
    __typename: "Journey";
    id: string;
    title: string;
    startDate: string;
    endDate: string | null;
    active: boolean;
    userid: {
      __typename: "UserEntry";
      id: string;
      firstName: string | null;
      lastName: string | null;
    } | null;
    applications: {
      __typename: "ModelApplicationConnection";
      nextToken: string | null;
    } | null;
  } | null;
};

export type UpdateApplicationMutation = {
  __typename: "Application";
  id: string;
  company: string;
  title: string;
  date: string;
  status: string | null;
  source: string | null;
  notes: string | null;
  journeyid: {
    __typename: "Journey";
    id: string;
    title: string;
    startDate: string;
    endDate: string | null;
    active: boolean;
    userid: {
      __typename: "UserEntry";
      id: string;
      firstName: string | null;
      lastName: string | null;
    } | null;
    applications: {
      __typename: "ModelApplicationConnection";
      nextToken: string | null;
    } | null;
  } | null;
};

export type DeleteApplicationMutation = {
  __typename: "Application";
  id: string;
  company: string;
  title: string;
  date: string;
  status: string | null;
  source: string | null;
  notes: string | null;
  journeyid: {
    __typename: "Journey";
    id: string;
    title: string;
    startDate: string;
    endDate: string | null;
    active: boolean;
    userid: {
      __typename: "UserEntry";
      id: string;
      firstName: string | null;
      lastName: string | null;
    } | null;
    applications: {
      __typename: "ModelApplicationConnection";
      nextToken: string | null;
    } | null;
  } | null;
};

export type GetUserEntryQuery = {
  __typename: "UserEntry";
  id: string;
  firstName: string | null;
  lastName: string | null;
  journeys: {
    __typename: "ModelJourneyConnection";
    items: Array<{
      __typename: "Journey";
      id: string;
      title: string;
      startDate: string;
      endDate: string | null;
      active: boolean;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

export type ListUserEntrysQuery = {
  __typename: "ModelUserEntryConnection";
  items: Array<{
    __typename: "UserEntry";
    id: string;
    firstName: string | null;
    lastName: string | null;
    journeys: {
      __typename: "ModelJourneyConnection";
      nextToken: string | null;
    } | null;
  } | null> | null;
  nextToken: string | null;
};

export type GetJourneyQuery = {
  __typename: "Journey";
  id: string;
  title: string;
  startDate: string;
  endDate: string | null;
  active: boolean;
  userid: {
    __typename: "UserEntry";
    id: string;
    firstName: string | null;
    lastName: string | null;
    journeys: {
      __typename: "ModelJourneyConnection";
      nextToken: string | null;
    } | null;
  } | null;
  applications: {
    __typename: "ModelApplicationConnection";
    items: Array<{
      __typename: "Application";
      id: string;
      company: string;
      title: string;
      date: string;
      status: string | null;
      source: string | null;
      notes: string | null;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

export type ListJourneysQuery = {
  __typename: "ModelJourneyConnection";
  items: Array<{
    __typename: "Journey";
    id: string;
    title: string;
    startDate: string;
    endDate: string | null;
    active: boolean;
    userid: {
      __typename: "UserEntry";
      id: string;
      firstName: string | null;
      lastName: string | null;
    } | null;
    applications: {
      __typename: "ModelApplicationConnection";
      nextToken: string | null;
    } | null;
  } | null> | null;
  nextToken: string | null;
};

export type GetApplicationQuery = {
  __typename: "Application";
  id: string;
  company: string;
  title: string;
  date: string;
  status: string | null;
  source: string | null;
  notes: string | null;
  journeyid: {
    __typename: "Journey";
    id: string;
    title: string;
    startDate: string;
    endDate: string | null;
    active: boolean;
    userid: {
      __typename: "UserEntry";
      id: string;
      firstName: string | null;
      lastName: string | null;
    } | null;
    applications: {
      __typename: "ModelApplicationConnection";
      nextToken: string | null;
    } | null;
  } | null;
};

export type ListApplicationsQuery = {
  __typename: "ModelApplicationConnection";
  items: Array<{
    __typename: "Application";
    id: string;
    company: string;
    title: string;
    date: string;
    status: string | null;
    source: string | null;
    notes: string | null;
    journeyid: {
      __typename: "Journey";
      id: string;
      title: string;
      startDate: string;
      endDate: string | null;
      active: boolean;
    } | null;
  } | null> | null;
  nextToken: string | null;
};

export type OnCreateUserEntrySubscription = {
  __typename: "UserEntry";
  id: string;
  firstName: string | null;
  lastName: string | null;
  journeys: {
    __typename: "ModelJourneyConnection";
    items: Array<{
      __typename: "Journey";
      id: string;
      title: string;
      startDate: string;
      endDate: string | null;
      active: boolean;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

export type OnUpdateUserEntrySubscription = {
  __typename: "UserEntry";
  id: string;
  firstName: string | null;
  lastName: string | null;
  journeys: {
    __typename: "ModelJourneyConnection";
    items: Array<{
      __typename: "Journey";
      id: string;
      title: string;
      startDate: string;
      endDate: string | null;
      active: boolean;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

export type OnDeleteUserEntrySubscription = {
  __typename: "UserEntry";
  id: string;
  firstName: string | null;
  lastName: string | null;
  journeys: {
    __typename: "ModelJourneyConnection";
    items: Array<{
      __typename: "Journey";
      id: string;
      title: string;
      startDate: string;
      endDate: string | null;
      active: boolean;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

export type OnCreateJourneySubscription = {
  __typename: "Journey";
  id: string;
  title: string;
  startDate: string;
  endDate: string | null;
  active: boolean;
  userid: {
    __typename: "UserEntry";
    id: string;
    firstName: string | null;
    lastName: string | null;
    journeys: {
      __typename: "ModelJourneyConnection";
      nextToken: string | null;
    } | null;
  } | null;
  applications: {
    __typename: "ModelApplicationConnection";
    items: Array<{
      __typename: "Application";
      id: string;
      company: string;
      title: string;
      date: string;
      status: string | null;
      source: string | null;
      notes: string | null;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

export type OnUpdateJourneySubscription = {
  __typename: "Journey";
  id: string;
  title: string;
  startDate: string;
  endDate: string | null;
  active: boolean;
  userid: {
    __typename: "UserEntry";
    id: string;
    firstName: string | null;
    lastName: string | null;
    journeys: {
      __typename: "ModelJourneyConnection";
      nextToken: string | null;
    } | null;
  } | null;
  applications: {
    __typename: "ModelApplicationConnection";
    items: Array<{
      __typename: "Application";
      id: string;
      company: string;
      title: string;
      date: string;
      status: string | null;
      source: string | null;
      notes: string | null;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

export type OnDeleteJourneySubscription = {
  __typename: "Journey";
  id: string;
  title: string;
  startDate: string;
  endDate: string | null;
  active: boolean;
  userid: {
    __typename: "UserEntry";
    id: string;
    firstName: string | null;
    lastName: string | null;
    journeys: {
      __typename: "ModelJourneyConnection";
      nextToken: string | null;
    } | null;
  } | null;
  applications: {
    __typename: "ModelApplicationConnection";
    items: Array<{
      __typename: "Application";
      id: string;
      company: string;
      title: string;
      date: string;
      status: string | null;
      source: string | null;
      notes: string | null;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

export type OnCreateApplicationSubscription = {
  __typename: "Application";
  id: string;
  company: string;
  title: string;
  date: string;
  status: string | null;
  source: string | null;
  notes: string | null;
  journeyid: {
    __typename: "Journey";
    id: string;
    title: string;
    startDate: string;
    endDate: string | null;
    active: boolean;
    userid: {
      __typename: "UserEntry";
      id: string;
      firstName: string | null;
      lastName: string | null;
    } | null;
    applications: {
      __typename: "ModelApplicationConnection";
      nextToken: string | null;
    } | null;
  } | null;
};

export type OnUpdateApplicationSubscription = {
  __typename: "Application";
  id: string;
  company: string;
  title: string;
  date: string;
  status: string | null;
  source: string | null;
  notes: string | null;
  journeyid: {
    __typename: "Journey";
    id: string;
    title: string;
    startDate: string;
    endDate: string | null;
    active: boolean;
    userid: {
      __typename: "UserEntry";
      id: string;
      firstName: string | null;
      lastName: string | null;
    } | null;
    applications: {
      __typename: "ModelApplicationConnection";
      nextToken: string | null;
    } | null;
  } | null;
};

export type OnDeleteApplicationSubscription = {
  __typename: "Application";
  id: string;
  company: string;
  title: string;
  date: string;
  status: string | null;
  source: string | null;
  notes: string | null;
  journeyid: {
    __typename: "Journey";
    id: string;
    title: string;
    startDate: string;
    endDate: string | null;
    active: boolean;
    userid: {
      __typename: "UserEntry";
      id: string;
      firstName: string | null;
      lastName: string | null;
    } | null;
    applications: {
      __typename: "ModelApplicationConnection";
      nextToken: string | null;
    } | null;
  } | null;
};

@Injectable({
  providedIn: "root"
})
export class APIService {
  async CreateUserEntry(
    input: CreateUserEntryInput,
    condition?: ModelUserEntryConditionInput
  ): Promise<CreateUserEntryMutation> {
    const statement = `mutation CreateUserEntry($input: CreateUserEntryInput!, $condition: ModelUserEntryConditionInput) {
        createUserEntry(input: $input, condition: $condition) {
          __typename
          id
          firstName
          lastName
          journeys {
            __typename
            items {
              __typename
              id
              title
              startDate
              endDate
              active
            }
            nextToken
          }
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateUserEntryMutation>response.data.createUserEntry;
  }
  async UpdateUserEntry(
    input: UpdateUserEntryInput,
    condition?: ModelUserEntryConditionInput
  ): Promise<UpdateUserEntryMutation> {
    const statement = `mutation UpdateUserEntry($input: UpdateUserEntryInput!, $condition: ModelUserEntryConditionInput) {
        updateUserEntry(input: $input, condition: $condition) {
          __typename
          id
          firstName
          lastName
          journeys {
            __typename
            items {
              __typename
              id
              title
              startDate
              endDate
              active
            }
            nextToken
          }
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateUserEntryMutation>response.data.updateUserEntry;
  }
  async DeleteUserEntry(
    input: DeleteUserEntryInput,
    condition?: ModelUserEntryConditionInput
  ): Promise<DeleteUserEntryMutation> {
    const statement = `mutation DeleteUserEntry($input: DeleteUserEntryInput!, $condition: ModelUserEntryConditionInput) {
        deleteUserEntry(input: $input, condition: $condition) {
          __typename
          id
          firstName
          lastName
          journeys {
            __typename
            items {
              __typename
              id
              title
              startDate
              endDate
              active
            }
            nextToken
          }
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteUserEntryMutation>response.data.deleteUserEntry;
  }
  async CreateJourney(
    input: CreateJourneyInput,
    condition?: ModelJourneyConditionInput
  ): Promise<CreateJourneyMutation> {
    const statement = `mutation CreateJourney($input: CreateJourneyInput!, $condition: ModelJourneyConditionInput) {
        createJourney(input: $input, condition: $condition) {
          __typename
          id
          title
          startDate
          endDate
          active
          userid {
            __typename
            id
            firstName
            lastName
            journeys {
              __typename
              nextToken
            }
          }
          applications {
            __typename
            items {
              __typename
              id
              company
              title
              date
              status
              source
              notes
            }
            nextToken
          }
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateJourneyMutation>response.data.createJourney;
  }
  async UpdateJourney(
    input: UpdateJourneyInput,
    condition?: ModelJourneyConditionInput
  ): Promise<UpdateJourneyMutation> {
    const statement = `mutation UpdateJourney($input: UpdateJourneyInput!, $condition: ModelJourneyConditionInput) {
        updateJourney(input: $input, condition: $condition) {
          __typename
          id
          title
          startDate
          endDate
          active
          userid {
            __typename
            id
            firstName
            lastName
            journeys {
              __typename
              nextToken
            }
          }
          applications {
            __typename
            items {
              __typename
              id
              company
              title
              date
              status
              source
              notes
            }
            nextToken
          }
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateJourneyMutation>response.data.updateJourney;
  }
  async DeleteJourney(
    input: DeleteJourneyInput,
    condition?: ModelJourneyConditionInput
  ): Promise<DeleteJourneyMutation> {
    const statement = `mutation DeleteJourney($input: DeleteJourneyInput!, $condition: ModelJourneyConditionInput) {
        deleteJourney(input: $input, condition: $condition) {
          __typename
          id
          title
          startDate
          endDate
          active
          userid {
            __typename
            id
            firstName
            lastName
            journeys {
              __typename
              nextToken
            }
          }
          applications {
            __typename
            items {
              __typename
              id
              company
              title
              date
              status
              source
              notes
            }
            nextToken
          }
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteJourneyMutation>response.data.deleteJourney;
  }
  async CreateApplication(
    input: CreateApplicationInput,
    condition?: ModelApplicationConditionInput
  ): Promise<CreateApplicationMutation> {
    const statement = `mutation CreateApplication($input: CreateApplicationInput!, $condition: ModelApplicationConditionInput) {
        createApplication(input: $input, condition: $condition) {
          __typename
          id
          company
          title
          date
          status
          source
          notes
          journeyid {
            __typename
            id
            title
            startDate
            endDate
            active
            userid {
              __typename
              id
              firstName
              lastName
            }
            applications {
              __typename
              nextToken
            }
          }
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateApplicationMutation>response.data.createApplication;
  }
  async UpdateApplication(
    input: UpdateApplicationInput,
    condition?: ModelApplicationConditionInput
  ): Promise<UpdateApplicationMutation> {
    const statement = `mutation UpdateApplication($input: UpdateApplicationInput!, $condition: ModelApplicationConditionInput) {
        updateApplication(input: $input, condition: $condition) {
          __typename
          id
          company
          title
          date
          status
          source
          notes
          journeyid {
            __typename
            id
            title
            startDate
            endDate
            active
            userid {
              __typename
              id
              firstName
              lastName
            }
            applications {
              __typename
              nextToken
            }
          }
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateApplicationMutation>response.data.updateApplication;
  }
  async DeleteApplication(
    input: DeleteApplicationInput,
    condition?: ModelApplicationConditionInput
  ): Promise<DeleteApplicationMutation> {
    const statement = `mutation DeleteApplication($input: DeleteApplicationInput!, $condition: ModelApplicationConditionInput) {
        deleteApplication(input: $input, condition: $condition) {
          __typename
          id
          company
          title
          date
          status
          source
          notes
          journeyid {
            __typename
            id
            title
            startDate
            endDate
            active
            userid {
              __typename
              id
              firstName
              lastName
            }
            applications {
              __typename
              nextToken
            }
          }
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteApplicationMutation>response.data.deleteApplication;
  }
  async GetUserEntry(id: string): Promise<GetUserEntryQuery> {
    const statement = `query GetUserEntry($id: ID!) {
        getUserEntry(id: $id) {
          __typename
          id
          firstName
          lastName
          journeys {
            __typename
            items {
              __typename
              id
              title
              startDate
              endDate
              active
            }
            nextToken
          }
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetUserEntryQuery>response.data.getUserEntry;
  }
  async ListUserEntrys(
    filter?: ModelUserEntryFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListUserEntrysQuery> {
    const statement = `query ListUserEntrys($filter: ModelUserEntryFilterInput, $limit: Int, $nextToken: String) {
        listUserEntrys(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            firstName
            lastName
            journeys {
              __typename
              nextToken
            }
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListUserEntrysQuery>response.data.listUserEntrys;
  }
  async GetJourney(id: string): Promise<GetJourneyQuery> {
    const statement = `query GetJourney($id: ID!) {
        getJourney(id: $id) {
          __typename
          id
          title
          startDate
          endDate
          active
          userid {
            __typename
            id
            firstName
            lastName
            journeys {
              __typename
              nextToken
            }
          }
          applications {
            __typename
            items {
              __typename
              id
              company
              title
              date
              status
              source
              notes
            }
            nextToken
          }
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetJourneyQuery>response.data.getJourney;
  }
  async ListJourneys(
    filter?: ModelJourneyFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListJourneysQuery> {
    const statement = `query ListJourneys($filter: ModelJourneyFilterInput, $limit: Int, $nextToken: String) {
        listJourneys(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            title
            startDate
            endDate
            active
            userid {
              __typename
              id
              firstName
              lastName
            }
            applications {
              __typename
              nextToken
            }
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListJourneysQuery>response.data.listJourneys;
  }
  async GetApplication(id: string): Promise<GetApplicationQuery> {
    const statement = `query GetApplication($id: ID!) {
        getApplication(id: $id) {
          __typename
          id
          company
          title
          date
          status
          source
          notes
          journeyid {
            __typename
            id
            title
            startDate
            endDate
            active
            userid {
              __typename
              id
              firstName
              lastName
            }
            applications {
              __typename
              nextToken
            }
          }
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetApplicationQuery>response.data.getApplication;
  }
  async ListApplications(
    filter?: ModelApplicationFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListApplicationsQuery> {
    const statement = `query ListApplications($filter: ModelApplicationFilterInput, $limit: Int, $nextToken: String) {
        listApplications(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            company
            title
            date
            status
            source
            notes
            journeyid {
              __typename
              id
              title
              startDate
              endDate
              active
            }
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListApplicationsQuery>response.data.listApplications;
  }
  OnCreateUserEntryListener: Observable<
    OnCreateUserEntrySubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateUserEntry {
        onCreateUserEntry {
          __typename
          id
          firstName
          lastName
          journeys {
            __typename
            items {
              __typename
              id
              title
              startDate
              endDate
              active
            }
            nextToken
          }
        }
      }`
    )
  ) as Observable<OnCreateUserEntrySubscription>;

  OnUpdateUserEntryListener: Observable<
    OnUpdateUserEntrySubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateUserEntry {
        onUpdateUserEntry {
          __typename
          id
          firstName
          lastName
          journeys {
            __typename
            items {
              __typename
              id
              title
              startDate
              endDate
              active
            }
            nextToken
          }
        }
      }`
    )
  ) as Observable<OnUpdateUserEntrySubscription>;

  OnDeleteUserEntryListener: Observable<
    OnDeleteUserEntrySubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteUserEntry {
        onDeleteUserEntry {
          __typename
          id
          firstName
          lastName
          journeys {
            __typename
            items {
              __typename
              id
              title
              startDate
              endDate
              active
            }
            nextToken
          }
        }
      }`
    )
  ) as Observable<OnDeleteUserEntrySubscription>;

  OnCreateJourneyListener: Observable<
    OnCreateJourneySubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateJourney {
        onCreateJourney {
          __typename
          id
          title
          startDate
          endDate
          active
          userid {
            __typename
            id
            firstName
            lastName
            journeys {
              __typename
              nextToken
            }
          }
          applications {
            __typename
            items {
              __typename
              id
              company
              title
              date
              status
              source
              notes
            }
            nextToken
          }
        }
      }`
    )
  ) as Observable<OnCreateJourneySubscription>;

  OnUpdateJourneyListener: Observable<
    OnUpdateJourneySubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateJourney {
        onUpdateJourney {
          __typename
          id
          title
          startDate
          endDate
          active
          userid {
            __typename
            id
            firstName
            lastName
            journeys {
              __typename
              nextToken
            }
          }
          applications {
            __typename
            items {
              __typename
              id
              company
              title
              date
              status
              source
              notes
            }
            nextToken
          }
        }
      }`
    )
  ) as Observable<OnUpdateJourneySubscription>;

  OnDeleteJourneyListener: Observable<
    OnDeleteJourneySubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteJourney {
        onDeleteJourney {
          __typename
          id
          title
          startDate
          endDate
          active
          userid {
            __typename
            id
            firstName
            lastName
            journeys {
              __typename
              nextToken
            }
          }
          applications {
            __typename
            items {
              __typename
              id
              company
              title
              date
              status
              source
              notes
            }
            nextToken
          }
        }
      }`
    )
  ) as Observable<OnDeleteJourneySubscription>;

  OnCreateApplicationListener: Observable<
    OnCreateApplicationSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateApplication {
        onCreateApplication {
          __typename
          id
          company
          title
          date
          status
          source
          notes
          journeyid {
            __typename
            id
            title
            startDate
            endDate
            active
            userid {
              __typename
              id
              firstName
              lastName
            }
            applications {
              __typename
              nextToken
            }
          }
        }
      }`
    )
  ) as Observable<OnCreateApplicationSubscription>;

  OnUpdateApplicationListener: Observable<
    OnUpdateApplicationSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateApplication {
        onUpdateApplication {
          __typename
          id
          company
          title
          date
          status
          source
          notes
          journeyid {
            __typename
            id
            title
            startDate
            endDate
            active
            userid {
              __typename
              id
              firstName
              lastName
            }
            applications {
              __typename
              nextToken
            }
          }
        }
      }`
    )
  ) as Observable<OnUpdateApplicationSubscription>;

  OnDeleteApplicationListener: Observable<
    OnDeleteApplicationSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteApplication {
        onDeleteApplication {
          __typename
          id
          company
          title
          date
          status
          source
          notes
          journeyid {
            __typename
            id
            title
            startDate
            endDate
            active
            userid {
              __typename
              id
              firstName
              lastName
            }
            applications {
              __typename
              nextToken
            }
          }
        }
      }`
    )
  ) as Observable<OnDeleteApplicationSubscription>;
}
