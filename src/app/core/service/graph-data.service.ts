import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class GraphDataService {

  private getChildren(tree: Array<any>, parentId: string, startNode: string, relationships: Array<any>, nodeMap: any) {
    const relsStartingWithStartNode = relationships.filter(rel => rel.startNode === startNode);

    for (let rel of relsStartingWithStartNode) {
      const endNode = nodeMap[rel.endNode];
      if (endNode.labels.includes('DATobject')) {
        if (tree.findIndex(node => node.key === rel.endNode) < 0) {
          tree.push({
            key: rel.endNode,
            title: nodeMap[rel.endNode].additionalInfo.dispalyTitle,
            parent: parentId,
            dataSheet: nodeMap[rel.endNode].additionalInfo.defaultDataSheetGuid,
            supGuid: nodeMap[rel.endNode].properties.SUPguId
          });
        }
        this.getChildren(tree, rel.endNode, rel.endNode, relationships, nodeMap);
      } else {
        this.getChildren(tree, parentId, rel.endNode, relationships, nodeMap);
      }
    }
  }

  public convertToHLData(graph: any) {
    const nodes: Array<any> = graph.nodes;
    const relationships: Array<any> = graph.relationships;
    const parentNodes: Array<any> = graph.parentNodes;

    const nodeMap = {};
    nodes.forEach(nod => {
      nodeMap[nod.id] = nod;
    });

    const newTree = [];
    for (let parent of parentNodes) {
      newTree.push({
        key: parent,
        title: nodeMap[parent].additionalInfo.dispalyTitle,
        parent: undefined,
        dataSheet: nodeMap[parent].additionalInfo.defaultDataSheetGuid,
        supGuid: nodeMap[parent].properties.SUPguId
      })
      this.getChildren(newTree, parent, parent, relationships, nodeMap);
    }
    return newTree;
  }

}
