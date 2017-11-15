/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import {Injectable} from '@angular/core';
import {TreeNode as TreeNodeLib} from 'primeng/primeng';
import {ResourceService} from './resource.service';
import {TreeNode} from "../models/tree-node";
import {Item} from "../models/item";
import {Project} from "../models/project";
import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Environment} from "../models/environment";
import {CheckboxOption} from '../models/CheckboxOption';

type LoadingState = 'loading' | 'complete';
type Order = 'asc' | 'desc';

@Injectable()
export class DataService {

  // the variable that holds the entire tree structure
  public treeNodes: TreeNodeLib[] = [];
  // the status indicating the when the tree is being loaded or finished loading
  public loadingTreeNodes: LoadingState = 'complete';

  // the flag indicating if Items are still being loaded
  public loadingItems: LoadingState = 'complete';
  // filtered list of items based on selected node and selected checkbox filters
  public filteredItems: Item[] = [];
  // items selected in the itemTable
  private itemsSelectionSource = new Subject<Item[]>();
  public itemsSelection$ = this.itemsSelectionSource.asObservable();
  // items added to the shopping cart
  public shoppingCartItems = new BehaviorSubject<Item[]>([]);
  public totalItemsCount: number = 0;

  // text filter input
  private textFilterInputSource = new Subject<string>();
  public textFilterInput$ = this.textFilterInputSource.asObservable();

  // Search query
  private searchQuery: Object = null;

  // item table pagination settings
  // the first result to retrieve, numbered from '0'
  public itemsFirstResult: number = 0;
  // the maximum number of results
  public itemsMaxResults: number = 8;
  // ascending/descending order
  public itemsOrder: number = 1;
  // the property to order on
  public itemsPropertyName: string = "";

  // trigger checkboxFilters reload
  private rerenderCheckboxFiltersSource = new Subject<boolean>();
  public rerenderCheckboxFilters$ = this.rerenderCheckboxFiltersSource.asObservable();
  // currently selected tree node
  private selectedTreeNode: TreeNode = null;
  // selected checkboxes for projects filter
  private selectedProjects: string[] = [];
  // selected checkboxes for research lines filter
  private selectedResearchLines: string[] = [];
  // list of project names available for current item list
  public projects: CheckboxOption[] = [];
  // list of research lines available for current item list
  public linesOfResearch: CheckboxOption[] = [];
  // list of all projects
  private allProjects: Project[] = [];

  // NTR logo
  private ntrLogoUrlSummary = new Subject<string>();
  public ntrLogoUrl$ = this.ntrLogoUrlSummary.asObservable();

  // VU logo
  private vuLogoUrlSummary = new Subject<string>();
  public vuLogoUrl$ = this.vuLogoUrlSummary.asObservable();

  // item summary popup visibility
  private itemSummaryVisibleSource = new Subject<Item>();
  public itemSummaryVisible$ = this.itemSummaryVisibleSource.asObservable();

  // search error message
  private searchErrorMessageSource = new Subject<string>();
  public searchErrorMessage$ = this.searchErrorMessageSource.asObservable();

  // environment label visibility
  private environmentSource = new Subject<Environment>();
  public environment$ = this.environmentSource.asObservable();

  constructor(private resourceService: ResourceService) {
    this.fetchAllProjectsAndItems();
    this.fetchAllTreeNodes();
    this.setEnvironment();
  }

  // ------------------------- tree nodes -------------------------

  private processTreeNodes(nodes: TreeNode[]): TreeNodeLib[] {
    if (nodes == null) {
      return [];
    }
    let treeNodes: TreeNodeLib[] = [];
    for (let node of nodes) {
      // filter out empty domains
      if (!(node.accumulativeItemCount == 0 && node.nodeType == 'Domain')) {
        let newNode = this.processTreeNode(node);
        treeNodes.push(newNode);
      }
    }
    return treeNodes;
  }

