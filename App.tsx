
import React, { useState } from 'react';
import { POData, LineItem } from './types.ts';
import { generateWordDoc } from './services/docGenerator.ts';

const initialPOData: POData = {
  poNo: '',
  date: new Date().toISOString().split('T')[0],
  vendor: {
    contactPerson: '',
    companyName: '',
    address: '',
    email: '',
    phone: '',
  },
  bankDetails: {
    bank: '',
    accountNo: '',
    branch: '',
    ifscCode: '',
  },
  otherDetails: {
    panNo: '',
    gstNo: '',
  },
  buyer: {
    organization: "Queens' College",
    address: "Khandwa Road, Indore (M.P.)",
    contactPerson: '',
    email: '',
    phone: '',
  },
  poc: {
    name: '',
    phone: '',
  },
  reference: {
    quotationNo: '',
    date: '',
    amount: '',
  },
  items: [
    { id: '1', description: '', qty: 0, basicCost: 0, gst: 0, totalCost: 0 }
  ],
  terms: {
    qualityAssuranceItem: '',
    deliveryTimeline: '',
    complianceQuoteAmount: '',
  },
};

const App: React.FC = () => {
  const [data, setData] = useState<POData>(initialPOData);

  const handleChange = (section: keyof POData, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      [section]: {
        //@ts-ignore
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleTopLevelChange = (field: string, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          let updatedValue = value;
          if (field === 'qty' || field === 'basicCost' || field === 'gst') {
            updatedValue = parseFloat(value) || 0;
          }
          const newItem = { ...item, [field]: updatedValue };
          const qty = field === 'qty' ? (parseFloat(value) || 0) : Number(item.qty);
          const cost = field === 'basicCost' ? (parseFloat(value) || 0) : Number(item.basicCost);
          const gst = field === 'gst' ? (parseFloat(value) || 0) : Number(item.gst);
          newItem.qty = qty;
          newItem.basicCost = cost;
          newItem.gst = gst;
          newItem.totalCost = (qty * cost) + gst;
          return newItem;
        }
        return item;
      })
    }));
  };

  const addItem = () => {
    const newId = Date.now().toString();
    setData(prev => ({
      ...prev,
      items: [...prev.items, { id: newId, description: '', qty: 0, basicCost: 0, gst: 0, totalCost: 0 }]
    }));
  };

  const removeItem = (id: string) => {
    if (data.items.length === 1) return;
    setData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleGenerate = async () => {
    try {
      await generateWordDoc(data);
    } catch (error) {
      console.error("Failed to generate document:", error);
      alert("Error: " + (error instanceof Error ? error.message : "Generation failed."));
    }
  };

  const totalPayable = data.items.reduce((sum, item) => sum + Number(item.totalCost), 0);

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center bg-slate-100">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200 flex flex-col">
        
        {/* Main Header */}
        <div className="bg-[#8B4513] p-10 text-white text-center shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10 pointer-events-none"></div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 relative uppercase">Queens' College Indore</h1>
          <p className="text-lg opacity-80 font-medium relative">Official Purchase Order Portal</p>
        </div>

        <div className="p-6 md:p-12 space-y-12">
          
          {/* Order Reference */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-amber-50/70 p-8 rounded-2xl border border-amber-200">
            <div>
              <label className="block text-xs font-black text-amber-800 uppercase mb-2 tracking-wider">P.O. Number</label>
              <input 
                type="text" 
                value={data.poNo}
                onChange={(e) => handleTopLevelChange('poNo', e.target.value)}
                placeholder="Ex: QC/PO/2024-25/123"
                className="w-full border-b-2 border-amber-200 bg-white/50 px-2 py-3 text-lg font-bold text-gray-900 focus:outline-none focus:border-amber-600 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-amber-800 uppercase mb-2 tracking-wider">Order Date</label>
              <input 
                type="date" 
                value={data.date}
                onChange={(e) => handleTopLevelChange('date', e.target.value)}
                className="w-full border-b-2 border-amber-200 bg-white/50 px-2 py-3 text-lg font-bold text-gray-900 focus:outline-none focus:border-amber-600 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Vendor/Supplier */}
            <Section title="Vendor / Supplier Details">
              <InputField label="Company Name" value={data.vendor.companyName} onChange={(v) => handleChange('vendor', 'companyName', v)} />
              <InputField label="Contact Person" value={data.vendor.contactPerson} onChange={(v) => handleChange('vendor', 'contactPerson', v)} />
              <InputField label="Full Address" value={data.vendor.address} onChange={(v) => handleChange('vendor', 'address', v)} />
              <InputField label="Email Address" value={data.vendor.email} onChange={(v) => handleChange('vendor', 'email', v)} />
              <InputField label="Contact Phone" value={data.vendor.phone} onChange={(v) => handleChange('vendor', 'phone', v)} />
            </Section>

            {/* Payment Info */}
            <Section title="Bank & Tax Information">
              <InputField label="Bank Name" value={data.bankDetails.bank} onChange={(v) => handleChange('bankDetails', 'bank', v)} />
              <InputField label="Account Number" value={data.bankDetails.accountNo} onChange={(v) => handleChange('bankDetails', 'accountNo', v)} />
              <InputField label="Branch Name" value={data.bankDetails.branch} onChange={(v) => handleChange('bankDetails', 'branch', v)} />
              <InputField label="IFSC Code" value={data.bankDetails.ifscCode} onChange={(v) => handleChange('bankDetails', 'ifscCode', v)} />
              <div className="pt-6 border-t border-gray-100">
                <InputField label="PAN Number" value={data.otherDetails.panNo} onChange={(v) => handleChange('otherDetails', 'panNo', v)} />
                <InputField label="GSTIN" value={data.otherDetails.gstNo} onChange={(v) => handleChange('otherDetails', 'gstNo', v)} />
              </div>
            </Section>

            {/* Buyer/Consignee */}
            <Section title="Consignee / Buyer Details">
              <InputField label="Organization Name" value={data.buyer.organization} onChange={(v) => handleChange('buyer', 'organization', v)} />
              <InputField label="Delivery Address" value={data.buyer.address} onChange={(v) => handleChange('buyer', 'address', v)} />
              <InputField label="Consignee Name" value={data.buyer.contactPerson} onChange={(v) => handleChange('buyer', 'contactPerson', v)} />
              <div className="pt-6 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-800 mb-4">Internal Point of Contact</h4>
                <InputField label="POC Name" value={data.poc.name} onChange={(v) => handleChange('poc', 'name', v)} />
                <InputField label="POC Phone" value={data.poc.phone} onChange={(v) => handleChange('poc', 'phone', v)} />
              </div>
            </Section>
          </div>

          {/* Quotation Ref */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-inner">
            <h3 className="text-xl font-black text-gray-800 mb-8 uppercase tracking-wide">Quotation Reference</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <InputField label="Quote Reference No." value={data.reference.quotationNo} onChange={(v) => handleChange('reference', 'quotationNo', v)} />
              <InputField label="Quotation Date" type="date" value={data.reference.date} onChange={(v) => handleChange('reference', 'date', v)} />
              <InputField label="Quoted Total Amount (₹)" value={data.reference.amount} onChange={(v) => handleChange('reference', 'amount', v)} />
            </div>
          </div>

          {/* Item Table */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Order Line Items</h3>
              <button onClick={addItem} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center transition-all shadow hover:scale-105 active:scale-95">
                + ADD PRODUCT
              </button>
            </div>
            
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-lg bg-white">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-gray-800 text-white uppercase text-[10px] tracking-widest font-black">
                  <tr>
                    <th className="px-6 py-4 w-16">Sr.</th>
                    <th className="px-6 py-4">Item / Product Description</th>
                    <th className="px-6 py-4 w-24">Qty</th>
                    <th className="px-6 py-4 w-32">Basic (₹)</th>
                    <th className="px-6 py-4 w-32">GST (₹)</th>
                    <th className="px-6 py-4 w-40 text-right">Total (₹)</th>
                    <th className="px-6 py-4 w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-amber-50/20 group">
                      <td className="px-6 py-4 text-gray-400 font-bold">{idx + 1}</td>
                      <td className="px-6 py-4">
                        <input type="text" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} placeholder="Describe the item..." className="w-full px-3 py-2 border border-transparent hover:border-gray-200 focus:border-amber-600 focus:bg-white transition-all rounded text-gray-900 bg-transparent font-medium" />
                      </td>
                      <td className="px-6 py-4">
                        <input type="text" inputMode="decimal" value={item.qty || ''} onChange={(e) => updateItem(item.id, 'qty', e.target.value)} placeholder="0" className="w-full px-2 py-2 border border-transparent hover:border-gray-200 focus:border-amber-600 focus:bg-white text-center rounded text-gray-900 bg-transparent font-medium" />
                      </td>
                      <td className="px-6 py-4">
                        <input type="text" inputMode="decimal" value={item.basicCost || ''} onChange={(e) => updateItem(item.id, 'basicCost', e.target.value)} placeholder="0.00" className="w-full px-2 py-2 border border-transparent hover:border-gray-200 focus:border-amber-600 focus:bg-white text-right rounded text-gray-900 bg-transparent font-medium" />
                      </td>
                      <td className="px-6 py-4">
                        <input type="text" inputMode="decimal" value={item.gst || ''} onChange={(e) => updateItem(item.id, 'gst', e.target.value)} placeholder="0.00" className="w-full px-2 py-2 border border-transparent hover:border-gray-200 focus:border-amber-600 focus:bg-white text-right rounded text-gray-900 bg-transparent font-medium" />
                      </td>
                      <td className="px-6 py-4 font-black text-amber-900 text-right">
                        ₹ {Number(item.totalCost).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2">✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 font-black border-t-2 border-gray-200">
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-right text-gray-500 uppercase text-xs tracking-widest">Grand Total Amount Payable:</td>
                    <td className="px-6 py-8 text-2xl text-amber-900 text-right">
                      ₹ {totalPayable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col items-center pt-12 border-t border-gray-100">
            <button 
              onClick={handleGenerate}
              className="bg-[#8B4513] hover:bg-[#5D2D0C] text-white px-20 py-6 rounded-2xl font-black text-xl shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-4 border-b-4 border-black/20"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              GENERATE OFFICIAL P.O. DOCUMENT
            </button>
            <p className="mt-4 text-sm text-gray-400 font-medium">Verify all details before downloading the final Word file.</p>
          </div>

        </div>

        <div className="bg-slate-900 p-8 text-center">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">© 2024 Queens' College Indore - Internal Procurement Tool</p>
        </div>
      </div>
      <div className="h-20" />
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-black text-gray-800 flex items-center gap-3 uppercase tracking-tight">
      <span className="w-1.5 h-6 bg-amber-600 rounded-full"></span>
      {title}
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const InputField: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: string }> = ({ label, value, onChange, type = "text" }) => (
  <div className="group relative">
    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 group-focus-within:text-amber-600 transition-colors tracking-wide">
      {label}
    </label>
    <input 
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border-b border-gray-200 py-2.5 text-sm font-bold text-gray-800 focus:outline-none focus:border-amber-600 transition-all bg-transparent"
      placeholder="..."
    />
  </div>
);

export default App;
