// Reimbursement Invoice
export class ReimbursementInvoiceAddEditModel {
    ReimId: number = 0;
    BranchId: number = 0;
    CompanyId: number = 0;
    CompanyName: string = "";
    InvDate: Date = new Date();
    ExpInvIdstr: string = "";
    TaxableAmt: number = 0;
    CGST: number = 0;
    SGST: number = 0;
    TotalAmt: number = 0;
    ExpeHeadId: number = 0;
    pkId: number = 0;
    MasterName: string = "";
    Remark: string = "";
    Addedby: string = "";
    Action: string = "";
    TDS:number=0;
}

// Reimbursement - Payment
export class ReimbursementPaymentAddEditModel {
    ReimPaymentId: number = 0;
    ReimId: number = 0;
    InvNo: string = "";
    PaymentDate: Date = new Date();
    TDS: number = 0;
    PaymentAmt: number = 0;
    PaymentMode: string = "";
    PaymentModeId: number = 0;
    UTRNo : number = 0;
    Remark: string = "";
    Addedby: string = "";
    Action: string = "";
}

// Get Payment Mode
export class PaymentModeModel {
    pkId: number = 0;
    MasterName: string = "";
}