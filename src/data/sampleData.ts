import { Branch, Vehicle, Driver, Shipment, Bill, LoadingSheet } from '@/lib/types';

export const sampleBranches: Branch[] = [
  { id: 'B001', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', type: 'Delivery & Pickup', contact: '022-23456789' },
  { id: 'B002', name: 'Delhi Hub', city: 'New Delhi', state: 'Delhi', pincode: '110001', type: 'Delivery & Pickup', contact: '011-29876543' },
  { id: 'B003', name: 'Bangalore South', city: 'Bangalore', state: 'Karnataka', pincode: '560001', type: 'Delivery Only', contact: '080-21234567' },
  { id: 'B004', name: 'Chennai Port', city: 'Chennai', state: 'Tamil Nadu', pincode: '600001', type: 'Delivery & Pickup', contact: '044-27654321' },
  { id: 'B005', name: 'Kolkata East', city: 'Kolkata', state: 'West Bengal', pincode: '700001', type: 'Delivery Only', contact: '033-25432198' },
  { id: 'B006', name: 'Pune Hub', city: 'Pune', state: 'Maharashtra', pincode: '411001', type: 'Delivery & Pickup', contact: '020-29876543' },
];

export const sampleDrivers: Driver[] = [
  { id: 'D01', name: 'Ramesh Kumar', phone: '9876543210', licenseNumber: 'DL1420200012345', licenseExpiry: '2028-10-15', vehicleId: 'V001', salary: 35000 },
  { id: 'D02', name: 'Suresh Singh', phone: '9876543211', licenseNumber: 'MH0120210054321', licenseExpiry: '2027-05-20', vehicleId: 'V002', salary: 40000 },
  { id: 'D03', name: 'Amit Patel', phone: '9876543212', licenseNumber: 'GJ0520190098765', licenseExpiry: '2029-01-30', vehicleId: 'V003', salary: 38000 },
  { id: 'D04', name: 'Vijay Sharma', phone: '9876543213', licenseNumber: 'RJ1420220011223', licenseExpiry: '2026-11-22', vehicleId: 'V004', salary: 42000 },
  { id: 'D05', name: 'Anil Yadav', phone: '9876543214', licenseNumber: 'UP7820180044556', licenseExpiry: '2028-08-01', vehicleId: null, salary: 32000 },
  { id: 'D06', name: 'Sunil Gupta', phone: '9876543215', licenseNumber: 'PB0220230078901', licenseExpiry: '2029-03-12', vehicleId: 'V006', salary: 36000 },
  { id: 'D07', name: 'Manoj Tiwari', phone: '9876543216', licenseNumber: 'BR0120220023456', licenseExpiry: '2027-09-05', vehicleId: 'V007', salary: 39000 },
  { id: 'D08', name: 'Rajesh Meena', phone: '9876543217', licenseNumber: 'RJ2720210087654', licenseExpiry: '2026-07-18', vehicleId: null, salary: 33000 },
  { id: 'D09', name: 'Deepak Verma', phone: '9876543218', licenseNumber: 'HR2620200034567', licenseExpiry: '2028-12-25', vehicleId: 'V008', salary: 41000 },
  { id: 'D10', name: 'Prakash Reddy', phone: '9876543219', licenseNumber: 'AP0920190045678', licenseExpiry: '2029-06-10', vehicleId: 'V009', salary: 43000 },
  { id: 'D11', name: 'Kiran Desai', phone: '9876543220', licenseNumber: 'KA1920240056789', licenseExpiry: '2030-02-14', vehicleId: 'V010', salary: 37500 },
  { id: 'D12', name: 'Naveen Jain', phone: '9876543221', licenseNumber: 'TN0720230067890', licenseExpiry: '2028-04-30', vehicleId: null, salary: 34500 },
  { id: 'D13', name: 'Girish Nair', phone: '9876543222', licenseNumber: 'KL0120220078901', licenseExpiry: '2027-10-01', vehicleId: 'V011', salary: 39500 },
  { id: 'D14', name: 'Harish Rawat', phone: '9876543223', licenseNumber: 'UK0720210089012', licenseExpiry: '2026-08-19', vehicleId: 'V012', salary: 41500 },
  { id: 'D15', name: 'Imran Khan', phone: '9876543224', licenseNumber: 'MP0920200090123', licenseExpiry: '2029-11-07', vehicleId: 'V013', salary: 38500 },
  { id: 'D16', name: 'Javed Akhtar', phone: '9876543225', licenseNumber: 'WB1120190012345', licenseExpiry: '2028-01-15', vehicleId: null, salary: 35500 },
  { id: 'D17', name: 'Karthik Murali', phone: '9876543226', licenseNumber: 'KA0320230023456', licenseExpiry: '2029-09-22', vehicleId: 'V014', salary: 42500 },
  { id: 'D18', name: 'Lalit Modi', phone: '9876543227', licenseNumber: 'DL0320220034567', licenseExpiry: '2027-07-03', vehicleId: 'V015', salary: 44000 },
  { id: 'D19', name: 'Mahesh Babu', phone: '9876543228', licenseNumber: 'TS0820210045678', licenseExpiry: '2026-05-11', vehicleId: null, salary: 36500 },
  { id: 'D20', name: 'Nitin Gadkari', phone: '9876543229', licenseNumber: 'MH3120200056789', licenseExpiry: '2028-06-28', vehicleId: 'V016', salary: 45000 },
  { id: 'D21', name: 'Omar Abdullah', phone: '9876543230', licenseNumber: 'JK0120190067890', licenseExpiry: '2029-04-18', vehicleId: 'V017', salary: 40500 },
  { id: 'D22', name: 'Pankaj Tripathi', phone: '9876543231', licenseNumber: 'BR2620240078901', licenseExpiry: '2030-03-21', vehicleId: 'V018', salary: 37000 },
  { id: 'D23', name: 'Qadir Ali', phone: '9876543232', licenseNumber: 'UP3220230089012', licenseExpiry: '2028-09-14', vehicleId: null, salary: 34000 },
  { id: 'D24', name: 'Rahul Dravid', phone: '9876543233', licenseNumber: 'KA0520220090123', licenseExpiry: '2027-12-01', vehicleId: 'V019', salary: 46000 },
  { id: 'D25', name: 'Sachin Tendulkar', phone: '9876543234', licenseNumber: 'MH0220210012345', licenseExpiry: '2026-10-10', vehicleId: 'V020', salary: 50000 },
];

export const sampleVehicles: Vehicle[] = [
  { id: 'V001', registrationNumber: 'MH 01 AB 1234', type: '20ft Container', driverId: 'D01', status: 'On Road', permitExpiry: '2026-03-31', maintenanceDue: '2025-09-10' },
  { id: 'V002', registrationNumber: 'DL 1C CD 5678', type: '40ft Container', driverId: 'D02', status: 'On Road', permitExpiry: '2025-12-31', maintenanceDue: '2025-08-15' },
  { id: 'V003', registrationNumber: 'KA 05 EF 9012', type: 'Open Body', driverId: 'D03', status: 'Available', permitExpiry: '2027-06-30', maintenanceDue: '2025-11-01' },
  { id: 'V004', registrationNumber: 'TN 22 GH 3456', type: 'Tanker', driverId: 'D04', status: 'Maintenance', permitExpiry: '2026-01-15', maintenanceDue: '2025-07-25' },
  { id: 'V005', registrationNumber: 'WB 11 IJ 7890', type: '20ft Container', driverId: null, status: 'Available', permitExpiry: '2028-02-28', maintenanceDue: '2026-01-20' },
  { id: 'V006', registrationNumber: 'PB 02 KL 3456', type: '20ft Container', driverId: 'D06', status: 'On Road', permitExpiry: '2027-01-15', maintenanceDue: '2025-12-10' },
  { id: 'V007', registrationNumber: 'BR 01 MN 7890', type: '40ft Container', driverId: 'D07', status: 'On Road', permitExpiry: '2026-10-20', maintenanceDue: '2025-09-25' },
  { id: 'V008', registrationNumber: 'HR 26 OP 1234', type: 'Open Body', driverId: 'D09', status: 'Available', permitExpiry: '2028-04-14', maintenanceDue: '2026-03-01' },
  { id: 'V009', registrationNumber: 'AP 09 QR 5678', type: 'Tanker', driverId: 'D10', status: 'Maintenance', permitExpiry: '2027-08-30', maintenanceDue: '2026-02-15' },
  { id: 'V010', registrationNumber: 'KA 19 ST 9012', type: '20ft Container', driverId: 'D11', status: 'Available', permitExpiry: '2029-01-20', maintenanceDue: '2026-05-20' },
  { id: 'V011', registrationNumber: 'KL 01 UV 3456', type: '40ft Container', driverId: 'D13', status: 'On Road', permitExpiry: '2028-09-11', maintenanceDue: '2026-08-18' },
  { id: 'V012', registrationNumber: 'UK 07 WX 7890', type: 'Open Body', driverId: 'D14', status: 'On Road', permitExpiry: '2027-06-25', maintenanceDue: '2026-01-05' },
  { id: 'V013', registrationNumber: 'MP 09 YZ 1234', type: 'Tanker', driverId: 'D15', status: 'Available', permitExpiry: '2028-12-01', maintenanceDue: '2026-10-15' },
  { id: 'V014', registrationNumber: 'KA 03 AB 5678', type: '20ft Container', driverId: 'D17', status: 'Maintenance', permitExpiry: '2028-07-22', maintenanceDue: '2026-06-30' },
  { id: 'V015', registrationNumber: 'DL 03 CD 9012', type: '40ft Container', driverId: 'D18', status: 'On Road', permitExpiry: '2026-04-03', maintenanceDue: '2025-11-11' },
  { id: 'V016', registrationNumber: 'MH 31 EF 3456', type: 'Open Body', driverId: 'D20', status: 'Available', permitExpiry: '2027-05-28', maintenanceDue: '2026-04-28' },
  { id: 'V017', registrationNumber: 'JK 01 GH 7890', type: 'Tanker', driverId: 'D21', status: 'On Road', permitExpiry: '2028-02-18', maintenanceDue: '2026-09-14' },
  { id: 'V018', registrationNumber: 'BR 26 IJ 1234', type: '20ft Container', driverId: 'D22', status: 'Available', permitExpiry: '2029-02-21', maintenanceDue: '2027-01-21' },
  { id: 'V019', registrationNumber: 'KA 05 KL 5678', type: '40ft Container', driverId: 'D24', status: 'Maintenance', permitExpiry: '2026-11-01', maintenanceDue: '2025-10-01' },
  { id: 'V020', registrationNumber: 'MH 02 MN 9012', type: 'Open Body', driverId: 'D25', status: 'On Road', permitExpiry: '2025-09-10', maintenanceDue: '2025-08-10' },
];

export const sampleShipments: Shipment[] = [
  {
    id: 'LRN2025001', date: '2025-07-15', origin: 'Mumbai, Maharashtra', destination: 'New Delhi, Delhi',
    consignor: { name: 'ABC Textiles', address: '123 Textile Market, Mumbai', gst: '27AAAAA0000A1Z5', phone: '9811111111' },
    consignee: { name: 'XYZ Retail', address: '456 Karol Bagh, New Delhi', gst: '07BBBBB0000B1Z5', phone: '9822222222' },
    packages: { count: 50, description: 'Cotton Bales', weight: 5000 },
    status: 'Delivered', vehicleId: 'V001', billId: 'BILL2025001'
  },
  {
    id: 'LRN2025002', date: '2025-07-18', origin: 'Bangalore, Karnataka', destination: 'Chennai, Tamil Nadu',
    consignor: { name: 'PQR Electronics', address: '789 Electronic City, Bangalore', gst: '29CCCCC0000C1Z5', phone: '9833333333' },
    consignee: { name: 'LMN Distributors', address: '101 Mount Road, Chennai', gst: '33DDDDD0000D1Z5', phone: '9844444444' },
    packages: { count: 200, description: 'Computer Parts', weight: 2500 },
    status: 'In Transit', vehicleId: 'V002'
  },
  {
    id: 'LRN2025003', date: '2025-07-20', origin: 'Pune, Maharashtra', destination: 'Mumbai, Maharashtra',
    consignor: { name: 'Pharma Co', address: '321 MIDC, Mumbai', gst: '27EEEEE0000E1Z5', phone: '9855555555' },
    consignee: { name: 'HealthCare Ltd', address: '654 Hinjewadi, Pune', gst: '27FFFFF0000F1Z5', phone: '9866666666' },
    packages: { count: 100, description: 'Medicines', weight: 1000 },
    status: 'Pending', vehicleId: 'V003', billId: 'BILL2025003'
  },
  {
    id: 'LRN2025004', date: '2025-07-21', origin: 'Kolkata, West Bengal', destination: 'Patna, Bihar',
    consignor: { name: 'Jute Industries', address: '111 Howrah, Kolkata', gst: '19GGGGG0000G1Z5', phone: '9877777777' },
    consignee: { name: 'Bihar Traders', address: '222 Boring Road, Patna', gst: '10HHHHH0000H1Z5', phone: '9888888888' },
    packages: { count: 30, description: 'Jute Bags', weight: 3000 },
    status: 'In Transit', vehicleId: 'V001'
  },
  {
    id: 'LRN2025005', date: '2025-07-22', origin: 'New Delhi, Delhi', destination: 'Jaipur, Rajasthan',
    consignor: { name: 'Crafts Emporium', address: '777 Dilli Haat, New Delhi', gst: '07IIIII0000I1Z5', phone: '9899999999' },
    consignee: { name: 'Rajasthali', address: '888 MI Road, Jaipur', gst: '08JJJJJ0000J1Z5', phone: '9800000000' },
    packages: { count: 150, description: 'Handicrafts', weight: 1500 },
    status: 'Delivered', vehicleId: 'V004', billId: 'BILL2025002'
  },
];

export const sampleBills: Bill[] = [
  {
    id: 'BILL2025001', shipmentId: 'LRN2025001', date: '2025-07-16', dueDate: '2025-08-15', clientName: 'ABC Textiles', status: 'Paid', chargeStatus: 'Paid',
    items: [{ description: 'Freight Charges (Mumbai - Delhi)', hsnCode: '996511', amount: 50000 }],
    subtotal: 50000, cgst: 0, sgst: 0, igst: 9000, total: 59000
  },
  {
    id: 'BILL2025002', shipmentId: 'LRN2025005', date: '2025-07-23', dueDate: '2025-08-22', clientName: 'Crafts Emporium', status: 'Unpaid', chargeStatus: 'To Pay',
    items: [{ description: 'Freight Charges (Delhi - Jaipur)', hsnCode: '996511', amount: 20000 }],
    subtotal: 20000, cgst: 0, sgst: 0, igst: 3600, total: 23600
  },
  {
    id: 'BILL2025003', shipmentId: 'LRN2025003', date: '2025-07-21', dueDate: '2025-08-20', clientName: 'Pharma Co', status: 'Overdue', chargeStatus: 'TBB',
    items: [{ description: 'Freight Charges (Mumbai - Pune)', hsnCode: '996511', amount: 15000 }],
    subtotal: 15000, cgst: 1350, sgst: 1350, igst: 0, total: 17700
  },
];

export const sampleLoadingSheets: LoadingSheet[] = [
    { id: 'LS001', date: '2025-07-18', vehicleId: 'V002', driverId: 'D02', route: 'Bangalore -> Chennai', shipmentIds: ['LRN2025002'] },
    { id: 'LS002', date: '2025-07-21', vehicleId: 'V001', driverId: 'D01', route: 'Kolkata -> Patna', shipmentIds: ['LRN2025004'] },
];
