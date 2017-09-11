import {Injectable} from '@angular/core';
import {TreeNode as TreeNodeLib} from 'primeng/primeng';
import {ResourceService} from './resource.service';
import {TreeNode} from "../models/tree-node";
import {Item} from "../models/item";
import {Project} from "../models/project";
import {Subject} from "rxjs/Subject";

type LoadingState = 'loading' | 'complete';

@Injectable()
export class DataService {

  // the variable that holds the entire tree structure
  public treeNodes: TreeNodeLib[] = [];
  // the status indicating the when the tree is being loaded or finished loading
  public loadingTreeNodes: LoadingState = 'complete';

  // list of all items
  private items: Item[] = [];
  // filtered list of items based on selected node and selected checkbox filters
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

  // items available for currently selected node
  availableItems: Item[] = [];
  // projects available for currently selected node
  availableProjects: Project[] = [];

  // item summary popup visibility
  private itemSummaryVisibleSource = new Subject<Item>();
  public itemSummaryVisible$ = this.itemSummaryVisibleSource.asObservable();

  constructor(private resourceService: ResourceService) {
    this.updateAvailableProjects();
    this.updateNodes();
    this.updateItems();
    this.setFilteredItems();
  }

  private processTreeNodes(nodes: TreeNode[]):TreeNodeLib[] {
    let treeNodes:TreeNodeLib[] = [];
    for (let node of nodes) {
      if (!(node.accumulativeItemCount == 0  && node.nodeType == "Domain" )) {
        let newNode = this.processTreeNode(node);
        treeNodes.push(newNode);
      }
    }
    return treeNodes;
  }

  private processTreeNode(node: TreeNode): TreeNodeLib {
    // Add PrimeNG visual properties for tree nodes
    let newNode: TreeNodeLib = node;

    // filter out empty domains
    newNode.children = node.children.filter(value => !(value.accumulativeItemCount == 0  && value.nodeType == "Domain" ));
    let count = node.accumulativeItemCount ? node.accumulativeItemCount : 0;
    let countStr = ' (' + count + ')';
    newNode.label = node.label + countStr;

    // If this newNode has children, drill down
    if (node.children && node.children.length > 0) {
      // Recurse
      newNode.expandedIcon = 'fa-folder-open';
      newNode.collapsedIcon = 'fa-folder';
      newNode.icon = '';
      this.processTreeNodes(node.children);
    } else {
      switch (node.concept.variableType) {
        case "Text":
          newNode['icon'] = 'icon-abc';
          break;
        case "Numerical":
          newNode['icon'] = 'icon-123';
          break;
        default: {
          newNode['icon'] = 'fa-file-text';
          break;
        }
      }
    }
    return newNode;
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

  updateNodes() {
    this.loadingTreeNodes = 'loading';
    // Retrieve all tree nodes
    this.resourceService.getTreeNodes()
      .subscribe(
        (nodes: TreeNode[]) => {
          this.loadingTreeNodes = 'complete';
          let treeNodes = this.processTreeNodes(nodes);
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

  updateItemTable(treeNode: TreeNode) {
    this.items.length = 0;

    let nodeItems = this.availableItems.filter(item => item.itemPath.startsWith(treeNode.path));
    for (let node of nodeItems){
      this.items.push(node);
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

  displayPopup(item: Item) {
    this.itemSummaryVisibleSource.next(item);
  }
}
