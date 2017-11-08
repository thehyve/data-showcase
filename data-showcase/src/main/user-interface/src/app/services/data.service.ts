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
import {Concept} from '../models/concept';
import {CheckboxOption} from '../models/CheckboxOption';

type LoadingState = 'loading' | 'complete';

@Injectable()
export class DataService {

  // the variable that holds the entire tree structure
  public treeNodes: TreeNodeLib[] = [];
  // the status indicating the when the tree is being loaded or finished loading
  public loadingTreeNodes: LoadingState = 'complete';

  // list of all items
  private items: Item[] = [];
  // the flag indicating if Items are still being loaded
  public loadingItems: boolean = false;
  // filtered list of items based on selected node and selected checkbox filters
  public filteredItems: Item[] = [];
  // items selected in the itemTable
  private itemsSelectionSource = new Subject<Item[]>();
  public itemsSelection$ = this.itemsSelectionSource.asObservable();
  // items added to the shopping cart
  public shoppingCartItems = new BehaviorSubject<Item[]>([]);

  // text filter input
  private textFilterInputSource = new Subject<string>();
  public textFilterInput$ = this.textFilterInputSource.asObservable();

  // JSON search query
  private jsonSearchQuery: JSON = null;

  // trigger checkboxFilters reload
  private rerenderCheckboxFiltersSource = new Subject<boolean>();
  public rerenderCheckboxFilters$ = this.rerenderCheckboxFiltersSource.asObservable();

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

  // item summary popup visibility
  private itemSummaryVisibleSource = new Subject<Item>();
  public itemSummaryVisible$ = this.itemSummaryVisibleSource.asObservable();

  // NTR logo
  private ntrLogoUrlSummary = new Subject<string>();
  public ntrLogoUrl$ = this.ntrLogoUrlSummary.asObservable();

  // VU logo
  private vuLogoUrlSummary = new Subject<string>();
  public vuLogoUrl$ = this.vuLogoUrlSummary.asObservable();

  // item summary popup visibility
  private environmentSource = new Subject<Environment>();
  public environment$ = this.environmentSource.asObservable();

  constructor(private resourceService: ResourceService) {
    this.fetchAllProjects();
    this.fetchAllTreeNodes();
    this.fetchItems();
    this.setEnvironment();
  }

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

  fetchAllProjects() {
    this.resourceService.getProjects()
      .subscribe(
        (projects: Project[]) => {
          this.allProjects = projects;
        },
        err => console.error(err)
      );
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

  fetchItems() {
    let t1 = new Date();
    console.debug(`Fetching items ...`);
    this.loadingItems = true;
    this.filteredItems.length = 0;
    this.items.length = 0;

    let selectedConceptCodes = DataService.treeConceptCodes(this.selectedTreeNode);
    let codes = Array.from(selectedConceptCodes);
    let projects = this.getProjectsForSelectedResearchLines();
    let searchQuery = JSON.parse(JSON.stringify(this.jsonSearchQuery));

    this.resourceService.getItems(
      codes, projects, searchQuery).subscribe(
      (items: Item[]) => {
        for (let item of items) {
          if (this.allProjects) {
            item['lineOfResearch'] = this.allProjects.find(p => p.name == item['project']).lineOfResearch;
          }
          this.filteredItems.push(item);
          this.items.push(item);
        }
        this.getUniqueFilterValues();
      },
      err => console.error(err)
    );
    let t2 = new Date();
    console.info(`Found ${this.items.length} items. (Took ${t2.getTime() - t1.getTime()} ms.)`);
    this.loadingItems = false;
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

  selectTreeNode(treeNode: TreeNode) {
    this.selectedTreeNode = treeNode;
    this.updateItemTable();
  }

  updateItemTable() {
    this.items.length = 0;
    this.linesOfResearch.length =0;
    this.projects.length = 0;
    this.clearItemsSelection();
    this.clearCheckboxFilterValues();
    this.fetchItems();
  }

  filterOnResearchLines(selectedResearchLines) {
    this.projects.length = 0;
    this.selectedResearchLines = selectedResearchLines;
    this.clearItemsSelection();
    this.fetchItems();
  }

  filterOnProjects(selectedProjects) {
    this.linesOfResearch.length = 0;
    this.selectedProjects = selectedProjects;
    this.clearItemsSelection();
    this.fetchItems();
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
    this.setTextFilterInput(null);
    this.clearCheckboxFilterValues();
    this.rerenderCheckboxFiltersSource.next(true);
  }

  clearCheckboxFilterValues() {
    this.selectedResearchLines.length = 0;
    this.selectedProjects.length = 0;
  }

  clearItemsSelection() {
    this.itemsSelectionSource.next(null);
  }

  setTextFilterInput(text: string) {
    this.textFilterInputSource.next(text);
  }

  setJsonSearchQuery(query: JSON) {
    this.jsonSearchQuery = query;
    this.fetchItems();
  }

  private getUniqueFilterValues() {
    if (!this.projects.length && !this.selectedResearchLines.length) {
      for (let item of this.filteredItems) {
        DataService.collectUnique(item.project, this.projects);
        DataService.collectUnique(item.lineOfResearch, this.linesOfResearch);
      }
    } else if (!this.linesOfResearch.length) {
      for (let item of this.filteredItems) {
        DataService.collectUnique(item.lineOfResearch, this.linesOfResearch);
      }
    } else if (!this.projects.length) {
      for (let item of this.filteredItems) {
        DataService.collectUnique(item.project, this.projects);
      }
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


  // ------------------------- shopping cart -------------------------

  addToShoppingCart(newItemSelection: Item[]) {
    let newItems: Item[] = this.shoppingCartItems.getValue();
    for (let item of newItemSelection) {
      if (!newItems.includes(item)) {
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
