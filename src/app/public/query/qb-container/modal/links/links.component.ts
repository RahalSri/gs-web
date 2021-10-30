import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";

@Component({
    selector: 'links',
    templateUrl: './links.component.html',
    styleUrls: ['./links.component.scss']
})
export class LinksComponet {

    @Input() model: any; //localPropertyValueList //header //hidePublicUrlInput
    @Output() loadEndNode = new EventEmitter();
    @Output() onLinkTypeChange = new EventEmitter<any>();

    public isPropertyFilterEnabled(dataType: any) {
        if (dataType === 'Boolean' || dataType === 'Timestamp' || dataType === 'Integer')
            return false;
        else
            return true;
    }

    public handleClose() {
        this.model = undefined;
    }

    public selectEndNode(metEndObj: any) {
        if (!this.isLinkUsedInCanvas(metEndObj)) {
            metEndObj.linktype = this.model.linktype;
            this.loadEndNode.emit(metEndObj);
            this.handleClose();
        }
    }

    public handleMandatoryChanged(value: string) {
        this.model.linktype = value;
    }

    public isAllNodeUsed() {
        var objFound = this.model.endObjList.filter((element: any) => !element.isUsedAlready);
        return (objFound.length > 0 ? false : true);
    }

    public handleOk() {
        this.model?.onOk(this.model.endObjList);
        this.handleClose();
    }

    public isLinkUsedInCanvas(obj: any) {
        const links = this.model.linkDataArray ?? [];
        const nodes = this.model.nodeDataArray;
        const selectedNode = this.model.currentNode
        // var ret;

        const exists = links.filter((link: any) => (link.from === selectedNode.key && link.to === obj.endMetObjGuid)
            || link.to === selectedNode.key && link.from === obj.endMetObjGuid);

        // const isLinkFound = links.filter(link => link.metLinkGuId === obj.metLinkGuId);
        // var sel_guid = selectedNode.key;
        // ret = false; // By default, link is considered not available in canvas
        // if (isLinkFound.length > 0) {// Link is available in canvas
        //     //Check if selected node if part of links found
        //     // var isLinkedToThisNode = $filter('filter')(isLinkFound, { $: sel_guid }, true);
        //     const isLinkedToThisNode = isLinkFound.filter(link => link.$ === sel_guid);

        //     if (typeof isLinkedToThisNode != 'undefined' && isLinkedToThisNode.length > 0) {// Selected node is part of the link
        //         var objInstance = sel_guid.split(":")[0]; // Get object type (remove instance part - :)
        //         isLinkedToThisNode.forEach((link, key) => {// Go through each link
        //             var linkEndNodeType = link.to.split(":")[0];
        //             var linkStartNodeType = link.from.split(":")[0];
        //             ret = false;
        //             if (obj.endMetObjGuid != objInstance) { // If link is not a reflexive link
        //                 //If selected node is the starting node and already made a link with same type of object OR If selected node is the end node and already made a link with same type of object
        //                 if ((link.from == sel_guid && linkEndNodeType == obj.endMetObjGuid) || (link.to == sel_guid && linkStartNodeType == obj.endMetObjGuid)) {
        //                     ret = true; // Mark the link as already used
        //                 }

        //             }
        //             else if (obj.endMetObjGuid == objInstance) { // If link is a reflexive link
        //                 //Check if selected node is a start node (User should be able to continue creating links of same type from end node) 
        //                 //i.e. A - D - A : now right most A should continue creating D links
        //                 if (link.from == sel_guid) {
        //                     ret = true; // Mark the link as already used
        //                 }
        //             }
        //         })
        //     }

        // }

        return exists.length > 0;
    }
}