import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { QueryService } from "src/app/core/service/query.service";

@Component({
    selector: 'attach-view',
    templateUrl: './attach-view.component.html'
})
export class AttachViewComponent implements OnInit {
    query : any;
    attachViewForm: FormGroup = new FormGroup({});
    spaceList: any[] = [];
    loading: boolean = false;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private queryService: QueryService) {
        this.query = data.query;
    }

    ngOnInit(): void {
        this.fetchSpaceList();
        this.attachViewForm = this.createForm();
    }

    fetchSpaceList() {
        // this.queryService.fetchSpaceswithMetaLanguages().subscribe((response: any) => {
        //     if (response != null && response.length > 0) {
        //         this.spaceList = response;
        //     }
        // });
    }

    createForm(): FormGroup {
        return this.formBuilder.group({
            viewType: [null, [Validators.required]],
            space: [null, [Validators.required]],
            view: [null, [Validators.required]]
        });
    }

    changeViewType(){

    }

    spaceChange(event: any){}
}