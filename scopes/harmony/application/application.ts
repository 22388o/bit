import { AppContext } from './app-context';
import { AppDeployContext } from './app-deploy-context';
import { AppBuildContext } from './app-build-context';
import { AppBuildResult } from './app-build-result';

export type DeployFn = (context: AppDeployContext) => Promise<void>;

export interface Application {
  /**
   * name of the application. e.g. ripple-ci.
   */
  name: string;

  /**
   * run the application.
   */
  run(context: AppContext): Promise<number | void>;

  /**
   * build the application.
   */
  build?(context: AppBuildContext): Promise<AppBuildResult>;

  /**
   * application deployment. this is a build task.
   */
  deploy?: DeployFn;
}
