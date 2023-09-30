export class ImportDynami {
    BranchId: number = 0;
    BranchName: string = '';
    CompanyId: number = 0
    CompanyCode: string = '';
    CompanyName: string = '';
    ImportType : string ='';
    ImportId :number = 0;
    ImpId:number = 0;
}

export class FieldNameList
{
    BranchId: number = 0;
    CompId: number = 0
    FieldName : string = '';
    ColumnDatatype : string = '';
    ImportId :number = 0;
    ImpFor: string = '';
    ImpId : number = 0

}

export class ImportDynamicSaveModel
{
    pkId: number = 0;
    BranchId: number = 0;
    CompId: number = 0;
    BranchName:string ='';
    CompanyName:string ='';
    ImpFor : string = '';
    FieldName : string = '';
    ExcelColName : string = '';
    ColumnDatatype : string = '';
    Addedby : number = 0;
    Action : string = '';
}


