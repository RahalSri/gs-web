import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { BreadcrumbNode } from "src/app/shared/model/breadcrumb-node";

@Injectable({
    providedIn: 'root',
})
export class BreadcrumbStoreService {

    private static _eventSubject = new BehaviorSubject<BreadcrumbNode[]>([]);

    public static PAGE_CONSTS = {
        QUERY_LIST_PAGE: "Query List",
        GLOBAL_SEARCH: "Search Results",
        QUERY_BUILDER_LIST_GUID: "qblist",
        GLOBAL_SEARCH_GUID: "global-search"
    }

    public push(
        displayText: string,
        url: string,
        viewGuid: string,
        objectGuid: string,
        spaceId: string
    ) {
        BreadcrumbStoreService.push(displayText, url, viewGuid, objectGuid, spaceId);
    }

    public pushToOrigin(
        displayText: string,
        url: string,
        viewGuid: string,
        objectGuid: string,
        spaceId: string
    ) {
        BreadcrumbStoreService.pushToOrigin(displayText, url, viewGuid, objectGuid, spaceId);
    }

    public static push(
        displayText: string,
        url: string,
        viewGuid: string,
        objectGuid: string,
        spaceId: string) {

        const node = new BreadcrumbNode(displayText, url, viewGuid, objectGuid, spaceId);
        let stack = BreadcrumbStoreService.getStack();
        const matchIndex = stack.findIndex((ele: any) => BreadcrumbStoreService.matchNodes(node, ele));

        if (matchIndex < 0) {
            stack.push(node);
        } else {
            stack = stack.slice(0, matchIndex + 1);
        }

        const displayNodes = BreadcrumbStoreService.displayNodes(stack);
        this.setStack(stack);
        BreadcrumbStoreService._eventSubject.next(displayNodes);
    }

    public static pushToOrigin(displayText: string,
        url: string,
        viewGuid: string,
        objectGuid: string,
        spaceId: string) {
        const node = new BreadcrumbNode(displayText, url, viewGuid, objectGuid, spaceId);
        const stack = BreadcrumbStoreService.getStack();

        const home = stack.length > 0 ? stack[0] : new BreadcrumbNode('Origin', window.location.href, '', '', '');
        const newStack = [home, node];
        BreadcrumbStoreService.setStack(newStack);

        const displayNodes = BreadcrumbStoreService.displayNodes(newStack);
        BreadcrumbStoreService._eventSubject.next(displayNodes);
    }

    public static reset() {
        const home = new BreadcrumbNode('Origin', window.location.href, '', '', '');
        const stack = [home];
        BreadcrumbStoreService.setStack(stack);

        const displayNodes = BreadcrumbStoreService.displayNodes(stack);
        BreadcrumbStoreService._eventSubject.next(displayNodes);
    }

    private static matchNodes(ele1: BreadcrumbNode, ele2: BreadcrumbNode) {
        return ele1.objectGuid === ele2.objectGuid && ele1.viewGuid === ele2.viewGuid
            || ele1.url === ele2.url;
    }

    private static displayNodes(nodes: BreadcrumbNode[]) {
        if (nodes.length > 5) {
            const middleNode = new BreadcrumbNode('...', '', '', '', '');
            const fistSection = nodes.slice(0, 3);
            const lastSection = nodes.slice(nodes.length - 2, nodes.length - 1);
            return [...fistSection, middleNode, ...lastSection];
        }
        return nodes.slice(0, -1);
    }

    public static get eventListener() {
        return BreadcrumbStoreService._eventSubject;
    }

    public get eventListener() {
        return BreadcrumbStoreService._eventSubject;
    }

    private static getStack() {
        const stackStr = sessionStorage.getItem('kipstor-breadcrumbs') ?? '[]';
        try {
            return JSON.parse(stackStr);
        } catch (e) {
            return [];
        }
    }

    private static setStack(stack: any) {
        const stackStr = JSON.stringify(stack);
        sessionStorage.setItem('kipstor-breadcrumbs', stackStr);
    }
}