  private processTreeNode(node: TreeNode): TreeNodeLib {
    if (node == null) {
      return null;
    }
    // Add PrimeNG visual properties for tree nodes
    let newNode: TreeNodeLib = node;

    let count = node.accumulativeItemCount ? node.accumulativeItemCount : 0;
    newNode.label = `${node.label} (${count})`;

    // If this node has children, drill down
    if (node.children) {
      let children = this.processTreeNodes(node.children);
      if (children.length > 0) {
        newNode.children = children;
        newNode.expandedIcon = 'fa-folder-open';
        newNode.collapsedIcon = 'fa-folder';
        newNode.icon = '';
      } else {
        newNode.icon = 'fa-folder-o';
      }
    } else {
      switch (node.variableType) {
        case 'Text':
          newNode.icon = 'icon-abc';
          break;
        case 'Numerical':
          newNode.icon = 'icon-123';
          break;
        default: {
          newNode.icon = 'fa-file-text';
          break;
        }
      }
    }
    return newNode;
  }

  fetchAllTreeNodes() {
    this.loadingTreeNodes = 'loading';
    // Retrieve all tree nodes
    this.resourceService.getTreeNodes()
      .subscribe(
        (nodes: TreeNode[]) => {
          this.loadingTreeNodes = 'complete';
          nodes.forEach( node => this.totalItemsCount += node.accumulativeItemCount);
          let treeNodes = this.processTreeNodes(nodes);
          treeNodes.forEach((function (node) {
            this.treeNodes.push(node); // to ensure the treeNodes pointer remains unchanged
          }).bind(this));
        },
        err => console.error(err)
      );
  }

  selectTreeNode(treeNode: TreeNode) {
    this.selectedTreeNode = treeNode;
    this.updateItemTable();
  }

  // ------------------------- filters and item table -------------------------

  fetchAllProjectsAndItems() {
    this.resourceService.getProjects()
      .subscribe(
        (projects: Project[]) => {
          this.allProjects = projects;
          this.fetchItems();
          for (let project of projects) {
            this.projects.push({label: project.name, value: project.name});
            DataService.collectUnique(project.lineOfResearch, this.linesOfResearch);
          }
        },
        err => console.error(err)
      );
  }

  projectToResearchLine(projectName: string): string {
    if (this.allProjects) {
      return this.allProjects.find(p => p.name == projectName).lineOfResearch;
    } else {
      return null;
    }
  }

