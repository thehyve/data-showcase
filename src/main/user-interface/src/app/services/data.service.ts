import {Injectable} from '@angular/core';
import {TreeNode} from 'primeng/primeng';
import {ResourceService} from './resource.service';
import {Domain} from "../models/domain";
import {Item} from "../models/item";
import {Project} from "../models/project";
import {Subject} from "rxjs/Subject";

type LoadingState = 'loading' | 'complete';

@Injectable()
export class DataService {

  // the variable that holds the entire tree structure
  public treeNodes: TreeNode[] = [];
  // the status indicating the when the tree is being loaded or finished loading
  public loadingTreeNodes: LoadingState = 'complete';

  // list of all items
  private items: Item[] = [];
  // filtered list of items based on selected domain and selected checkbox filters
  public filteredItems: Item[] = [];

  // global text filter
  private globalFilterSource = new Subject<string>();
  public globalFilter$ = this.globalFilterSource.asObservable();

  // items added to the shopping cart
  private shoppingCartItemsSource = new Subject<Item[]>();
  public shoppingCartItems$ = this.shoppingCartItemsSource.asObservable();

  // selected checkboxes for keywords filter
  private selectedKeywords: string[] = [];
  // selected checkboxes for projects filter
  private selectedProjects: string[] = [];
  // selected checkboxes for research lines filter
  private selectedResearchLines: string[] = [];

  keywords: string[] = [];
  projects: string[] = [];
  researchLines: string[] = [];

  // items available for currently selected domain
  availableItems: Item[] = [];
  // projects available for currently selected domain
  availableProjects: Project[] = [];

  constructor(private resourceService: ResourceService) {
    this.updateAvailableProjects();
    this.updateDomains();
    this.updateItems();
    this.setFilteredItems();
  }

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

  updateAvailableProjects() {
    this.resourceService.getProjects()
      .subscribe(
        (projects: Project[]) => {
          this.availableProjects = projects;
        },
        err => console.error(err)
      );
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

  updateItems() {
    this.availableItems.length = 0;
    this.items.length = 0;
    this.resourceService.getItems()
      .subscribe(
        (items: Item[]) => {
          console.log('item loading');
          for (let item of items) {
            if(this.availableProjects){
              item['researchLine'] = this.availableProjects.find(p => p.name == item['project']).lineOfResearch;
            }

            this.availableItems.push(item);
            this.items.push(item);
          }
          this.setFilteredItems();
          this.getUniqueFilterValues();
        },
        err => console.error(err)
      );
  }

  updateItemTable(domain: Domain) {
    this.items.length = 0;
    let domainItems = this.availableItems.filter(item => item.domain.startsWith(domain.path));
    for (let item of domainItems){
      this.items.push(item);
    }
    this.setFilteredItems();
    this.getUniqueFilterValues();
  }

  updateFilterValues(selectedKeywords: string[], selectedProjects: string[], selectedResearchLines: string[]){
    this.selectedKeywords = selectedKeywords;
    this.selectedProjects = selectedProjects;
    this.selectedResearchLines = selectedResearchLines;
    this.setFilteredItems();
  }

  getItems() {
    return this.items;
  }
  getKeywords() {
    return this.keywords;
  }
  getProjects() {
    return this.projects;
  }
  getReasearchLines() {
    return this.researchLines;
  }

  setFilteredItems() {
    this.filteredItems.length = 0;
    for (let item of this.items) {
      if ( (this.selectedKeywords.length == 0 || item['keywords'].some(k => this.selectedKeywords.includes(k)))
        && (this.selectedProjects.length == 0 || this.selectedProjects.includes(item['project']))
        && (this.selectedResearchLines.length == 0 || this.selectedResearchLines.includes(item['researchLine']))
      ) {
        this.filteredItems.push(item);
      }
    }
  }

  setGlobalFilter(globalFilter: string) {
    this.globalFilterSource.next(globalFilter);
  }

  setShoppingCartItems(items: Item[]){
    this.shoppingCartItemsSource.next(items);
  }

  private getUniqueFilterValues() {
    this.keywords.length = 0;
    this.projects.length = 0;
    this.researchLines.length = 0;

    for (let item of this.items) {
      for (let keyword of item['keywords']) {
        this.collectUnique(keyword, this.keywords);
      }
      this.collectUnique(item['project'], this.projects);
      this.collectUnique(item['researchLine'], this.researchLines);
    }
  }

  private collectUnique(element, list) {
    let values = list.map(function (a) {
      return a.value;
    });
    if (element && !values.includes(element)) {
      list.push({label: element, value: element});
    }
  }
}
