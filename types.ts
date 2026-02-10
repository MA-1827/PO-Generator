
export interface LineItem {
  id: string;
  description: string;
  qty: number;
  basicCost: number;
  gst: number;
  totalCost: number;
}

export interface POData {
  poNo: string;
  date: string;
  
  vendor: {
    contactPerson: string;
    companyName: string;
    address: string;
    email: string;
    phone: string;
  };
  
  bankDetails: {
    bank: string;
    accountNo: string;
    branch: string;
    ifscCode: string;
  };
  
  otherDetails: {
    panNo: string;
    gstNo: string;
  };
  
  buyer: {
    organization: string;
    address: string;
    contactPerson: string;
    email: string;
    phone: string;
  };
  
  poc: {
    name: string;
    phone: string;
  };
  
  reference: {
    quotationNo: string;
    date: string;
    amount: string;
  };
  
  items: LineItem[];
  
  terms: {
    qualityAssuranceItem: string;
    deliveryTimeline: string;
    complianceQuoteAmount: string;
  };
}
