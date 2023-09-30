export class ExpInvModel {
    ExpInvId: number;
    BranchId: number;
    InvTypeId: number;
    VendorId: number;
    VendorName: string;
    TransId: number;
    TransName: number;
    CourierId: number;
    CourierName: string;
    ExpInvNo: string;
    InvDate: Date;
    CompId: number;
    CompanyName: string;
    ExpHeadId: number;
    ExpHeadName: string;
    NoOfBox: number;
    FromDate: Date;
    ToDate: Date;
    isGSTApply: string;
    TaxableAmt: number;
    CGST: number;
    SGST: number;
    TaxId:number;
    GSTType:string;
    TotalAmt: number;
    IsReimbursable: string;
    AddedBy: number;
    Action: string;
    ExpInvStatus:number;
}

export class PaymentModel {
    ExpPaymentId: number;
    ExpInvId: number;
    PaymentDate: string;
    TDS: number;
    PaymentAmt: number;
    PayMode: string;
    PayModeId: number;
    UTRNo: string;
    Remark: string;
    Addedby: string;
    Action: string;
}
export class GSTTypeModel{
    TaxId:number=0;
    GSTType:string='';
    CGST:number=0;
    SGST:number=0;
    AddedBy:string='';
}
