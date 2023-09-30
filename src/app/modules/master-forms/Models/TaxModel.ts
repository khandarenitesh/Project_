export class TaxModel{
  TaxId :number=0;
  GSTType :string='';
  CGST:number=0;
  SGST:number=0;
  AddedBy:number =0;
  Action :string='';
  IsActiveStatus: string = '';
  Addedby: string = '';
  AddedOn: Date = new Date();
  LastUpdatedOn: Date = new Date();
}
