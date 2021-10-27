import { Injectable } from "@angular/core";

//Temp Class to resolve incomplete routing migration in hybrid app
@Injectable(
    { providedIn: 'root', }
)
export class ViewService {
    datViewSupGuId?: string;
    spcSupGuId?: string;
    searchText?: string;
    viewType?: string;
    queryId?: string;
}