  fetchFilters() {
    this.projects.length = 0;
    this.projects.length = 0;
    this.linesOfResearch.length = 0;

    let selectedConceptCodes = DataService.treeConceptCodes(this.selectedTreeNode);
    let codes = Array.from(selectedConceptCodes);

    this.resourceService.getProjects(codes, this.searchQuery).subscribe(
      (projects: Project[]) => {
        for (let project of projects) {
          this.allProjects.push(project);
          this.projects.push({label: project.name, value: project.name});
          DataService.collectUnique(project.lineOfResearch, this.linesOfResearch);
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  fetchItems() {
    let t1 = new Date();
    console.debug(`Fetching items ...`);
    this.loadingItems = 'loading';
    this.filteredItems.length = 0;
    this.clearErrorSearchMessage();

    let selectedConceptCodes = DataService.treeConceptCodes(this.selectedTreeNode);
    let codes = Array.from(selectedConceptCodes);
    let projects = this.getProjectsForSelectedResearchLines();

    let order: Order = this.orderFlagToOrderName(this.itemsOrder);

    this.resourceService.getItems(this.itemsFirstResult, this.itemsMaxResults, order, this.itemsPropertyName,
      codes, projects, this.searchQuery).subscribe(
      (items: Item[]) => {
        for (let item of items) {
          if (this.allProjects && this.allProjects.length > 0) {
            item.lineOfResearch = this.projectToResearchLine(item.project);
          }
          this.filteredItems.push(item);
        }
        this.loadingItems = "complete";
        let t2 = new Date();
        console.info(`Found ${this.filteredItems.length} items. (Took ${t2.getTime() - t1.getTime()} ms.)`);
      },
      err => {
        if (err != String(undefined)) {
          this.searchErrorMessageSource.next(err);
        }
        console.error(err);
        this.clearCheckboxFilters();
      }
    );
  }


  static orderFlagToOrderName(order: number){
    return order == 1 ? "asc" : "desc";
  }

  clearErrorSearchMessage(){
    this.searchErrorMessageSource.next('');
  }

  static treeConceptCodes(treeNode: TreeNode): Set<string> {
    if (treeNode == null) {
      return new Set();
    }
    let conceptCodes = new Set();
    if (treeNode.concept != null) {
      conceptCodes.add(treeNode.concept);
    }
    if (treeNode.children != null) {
      treeNode.children.forEach((node: TreeNode) =>
        DataService.treeConceptCodes(node).forEach((conceptCode: string) =>
          conceptCodes.add(conceptCode)
        )
      )
    }
    return conceptCodes;
  }

  updateItemTable() {
    this.clearItemsSelection();
    this.clearAllFilters();
  }

  filterOnResearchLines(selectedResearchLines) {
    this.projects.length = 0;
    this.selectedResearchLines = selectedResearchLines;
    this.clearItemsSelection();
    this.fetchItems();
    this.getUniqueProjects();
  }

  filterOnProjects(selectedProjects) {
    this.linesOfResearch.length = 0;
    this.selectedProjects = selectedProjects;
    this.clearItemsSelection();
    this.fetchItems();
    this.getUniqueLinesOfResearch();
  }

  getProjectsForSelectedResearchLines(): string[] {
    if(this.selectedResearchLines.length && !this.selectedProjects.length) {
      let projects: string[] = [];
      this.allProjects.forEach( p => {
        if(this.selectedResearchLines.includes(p.lineOfResearch)) {
          projects.push(p.name);
        }
      });
      return projects;
    } else {
      return this.selectedProjects;
    }
  }

  clearAllFilters() {
    this.clearCheckboxFilterSelection();
    this.setTextFilterInput('');
    this.rerenderCheckboxFiltersSource.next(true);
  }

  clearCheckboxFilters() {
    this.linesOfResearch.length = 0;
    this.projects.length = 0;
    this.selectedResearchLines.length = 0;
    this.selectedProjects.length = 0;
  }

  clearCheckboxFilterSelection() {
    this.selectedResearchLines.length = 0;
    this.selectedProjects.length = 0;
  }

  clearItemsSelection() {
    this.itemsSelectionSource.next(null);
  }

  setTextFilterInput(text: string) {
    this.textFilterInputSource.next(text);
  }

  setSearchQuery(query: Object) {
    this.searchQuery = query;
    this.fetchItems();
  }

  private getUniqueProjects() {
    for (let item of this.filteredItems) {
      DataService.collectUnique(item.project, this.projects);
    }
  }

  private getUniqueLinesOfResearch() {
    for (let project of this.allProjects) {
      DataService.collectUnique(project.lineOfResearch, this.linesOfResearch);
    }
  }

  private static collectUnique(element, list: CheckboxOption[]) {
    let values = list.map(function (a) {
      return a.value;
    });
    if (element && !values.includes(element)) {
      list.push({label: element, value: element} as CheckboxOption);
    }
  }

  countItems(): number {
    return this.selectedTreeNode ? this.selectedTreeNode.accumulativeItemCount : this.totalItemsCount;
  }

  // ------------------------- shopping cart -------------------------

  addToShoppingCart(newItemSelection: Item[]) {
    let newItems: Item[] = this.shoppingCartItems.getValue();
    let itemNames = newItems.map((item) => item.name);
    for (let item of newItemSelection) {
      if (!itemNames.includes(item.name)) {
        newItems.push(item);
      }
    }
    this.shoppingCartItems.next(newItems);
  }

  setShoppingCartItems(items: Item[]) {
    this.shoppingCartItems.next(items);
  }

  // ------------------------- item summary -------------------------

  displayPopup(item: Item) {
    this.resourceService.getItem(item.id).subscribe(extendedItem =>
      this.itemSummaryVisibleSource.next(extendedItem)
    )
  }

  // ------------------------- environment label -------------------------
  setEnvironment() {
    this.resourceService.getEnvironment().subscribe(
      (env: Environment) => {
        this.environmentSource.next(env);
      });
  }

  // ------------------------- header logos -------------------------
  loadLogo(type: string) {
    this.resourceService.getLogo(type)
      .subscribe(
        (blobContent) => {
          let urlCreator = window.URL;
          if (type == 'NTR') {
            this.ntrLogoUrlSummary.next(urlCreator.createObjectURL(blobContent));
          } else {
            this.vuLogoUrlSummary.next(urlCreator.createObjectURL(blobContent));
          }
        },
        err => console.error(err)
      );
  }

}
