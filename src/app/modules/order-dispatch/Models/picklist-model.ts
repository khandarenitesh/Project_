export class PickistModel {
    Picklistid: number = 0;
    BranchId: number = 0;
    CompId: number = 0;
    PicklistNo: string = '';
    PicklistDate: Date = new Date();
    FromInv: string = '';
    ToInv: string = '';
    // divisionStr: string = '';
    PicklistStatus: number = 0;
    VerifiedBy: number = 0;
    VerifiedDate: Date = new Date();
    AllottedBy: number = 0;
    AllottedDate: Date = new Date();
    ReAllottedBy: number = 0;
    ReAllotedDate: Date = new Date();
    Addedby: string = '';
    AddedOn: Date = new Date();
    LastUpdatedOn: Date = new Date();
    Action: string = '';
    StatusText: string = '';
    RejectReason: string = '';
    IsStockTransfer:number=0;
}
