export type Page = 'dashboard' | 'branches' | 'fleet' | 'drivers' | 'shipments' | 'billing' | 'loading_sheets';

export interface Branch {
  id: string;
  name: string;
  city: string;
  state: string;
  pincode: string;
  type: 'Delivery &amp; Pickup' | 'Delivery Only';
  contact: string;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  model: string;
  type: '20ft Container' | '40ft Container' | 'Open Body' | 'Tanker';
  driverId: string | null;
  status: 'On Road' | 'Available' | 'Maintenance';
  permitExpiry: string;
  maintenanceDue: string;
}

export interface Driver {
  id:string;
  name: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  vehicleId: string | null;
  salary: number;
  photoUrl?: string;
  licensePhotoUrl?: string;
  aadharPhotoUrls?: string[];
  otherDocumentUrls?: string[];
}

export interface Customer {
  name: string;
  address: string;
  gst?: string;
  phone?: string;
}

export interface Shipment {
  id: string; // LR Number
  date: string;
  origin: string;
  destination: string;
  consignor: Customer;
  consignee: Customer;
  packages: number;
  weight: number;
  value: number;
  status: 'Pending' | 'In Transit' | 'Delivered' | 'Cancelled';
  vehicleId: string | null;
  billId: string | null;
  loadingSheetId: string | null;
}

export interface BillArticle {
  quantity: number;
  packageType: string;
  details: string;
  amount: number;
}

export interface BillCharges {
  freight: number;
  surcharge: number;
  hamali: number;
  doorDelivery: number;
  other: number;
}

export interface Bill {
  id: string;
  shipmentId: string;
  date: string;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  chargeStatus: 'Paid' | 'To Pay' | 'TBB';
  gstPaidBy: 'consignor' | 'consignee' | 'transport';
  articles: BillArticle[];
  charges: BillCharges;
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
}


export interface LoadingSheet {
  id: string;
  date: string;
  vehicleId: string;
  driverId: string;
  branchId: string;
  shipmentIds: string[];
}
