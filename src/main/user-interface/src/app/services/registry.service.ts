import {Injectable} from '@angular/core';
import {TreeNode} from 'primeng/primeng';
import {ResourceService} from './resource.service';

type LoadingState = 'loading' | 'complete';

@Injectable()
export class RegistryService {

  // the variable that holds the entire tree structure
  public treeNodes: TreeNode[] = [];
  // the status indicating the when the tree is being loaded or finished loading
  public loadingTreeNodes: LoadingState = 'complete';

  constructor(private resourceService: ResourceService) {
    this.updateDomains();
  }

  loadTreeNext(parentNode) {
    this.resourceService.getTreeNodes(parentNode)
      .subscribe(
        (treeNodes: object[]) => {
          console.log('loading: ', parentNode['fullName']);
          const refNode = treeNodes && treeNodes.length > 0 ? treeNodes[0] : undefined;
          const children = refNode ? refNode['children'] : undefined;
          if (children) {
            parentNode['children'] = children;
            this.processTreeNode(parentNode);
            // children.forEach((function (node) {
            //   this.loadTreeNext(node);
            // }).bind(this));
          }
        },
        err => console.error(err)
      );
  }

  /** Extracts concepts (and later possibly other dimensions) from the
   *  provided TreeNode array and their children.
   *  And augment tree nodes with PrimeNG tree-ui specifications
   * @param treeNodes
   */
  private processTreeNodes(treeNodes: object[]) {
    if (!treeNodes) {
      return;
    }
    for (let node of treeNodes) {
      this.processTreeNode(node);
    }
  }

  private processTreeNode(node: Object) {
    // Add PrimeNG visual properties for tree nodes
    let count = node['count'];
    let countStr = ' ';
    if (count) {
      countStr += '(' + count;
    }
    if (countStr !== ' ') {
      countStr += ')';
    }
    node['label'] = node['name'] + countStr;

    // If this node has children, drill down
    if (node['children']) {
      // Recurse
      node['expandedIcon'] = 'fa-folder-open';
      node['collapsedIcon'] = 'fa-folder';
      node['icon'] = '';
      this.processTreeNodes(node['children']);
    } else {
      node['icon'] = 'fa-file-text';
    }
  }

  updateDomains() {
    this.loadingTreeNodes = 'loading';
    // Retrieve all tree nodes
    this.resourceService.getTreeNodes()
      .subscribe(
        (treeNodes: object[]) => {
          this.loadingTreeNodes = 'complete';
          this.processTreeNodes(treeNodes);
          treeNodes.forEach((function (node) {
            this.treeNodes.push(node); // to ensure the treeNodes pointer remains unchanged
            this.loadTreeNext(node);
          }).bind(this));
        },
        err => console.error(err)
      );
  }

}
