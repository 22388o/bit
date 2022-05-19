import { useQuery } from '@teambit/ui-foundation.ui.react-router.use-query';
import { useLocation } from '@teambit/base-ui.routing.routing-provider';

export type ComponentCompareQueryParams = {
  baseVersion?: string;
  version?: string;
  selectedFile?: string;
  selectedCompositionBaseFile?: string;
  selectedCompositionCompareFile?: string;
};
export type ComponentCompareRouteProps = ComponentCompareQueryParams;

// export type ComponentCompareRouteParams = {
//   componentId: string;
// };

/**
 * path = /<org>/<scope>/<componentId>/~compare/<~compositions | ~dependencies | ~code | ~aspects>/
 * variables = base, version, selectedCompositionBaseFile, selectedCompositionCompareFile, selectedFile
 */
export function useComponentCompareParams(): ComponentCompareRouteProps {
  const query = useQuery();

  const baseVersion = query.get('baseVersion') || undefined;
  const version = query.get('version') || undefined;
  const selectedFile = query.get('selectedFile') || undefined;
  const selectedCompositionBaseFile = query.get('selectedCompositionBaseFile') || undefined;
  const selectedCompositionCompareFile = query.get('selectedCompositionCompareFile') || undefined;

  return {
    baseVersion,
    selectedFile,
    selectedCompositionBaseFile,
    selectedCompositionCompareFile,
    version,
  };
}

export function getComponentCompareUrl(queryParams: ComponentCompareQueryParams): string {
  const location = useLocation();
  const getQueryVariableStr = (prop: string) => `${queryParams[prop] ? `${prop}=${queryParams[prop]}` : ''}`;

  let path = location.pathname;
  let atleastOneParam = false;
  for (const prop of Object.keys(queryParams).filter((queryParamProp) => queryParams[queryParamProp])) {
    const queryVariableStr = getQueryVariableStr(prop);

    if (!atleastOneParam) {
      atleastOneParam = true;
      path = `${path}?${queryVariableStr}`;
    } else {
      path = `${path}&${queryVariableStr}`;
    }
  }

  return path;
}
