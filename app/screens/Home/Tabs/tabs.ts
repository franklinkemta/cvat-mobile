import {createContext} from 'react';
export enum Tabs {
  TASKS_STACK_TAB = 'TasksStackTab',
  TASK_CREATE_STACK_TAB = 'TaskCreateStackTab',
}

// Define a context to share the current value of routeName in the root  tab navigator to the nested stacks
export const HomeTabsContext = createContext({
  routeName: '',
});
