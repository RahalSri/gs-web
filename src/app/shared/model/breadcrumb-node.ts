export class BreadcrumbNode {
    public displayText: string;
    public url: string;

    public viewGuid: string;
    public objectGuid: string;
    public spaceGuid: string;

    public constructor(
        displayText: string,
        url: string,
        viewGuid: string,
        objectGuid: string,
        spaceId: string
    ) {
        this.displayText = displayText;
        this.url = url;
        this.viewGuid = viewGuid;
        this.objectGuid = objectGuid;
        this.spaceGuid = spaceId;
    }
}