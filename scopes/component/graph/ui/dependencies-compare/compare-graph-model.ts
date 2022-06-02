import { EdgeModel, GraphModel } from '@teambit/graph';
import { CompareNodeModel } from './compare-node-model';

export class CompareGraphModel extends GraphModel {
  constructor(public nodes: CompareNodeModel[], public edges: EdgeModel[]) {
    super(nodes, edges);
  }
}
