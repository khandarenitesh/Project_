export class SendToModel {
    CNFId: number = 0;
    CNFCode: string = "";
    CNFName: string = "";
}

export class AddStockTransferModel {
    InvId :number = 0;
    InvNo:number =0;
    CNFCode : string ="";
    CNFName :string="";
    InvCreatedDate : Date = new Date();
    BranchId: number = 0;
    CompId: number = 0;
    StkTransInvNo: string = "";
    InvDate: Date = new Date();
    SendToCNFId: number = 0;
    IsStockTransfer: number = 0;
    Action: string = "";
    // Addedby: number =0;
    Addedby: string = '';
    CNFId :number=0;
}