import type { Project } from './models';

export type RootStackParamList = {
  Login: undefined;
  ProjectSearch: undefined;
  ProjectResult: { project: Project; query?: string };
};
