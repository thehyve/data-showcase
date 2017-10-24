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
  // items available for currently selected node
  private itemsPerNode: Item[] = [];
  // items added to the shopping cart
  public shoppingCartItems = new BehaviorSubject<Item[]>([]);

  // global text filter
  private globalFilterSource = new Subject<string>();
  public globalFilter$ = this.globalFilterSource.asObservable();

  // selected checkboxes for keywords filter
  private selectedKeywords: string[] = [];
  // selected checkboxes for projects filter
  private selectedProjects: string[] = [];
  // selected checkboxes for research lines filter
  private selectedResearchLines: string[] = [];

  // list of keywords available for current item list
  private keywords: string[] = [];
  // list of keywords available for current item list
  private projects: string[] = [];
  // list of keywords available for current item list
  private researchLines: string[] = [];

  // list of all projects
  private availableProjects: Project[] = [];

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
    this.updateAvailableProjects();
    this.updateNodes();
    this.updateItems();
    this.setFilteredItems();
    this.setEnvironment();
  }

  loadLogo(type: string) {
    this.resourceService.getLogo(type)
      .subscribe(
        (blobContent) => {
          let urlCreator = window.URL;
          if (type == "NTR") {
            this.ntrLogoUrlSummary.next(urlCreator.createObjectURL(blobContent));
          } else {
            this.vuLogoUrlSummary.next(urlCreator.createObjectURL(blobContent));
          }
        },
        err => console.error(err)
      );
  }

  private processTreeNodes(nodes: TreeNode[]): TreeNodeLib[] {
    let treeNodes: TreeNodeLib[] = [];
    for (let node of nodes) {
      if (!(node.accumulativeItemCount == 0 && node.nodeType == "Domain" )) {
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
    newNode.children = node.children.filter(value => !(value.accumulativeItemCount == 0 && value.nodeType == "Domain" ));
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
    this.itemsPerNode.length = 0;
    this.items.length = 0;
    this.resourceService.getItems()
      .subscribe(
        (items: Item[]) => {
          console.log('item loading');
          for (let item of items) {
            if (this.availableProjects) {
              item['researchLine'] = this.availableProjects.find(p => p.name == item['project']).lineOfResearch;
            }

            this.itemsPerNode.push(item);
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
    let nodeItems = treeNode ? this.itemsPerNode.filter(item => item.itemPath.startsWith(treeNode.path))
      : this.itemsPerNode;
    for (let node of nodeItems) {
      this.items.push(node);
    }
    this.setFilteredItems();
    this.getUniqueFilterValues();
  }

  updateProjectsForResearchLines() {
    this.selectedProjects.length = 0;
    this.setFilteredItems();
    this.projects.length = 0;
    for (let item of this.filteredItems) {
      DataService.collectUnique(item['project'], this.projects);
    }
  }

  updateFilterValues(selectedKeywords: string[], selectedProjects: string[], selectedResearchLines: string[]) {
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
      if ((this.selectedKeywords.length == 0 || item['keywords'].some(k => this.selectedKeywords.includes(k)))
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

  addToShoppingCart(newItemSelection: Item[]) {
    let items: Item[] = this.shoppingCartItems.getValue();
    let newItems: Item[] = items;
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

  private getUniqueFilterValues() {
    this.keywords.length = 0;
    this.projects.length = 0;
    this.researchLines.length = 0;

    for (let item of this.items) {
      for (let keyword of item['keywords']) {
        DataService.collectUnique(keyword, this.keywords);
      }
      DataService.collectUnique(item['project'], this.projects);
      DataService.collectUnique(item['researchLine'], this.researchLines);
    }
  }

  private static collectUnique(element, list) {
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

  setEnvironment() {
    this.resourceService.getEnvironment().subscribe(
      (env: Environment) => {
        this.environmentSource.next(env);
      });
  }

}
