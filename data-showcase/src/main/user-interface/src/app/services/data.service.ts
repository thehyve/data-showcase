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
import { Concept } from '../models/concept';
import { CheckboxOption } from '../models/CheckboxOption';

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
  // items available for currently selected node
  private itemsPerNode: Item[] = [];
  // items selected in the itemTable
  private itemsSelectionSource = new Subject<Item[]>();
  public itemsSelection$ = this.itemsSelectionSource.asObservable();
  // items added to the shopping cart
  public shoppingCartItems = new BehaviorSubject<Item[]>([]);

  // global text filter
  private globalFilterSource = new Subject<string>();
  public globalFilter$ = this.globalFilterSource.asObservable();

  private selectedTreeNode: TreeNode = null;
  // selected checkboxes for keywords filter
  private selectedKeywords: string[] = [];
  // selected checkboxes for projects filter
  private selectedProjects: string[] = [];
  // selected checkboxes for research lines filter
  private selectedResearchLines: string[] = [];

  // list of keywords available for current item list
  private keywords: CheckboxOption[] = [];
  // list of project names available for current item list
  private projects: CheckboxOption[] = [];
  // list of research lines available for current item list
  private researchLines: CheckboxOption[] = [];

  // list of all concepts
  private concepts: Concept[] = [];

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
    this.updateConcepts();
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
    if (node.children) {
      newNode.children = node.children.filter(value => !(value.accumulativeItemCount == 0 && value.nodeType == "Domain" ));
    }
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

  updateConcepts() {
    this.resourceService.getConcepts()
      .subscribe((concepts: Concept[]) => {
          this.concepts = concepts;
          let keywords: string[] = [].concat.apply([], this.concepts.map((concept: Concept) => concept.keywords));
          this.keywords.length = 0;
          keywords.forEach(keyword => this.keywords.push({label: keyword, value: keyword} as CheckboxOption));
          console.info(`Loaded ${this.keywords.length} key words.`);
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
    this.loadingItems = true;
    this.itemsPerNode.length = 0;
    this.items.length = 0;
    this.resourceService.getItems()
      .subscribe(
        (items: Item[]) => {
          for (let item of items) {
            if (this.availableProjects) {
              item['researchLine'] = this.availableProjects.find(p => p.name == item['project']).lineOfResearch;
            }

            this.itemsPerNode.push(item);
            this.items.push(item);
          }
          this.setFilteredItems();
          this.getUniqueFilterValues();
            console.info(`Loaded ${items.length} items ...`);
          this.loadingItems = false;
        },
        err => console.error(err)
      );
  }

  static treeConceptCodes(treeNode: TreeNode) : Set<string> {
    if (treeNode == null) {
      return new Set();
    }
    let conceptCodes = new Set();
    if (treeNode.concept != null) {
      conceptCodes.add(treeNode.concept.conceptCode);
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
    this.clearItemsSelection();
    this.clearFilterValues();
    if (this.selectedTreeNode == null) {
      this.itemsPerNode.forEach(item => this.items.push(item))
    } else {
      let selectedConceptCodes = DataService.treeConceptCodes(this.selectedTreeNode);
      let nodeItems = this.itemsPerNode.filter(item => selectedConceptCodes.has(item.concept));
      nodeItems.forEach(item => this.items.push(item))
    }
    this.setFilteredItems();
    this.getUniqueFilterValues();
  }

  updateProjectsForResearchLines() {
    this.selectedProjects.length = 0;
    this.setFilteredItems();
    this.projects.length = 0;
    for (let item of this.filteredItems) {
      DataService.collectUnique(item.project, this.projects);
    }
  }

  updateFilterValues(selectedKeywords: string[], selectedProjects: string[], selectedResearchLines: string[]) {
    this.selectedKeywords = selectedKeywords;
    this.selectedProjects = selectedProjects;
    this.selectedResearchLines = selectedResearchLines;
    this.setFilteredItems();
  }

  clearFilterValues() {
    this.selectedKeywords.length = 0;
    this.selectedResearchLines.length = 0;
    this.selectedProjects.length = 0;
  }

  clearItemsSelection() {
    this.itemsSelectionSource.next(null);
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

  getResearchLines() {
    return this.researchLines;
  }

  findConceptCodesByKeywords(keywords: string[]): Set<string> {
    return new Set(this.concepts.filter(concept =>
      concept.keywords != null && concept.keywords.some((keyword: string) =>
        keywords.includes(keyword))
    ).map(concept => concept.conceptCode));
  }

  static intersection<T>(a: Set<T>, b: Set<T>): Set<T> {
    return new Set(
        Array.from(a).filter(item => b.has(item)));
  }

  getItemFilter(): (Item) => boolean {
      let conceptCodesFromTree = DataService.treeConceptCodes(this.selectedTreeNode);
      let conceptCodesFromKeywords = this.findConceptCodesByKeywords(this.selectedKeywords);
      let selectedConceptCodes: Set<string>;
      if (conceptCodesFromKeywords.size > 0 && conceptCodesFromTree.size > 0) {
          selectedConceptCodes = DataService.intersection(conceptCodesFromTree, conceptCodesFromKeywords);
      } else if (conceptCodesFromKeywords.size > 0) {
          selectedConceptCodes = conceptCodesFromKeywords;
      } else {
          selectedConceptCodes = conceptCodesFromTree;
      }

      return (item: Item) => {
          return ((selectedConceptCodes.size == 0 || selectedConceptCodes.has(item.concept))
              && (this.selectedProjects.length == 0 || this.selectedProjects.includes(item.project))
              && (this.selectedResearchLines.length == 0 || this.selectedResearchLines.includes(item.researchLine))
          );
      };
  }

  setFilteredItems() {
    let t1 = new Date();
    console.debug(`Filtering items ...`);
    this.filteredItems.length = 0;
    let filter = this.getItemFilter();
    this.items.forEach(item => {
      if (filter(item)) {
        this.filteredItems.push(item)
      }
    });
    let t2 = new Date();
    console.info(`Selected ${this.filteredItems.length} / ${this.items.length} items. (Took ${t2.getTime() - t1.getTime()} ms.)`);
  }

  setGlobalFilter(globalFilter: string) {
    this.globalFilterSource.next(globalFilter);
  }

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

  private getUniqueFilterValues() {
    this.projects.length = 0;
    this.researchLines.length = 0;

    for (let item of this.items) {
      DataService.collectUnique(item.project, this.projects);
      DataService.collectUnique(item.researchLine, this.researchLines);
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

  displayPopup(item: Item) {
    this.resourceService.getItem(item.id).subscribe(extendedItem =>
      this.itemSummaryVisibleSource.next(extendedItem)
    )
  }

  setEnvironment() {
    this.resourceService.getEnvironment().subscribe(
      (env: Environment) => {
        this.environmentSource.next(env);
      });
  }

}
