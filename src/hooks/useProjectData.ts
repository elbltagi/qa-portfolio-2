import { projectState } from '../services/projectService';
import type { ProjectStatePayload } from '../types';

/**
 * Returns the delivered project state.
 *
 * The results are final and ship with the site, so there is nothing to fetch:
 * no loading state, no network, no way for the page to disagree with the
 * delivered workbooks.
 */
export function useProjectData(): { data: ProjectStatePayload } {
  return { data: projectState };
}
