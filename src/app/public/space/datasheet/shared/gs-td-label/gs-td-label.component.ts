import {Component, Input, OnInit} from "@angular/core";

@Component({
    selector: '[gs-td-label]',
    templateUrl: './gs-td-label.component.html',
    styleUrls: ['./gs-td-label.component.css']
})
export class GsTdLabelComponent implements OnInit {

    @Input() keyValView: any;
    @Input() view: any;
    @Input() orderOffset: any;

    ngOnInit(): void {
    }
}
