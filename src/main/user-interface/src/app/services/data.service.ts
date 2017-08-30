import {Injectable} from '@angular/core';
import {TreeNode} from 'primeng/primeng';
import {ResourceService} from './resource.service';
import {Domain} from "../models/domain";

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


  /** Extracts concepts (and later possibly other dimensions) from the
   *  provided TreeNode array and their children.
   *  And augment tree nodes with PrimeNG tree-ui specifications
   * @param domains
   */
  private processTreeNodes(domains: Domain[]):TreeNode[] {
    let treeNodes:TreeNode[] = [];
    for (let domain of domains) {
      let node = this.processTreeNode(domain);
      treeNodes.push(node);
    }
    return treeNodes;
  }

  private processTreeNode(domain: Domain):TreeNode {
    // Add PrimeNG visual properties for tree nodes
    let node: TreeNode = domain;
    let count = domain['accumulativeItemCount'] ? domain['accumulativeItemCount'] : 0;
    let countStr = ' (' + count + ')';
    node['label'] = domain['name'] + countStr;

    // If this node has children, drill down
    if (domain['children'] && domain['children'].length > 0) {
      // Recurse
      node['expandedIcon'] = 'fa-folder-open';
      node['collapsedIcon'] = 'fa-folder';
      node['icon'] = '';
      this.processTreeNodes(domain['children']);
    } else {
      node['icon'] = 'fa-folder';
    }
    return node;
  }

  updateDomains() {
    this.loadingTreeNodes = 'loading';
    // Retrieve all tree nodes
    this.resourceService.getTreeNodes()
      .subscribe(
        (domains: Domain[]) => {
          this.loadingTreeNodes = 'complete';
          let treeNodes = this.processTreeNodes(domains);
          treeNodes.forEach((function (node) {
            this.treeNodes.push(node); // to ensure the treeNodes pointer remains unchanged
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
