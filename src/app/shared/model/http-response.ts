export interface HttpResponse {
  code: number;
  success: boolean;
  data: any;
  singleData: any;
  message: string;
  viewGuid: string;
}
