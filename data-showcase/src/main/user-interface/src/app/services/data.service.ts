/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import {Injectable} from '@angular/core';
import {SelectItem, TreeNode as TreeNodeLib} from 'primeng/primeng';
import {ResourceService} from './resource.service';
import {TreeNode} from "../models/tree-node";
import {Item} from "../models/item";
import {Project} from "../models/project";
import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Environment} from "../models/environment";
import {ItemResponse} from "../models/itemResponse";
import {DSMessageService} from "./ds-message.service";

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
  private filteredItemsSource = new Subject<Item[]>();
  public filteredItems$ = this.filteredItemsSource.asObservable();
  // items selected in the itemTable
  private itemsSelectionSource = new Subject<Item[]>();
  public itemsSelection$ = this.itemsSelectionSource.asObservable();
  //a number of items in the table
  public totalItemsCount: number = 0;
  // if the select-all-items checkbox is selected
  public allItemsSelected: boolean = false;
  // items added to the shopping cart
  public shoppingCartItems = new BehaviorSubject<Item[]>([]);

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
  public projects: SelectItem[] = [];
  // list of research lines available for current item list
  public linesOfResearch: SelectItem[] = [];
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

  constructor(private resourceService: ResourceService,
              private dsMessageService: DSMessageService) {
    this.fetchFilters();
    this.fetchItems();
    this.fetchAllTreeNodes()
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

  projectToResearchLine(projectName: string): string {
    if (this.allProjects) {
      return this.allProjects.find(p => p.name == projectName).lineOfResearch;
    } else {
      return null;
    }
  }

  fetchFilters() {
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
        this.sortLinesOfResearch();
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
    this.filteredItemsSource.next([]);
    this.clearErrorSearchMessage();

    let selectedConceptCodes = DataService.treeConceptCodes(this.selectedTreeNode);
    let codes = Array.from(selectedConceptCodes);
    let projects = this.getProjectsForSelectedResearchLines();

    let order: Order = this.orderFlagToOrderName(this.itemsOrder);

    this.resourceService.getItems(this.itemsFirstResult, this.itemsMaxResults, order, this.itemsPropertyName,
      codes, projects, this.searchQuery).subscribe(
      (response: ItemResponse) => {
        this.totalItemsCount = response.totalCount;
        for (let item of response.items) {
          if (this.allProjects && this.allProjects.length > 0) {
            item.lineOfResearch = this.projectToResearchLine(item.project);
          }
        }
        this.filteredItemsSource.next(response.items);
        this.loadingItems = "complete";
        let t2 = new Date();
        console.info(`Found ${response.totalCount} items. (Took ${t2.getTime() - t1.getTime()} ms.)`);
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

  orderFlagToOrderName(order: number){
    return order == 1 ? "asc" : "desc";
  }

  clearErrorSearchMessage(){
    this.searchErrorMessageSource.next('');
  }

  selectAllItems(selectAll: boolean){
    if(selectAll){
      let firstResult = 0;
      let selectedConceptCodes = DataService.treeConceptCodes(this.selectedTreeNode);
      let codes = Array.from(selectedConceptCodes);
      let projects = this.getProjectsForSelectedResearchLines();

      this.resourceService.getItems(firstResult, null, null, null,
        codes, projects, this.searchQuery).subscribe(
        (response: ItemResponse) => {
          this.itemsSelectionSource.next(response.items);
        },
        err => {
          if (err != String(undefined)) {
            this.searchErrorMessageSource.next(err);
          }
          console.error(err);
        }
      );
    } else {
      this.clearItemsSelection();
    }
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
    this.clearAllFilters();
  }

  filterOnResearchLines(selectedResearchLines) {
    this.projects.length = 0;
    this.selectedResearchLines = selectedResearchLines;
    this.clearItemsSelection();
    this.resetTableToTheFirstPage();
    this.fetchItems();
    this.getUniqueProjects();
  }

  filterOnProjects(selectedProjects) {
    this.linesOfResearch.length = 0;
    this.selectedProjects = selectedProjects;
    this.clearItemsSelection();
    this.resetTableToTheFirstPage();
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
    this.resetTableToTheFirstPage();
    this.setTextFilterInput('');
    this.clearItemsSelection();
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
    this.allItemsSelected = false;
    this.itemsSelectionSource.next([]);
  }

  resetTableToTheFirstPage() {
    this.itemsFirstResult = 0;
  }

  setTextFilterInput(text: string) {
    this.textFilterInputSource.next(text);
  }

  setSearchQuery(query: Object) {
    this.searchQuery = query;
    this.clearItemsSelection();
    this.resetTableToTheFirstPage();
    this.fetchItems();
    this.fetchFilters();
  }

  private getUniqueProjects() {
    this.allProjects.forEach(ap => {
      if (!this.projects.find(p => p.value == ap.name)){
        if (!this.selectedResearchLines.length) {
          this.projects.push({label: ap.name, value: ap.name});
        } else {
          if (this.selectedResearchLines.includes(ap.lineOfResearch)) {
            this.projects.push({label: ap.name, value: ap.name});
          }
        }
      }
    });
  }

  private static compareSelectItems(a: SelectItem, b: SelectItem) {
    if (a.value < b.value) {
      return -1;
    } else if (a.value > b.value) {
      return 1;
    } else {
      return 0;
    }
  }

  private sortLinesOfResearch() {
    this.linesOfResearch.sort(DataService.compareSelectItems);
  }

  private getUniqueLinesOfResearch() {
    if (!this.selectedProjects.length) {
      this.allProjects.forEach(p => {
        if(!this.linesOfResearch.find(l=> l.value == p.lineOfResearch)) {
          this.linesOfResearch.push({label: p.lineOfResearch, value: p.lineOfResearch});
        }
      });
    } else {
      this.selectedProjects.forEach(p => {
        let researchLine = this.allProjects.find(ap => ap.name == p).lineOfResearch;
        if(!this.linesOfResearch.find(l=> l.value == researchLine)) {
          this.linesOfResearch.push({label: researchLine, value: researchLine});
        }
      });
    }
    this.sortLinesOfResearch();
  }

  private static collectUnique(element, list: SelectItem[]) {
    let values = list.map(function (a) {
      return a.value;
    });
    if (element && !values.includes(element)) {
      list.push({label: element, value: element} as SelectItem);
    }
  }

  // ------------------------- shopping cart -------------------------


  addToShoppingCart(newItemSelection: Item[]) {
    let count: number = 0;
    let newItems: Item[] = this.shoppingCartItems.getValue();
    let itemNames = newItems.map((item) => item.name);
    for (let item of newItemSelection) {
      if (!itemNames.includes(item.name)) {
        newItems.push(item);
        count++;
      }
    }
    if(count > 0) {
      this.dsMessageService.addInfoMessage("success", "Shopping cart updated!", count + " item(s) added to the cart.")
    } else if(newItemSelection.length > 0) {
      this.dsMessageService.addInfoMessage("info", "No item added", "Item(s) already in the shopping cart.")
    } else {
       this.dsMessageService.addInfoMessage("info", "No item selected", "Select item(s) you want to add to the cart.")
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
