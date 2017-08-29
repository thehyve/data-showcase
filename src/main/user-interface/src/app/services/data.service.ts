import {Injectable} from '@angular/core';
import {TreeNode} from 'primeng/primeng';
import {ResourceService} from './resource.service';

type LoadingState = 'loading' | 'complete';

@Injectable()
export class DataService {

  // the variable that holds the entire tree structure
  public treeNodes: TreeNode[] = [];
  // the status indicating the when the tree is being loaded or finished loading
  public loadingTreeNodes: LoadingState = 'complete';

  // list of all the items
  private items = [];
  // filtered list of items based on selected domain and selected checkbox filters
  private filteredItems: Object[] = [];
  // global text filter
  private globalFilter: string = '';

  // selected checkboxes for keywords filter
  private selectedKeywords: string[] = [];
  // selected checkboxes for projects filter
  private selectedProjects: string[] = [];
  // selected checkboxes for research lines filter
  private selectedResearchLines: string[] = [];

  constructor(private resourceService: ResourceService) {
    this.updateDomains();
    this.updateItemTable('');
    this.getFilteredItems();
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
      countStr = '(' + count + ')';
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
      node['icon'] = 'fa-folder';
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

  updateItemTable(node: Object) {
    console.log(node['label']);
    this.resourceService.getItems(node['name'])
      .subscribe(
        (items: object[]) => {
          this.items = items;

        },
        err => console.error(err)
      )
  }

  updateFilterValues(selectedKeywords: string[], selectedProjects: string[], selectedResearchLines: string[]){
    this.selectedKeywords = selectedKeywords;
    this.selectedProjects = selectedProjects;
    this.selectedResearchLines = selectedResearchLines;
    this.getFilteredItems();
  }

  getItems() {
    return this.items;
  }

  getFilteredItems() {
    this.filteredItems.length = 0;
    for (let item of this.items) {
      if ( (this.selectedKeywords.length == 0 || item['keywords'].some(k => this.selectedKeywords.includes(k)))
        && (this.selectedProjects.length == 0 || this.selectedProjects.includes(item['project']))
        && (this.selectedResearchLines.length == 0 || this.selectedResearchLines.includes(item['researchLine']))) {

        this.filteredItems.push(item);

      }
    }
    return this.filteredItems;
  }

  setGlobalFilter(globalFilter: string) {
    this.globalFilter = globalFilter;
  }

  getGlobalFilter() {
    return this.globalFilter;
  }
}
