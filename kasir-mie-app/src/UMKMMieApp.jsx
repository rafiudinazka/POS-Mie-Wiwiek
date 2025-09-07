import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  ShoppingCart, Users, BarChart2, Package, Settings, LogOut, ChevronDown, 
  Plus, Search, Calendar, Download, MoreVertical, Wifi, WifiOff, Bell,
  DollarSign, ArrowUp, ArrowDown, X, Trash2, Edit, Printer, Menu
} from 'lucide-react';
import { supabase } from './supabaseClient';
// Catatan: Fungsionalitas export ke Excel memerlukan instalasi library 'xlsx'
// Jalankan: npm install xlsx
// import * as XLSX from 'xlsx';

// =================================================================================
// HELPER & DATA
// =================================================================================

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount || 0);
};

// =================================================================================
// KOMPONEN-KOMPONEN UI KECIL (REUSABLE COMPONENTS)
// =================================================================================

const StatCard = ({ title, value, icon, change, changeType }) => {
  const Icon = icon;
  const isPositive = changeType === 'positive';
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <Icon className="w-5 h-5 text-slate-400" />
      </div>
      <p className="text-3xl font-bold text-slate-800 mb-1">{value}</p>
      {change && (
        <div className={`flex items-center text-xs font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
          <span>{change}</span>
        </div>
      )}
    </div>
  );
};

const ProductCard = ({ product, onSelect, isSelected }) => (
  <button
    onClick={() => onSelect(product)}
    className={`border rounded-xl p-3 text-left transition-all duration-200 group ${
      isSelected 
        ? 'border-blue-600 ring-2 ring-blue-200 shadow-lg' 
        : 'border-slate-200 hover:border-blue-500 hover:shadow-md'
    }`}
  >
    <div className="w-full h-20 bg-slate-100 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
      <Package className="w-8 h-8 text-slate-400 group-hover:scale-110 transition-transform" />
    </div>
    <h3 className="font-bold text-slate-800 text-sm truncate">{product.type}</h3>
    <p className="text-xs text-slate-500">Stok: {product.stock} {product.unit}</p>
  </button>
);

const ProductModal = ({ isOpen, onClose, onSave, product }) => {
  const [formData, setFormData] = useState({
    type: '', stock: '', price: '', details: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        type: product.type || '',
        stock: product.stock || '',
        price: product.price || '',
        details: product.details || ''
      });
    } else {
      setFormData({ type: '', stock: '', price: '', details: '' });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...product, ...formData });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 no-print">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="text-lg font-bold">{product ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><X /></button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Nama Produk</label>
              <input name="type" value={formData.type} onChange={handleChange} required className="w-full p-2 border border-slate-300 rounded-md"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Stok (Kg)</label>
                <input name="stock" type="number" value={formData.stock} onChange={handleChange} required className="w-full p-2 border border-slate-300 rounded-md"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Harga/Kg</label>
                <input name="price" type="number" value={formData.price} onChange={handleChange} required className="w-full p-2 border border-slate-300 rounded-md"/>
              </div>
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Detail / Add-on</label>
              <textarea name="details" value={formData.details} onChange={handleChange} placeholder="cth: Dibuat dengan telur bebek" className="w-full p-2 border border-slate-300 rounded-md h-20"></textarea>
            </div>
          </div>
          <div className="p-6 bg-slate-50 rounded-b-xl flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-slate-300 hover:bg-slate-100">Batal</button>
            <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CustomerModal = ({ isOpen, onClose, onSave, customer }) => {
  const [formData, setFormData] = useState({
    name: '', phone: '', address: ''
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        phone: customer.phone || '',
        address: customer.address || ''
      });
    } else {
      setFormData({ name: '', phone: '', address: '' });
    }
  }, [customer, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...customer, ...formData });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 no-print">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="text-lg font-bold">{customer ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}</h3>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><X /></button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Nama Pelanggan</label>
              <input name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border border-slate-300 rounded-md"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Nomor Telepon</label>
              <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Alamat</label>
              <textarea name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md h-20"></textarea>
            </div>
          </div>
          <div className="p-6 bg-slate-50 rounded-b-xl flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-slate-300 hover:bg-slate-100">Batal</button>
            <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const StrukThermal = ({ order, onClose, settings }) => {
  console.log("5. Komponen StrukThermal menerima data:", order);
  
  const handlePrint = () => {
    console.log("6. StrukThermal siap untuk print.");
    window.print();
  };

  if (!order) return null;

  // Fungsi untuk membuat baris dengan padding
  const padRight = (str, len) => str.padEnd(len);
  const padLeft = (str, len) => str.padStart(len);
  const center = (str, width) => {
    const spaces = width - str.length;
    const leftPad = Math.floor(spaces / 2);
    const rightPad = spaces - leftPad;
    return " ".repeat(leftPad) + str + " ".repeat(rightPad);
  };

  const width = 32; // Lebar struk dalam karakter
  const separator = "-".repeat(width);

  // Generate konten struk
  const receiptContent = [
    center(settings.businessName.toUpperCase(), width),
    center("Jl. Mie Enak No. 1, Surabaya", width),
    center("Telp: 0812-3456-7890", width),
    separator,
    center("CASH RECEIPT", width),
    separator,
    "Nama    : " + order.customerName,
    "Tanggal : " + new Date(order.created_at).toLocaleDateString('id-ID'),
    "Waktu   : " + new Date(order.created_at).toLocaleTimeString('id-ID'),
    separator,
    "ITEM                     QTY     SUB",
    separator,
    ...(order.items || []).map(item => {
      const name = item.type;
      const qty = `${item.quantity}x`;
      const price = formatCurrency((item.price || settings.pricePerKg) * item.quantity);
      return padRight(name.substring(0, 20), 20) + " " + 
             padLeft(qty, 5) + " " + 
             padLeft(price, 6);
    }),
    separator,
    padRight("Total", 20) + padLeft(formatCurrency(order.total), 12),
    padRight("Cash", 20) + padLeft(formatCurrency(order.total), 12),
    padRight("Change", 20) + padLeft(formatCurrency(0), 12),
    separator,
    center("THANK YOU!", width),
    center("SELAMAT DATANG KEMBALI", width),
  ].join("\n");

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-4 no-print">
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Tutup
        </button>
        <button onClick={handlePrint} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Print
        </button>
      </div>
      <pre id="print-area" style={{
        fontFamily: 'monospace',
        fontSize: '12px',
        whiteSpace: 'pre',
        margin: '0',
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: 'white'
      }}>
        {receiptContent}
      </pre>
    </div>
  );
};


// =================================================================================
// KOMPONEN UNTUK SETIAP HALAMAN (SCREENS)
// =================================================================================

const KasirScreen = ({ inventory, customers, addTransaction, settings, setStrukData }) => {
  const [currentOrder, setCurrentOrder] = useState([]);
  const [customerName, setCustomerName] = useState('');

  const handleProductSelect = (product) => {
    setCurrentOrder(prevOrder => {
      const existingItem = prevOrder.find(item => item.id === product.id);
      if (existingItem) {
        return prevOrder.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevOrder, { ...product, quantity: 1 }];
    });
  };
  
  const handleQuantityChange = (productId, change) => {
    setCurrentOrder(prevOrder => prevOrder.map(item => 
      item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    ).filter(item => item.quantity > 0));
  };

  const subtotal = useMemo(() => {
    return currentOrder.reduce((sum, item) => sum + (item.price || settings.pricePerKg) * item.quantity, 0);
  }, [currentOrder, settings.pricePerKg]);

  const handlePlaceOrder = async () => {
    console.log("1. Tombol 'Buat Pesanan' diklik.");
    if (!customerName || currentOrder.length === 0) {
      alert("Nama pelanggan dan minimal 1 produk harus dipilih.");
      return;
    }
    try {
      console.log("2. Data pesanan awal:", { customerName, currentOrder });
      const totalQuantity = currentOrder.reduce((sum, item) => sum + item.quantity, 0);
      const notes = currentOrder.map(item => `${item.type} (${item.quantity}kg)`).join(', ');

      const newTransaction = await addTransaction({
        customerName,
        quantity: totalQuantity,
        pricePerKg: subtotal / totalQuantity,
        notes,
        items: currentOrder // Mengirim informasi produk yang dibeli
      });
      
      console.log("3. Transaksi berhasil ditambahkan:", newTransaction);

      const receiptData = {
          ...newTransaction,
          items: currentOrder,
      };
      
      console.log("4. Menyiapkan data untuk struk:", receiptData);
      setStrukData(receiptData);
      setCurrentOrder([]);
      setCustomerName('');
    } catch (error) {
      console.error('Error placing order:', error);
      alert(error.message || 'Terjadi kesalahan saat membuat pesanan');
    }
  };

  const isButtonDisabled = !customerName || currentOrder.length === 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {inventory.map(item => (
            <ProductCard 
              key={item.id} 
              product={item} 
              onSelect={handleProductSelect}
              isSelected={currentOrder.some(orderItem => orderItem.id === item.id)}
            />
          ))}
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-6 h-full flex flex-col">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Detail Pesanan</h2>
        <div className="flex-grow space-y-4">
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Nama Pelanggan"
            list="customers-list"
          />
          <datalist id="customers-list">{customers.map(c => <option key={c.id} value={c.name} />)}</datalist>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {currentOrder.length === 0 ? (
              <p className="text-center text-slate-500 py-10">Belum ada item dipilih.</p>
            ) : (
              currentOrder.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{item.type}</p>
                    <p className="text-xs text-slate-500">{formatCurrency(item.price || settings.pricePerKg)}</p>
                  </div>
                  <div className="flex items-center gap-2 border border-slate-300 rounded-md px-2 py-1">
                    <button onClick={() => handleQuantityChange(item.id, -1)} className="text-lg font-bold">-</button>
                    <span className="text-sm w-5 text-center">{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, 1)} className="text-lg font-bold">+</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="mt-6 border-t border-slate-200 pt-4 space-y-2">
          <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          <div className="flex justify-between font-bold text-slate-800 text-xl"><span>TOTAL</span><span>{formatCurrency(subtotal)}</span></div>
        </div>
        <div className="mt-6">
          <button onClick={handlePlaceOrder} className="w-full bg-blue-600 text-white p-4 rounded-lg font-bold hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed" disabled={isButtonDisabled}>Buat Pesanan</button>
          {isButtonDisabled && (
            <p className="text-xs text-red-500 text-center mt-2">Nama pelanggan & item pesanan harus diisi.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const LaporanScreen = ({ transactions, customers, searchTerm, setSearchTerm, dateFilter, setDateFilter, exportTransactions, selectedYear, setSelectedYear }) => {
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => 
      t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (dateFilter === '' || t.date === dateFilter)
    );
  }, [transactions, searchTerm, dateFilter]);

  const totalSales = useMemo(() => filteredTransactions.reduce((sum, t) => sum + t.total, 0), [filteredTransactions]);
  const totalProductsSold = useMemo(() => filteredTransactions.reduce((sum, t) => sum + t.quantity, 0), [filteredTransactions]);

  const availableYears = useMemo(() => {
    const years = new Set(transactions.map(t => new Date(t.date).getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions]);

  const annualCustomerReport = useMemo(() => {
    const report = {};
    transactions
      .filter(t => new Date(t.date).getFullYear() === selectedYear)
      .forEach(t => {
        if (!report[t.customerName]) {
          report[t.customerName] = { name: t.customerName, totalPurchase: 0 };
        }
        report[t.customerName].totalPurchase += t.total;
      });

    return Object.values(report)
      .map(customer => ({
        ...customer,
        cashback: customer.totalPurchase * 0.01
      }))
      .sort((a, b) => b.totalPurchase - a.totalPurchase);
  }, [transactions, selectedYear]);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Laporan Penjualan</h2>
        <button onClick={() => exportTransactions(filteredTransactions)} className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Penjualan (Filtered)" value={formatCurrency(totalSales)} icon={DollarSign} />
        <StatCard title="Total Produk Terjual (Filtered)" value={`${totalProductsSold} kg`} icon={Package} />
        <StatCard title="Total Pelanggan" value={customers.length} icon={Users}/>
        <StatCard title="Total Transaksi (Filtered)" value={filteredTransactions.length} icon={ShoppingCart} />
       </div>
       
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Cari nama pelanggan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg"/>
          </div>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg"/>
          </div>
          { (searchTerm || dateFilter) && <button onClick={() => { setSearchTerm(''); setDateFilter(''); }} className="text-blue-600 text-sm font-medium">Reset Filter</button> }
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-4">Riwayat Transaksi</h3>
         <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3">Tanggal</th>
              <th scope="col" className="px-6 py-3">Pelanggan</th>
              <th scope="col" className="px-6 py-3">Detail</th>
              <th scope="col" className="px-6 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.slice(0, 10).map(t => (
               <tr key={t.id} className="bg-white border-b">
                <td className="px-6 py-4 font-medium text-slate-900">{t.date}</td>
                <td className="px-6 py-4">{t.customerName}</td>
                <td className="px-6 py-4">{t.notes}</td>
                <td className="px-6 py-4 text-right font-medium">{formatCurrency(t.total)}</td>
              </tr>
            ))}
             {filteredTransactions.length === 0 && (
              <tr><td colSpan="4" className="text-center py-10 text-slate-500">Tidak ada transaksi ditemukan.</td></tr>
            )}
          </tbody>
        </table>
       </div>

       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800">Laporan Cashback Tahunan Pelanggan</h3>
              <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="p-2 border border-slate-300 rounded-lg text-sm">
                  {availableYears.map(year => ( <option key={year} value={year}>{year}</option> ))}
              </select>
          </div>
          <table className="w-full text-sm text-left text-slate-500">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                  <tr>
                      <th scope="col" className="px-6 py-3">Nama Pelanggan</th>
                      <th scope="col" className="px-6 py-3 text-right">Total Belanja ({selectedYear})</th>
                      <th scope="col" className="px-6 py-3 text-right">Cashback (1%)</th>
                  </tr>
              </thead>
              <tbody>
                  {annualCustomerReport.map(customer => (
                     <tr key={customer.name} className="bg-white border-b">
                      <td className="px-6 py-4 font-medium text-slate-900">{customer.name}</td>
                      <td className="px-6 py-4 text-right">{formatCurrency(customer.totalPurchase)}</td>
                      <td className="px-6 py-4 text-right font-medium text-green-600">{formatCurrency(customer.cashback)}</td>
                    </tr>
                  ))}
                   {annualCustomerReport.length === 0 && (
                    <tr><td colSpan="3" className="text-center py-10 text-slate-500">Tidak ada data untuk tahun {selectedYear}.</td></tr>
                  )}
              </tbody>
          </table>
       </div>
    </div>
  )
};

const PelangganScreen = ({ customers, searchTerm, setSearchTerm, onAddNew, onEdit, onDelete }) => {
   const filteredCustomers = useMemo(() => {
    return customers.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm))
    );
  }, [customers, searchTerm]);

   return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-slate-800">Manajemen Pelanggan</h2>
         <button onClick={onAddNew} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          <span>Tambah Pelanggan</span>
        </button>
       </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="relative w-1/3 mb-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Cari nama atau telepon..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg"/>
        </div>
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3">Nama</th>
              <th scope="col" className="px-6 py-3">Kontak</th>
              <th scope="col" className="px-6 py-3">Alamat</th>
              <th scope="col" className="px-6 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(c => (
               <tr key={c.id} className="bg-white border-b">
                <td className="px-6 py-4 font-medium text-slate-900">{c.name}</td>
                <td className="px-6 py-4">{c.phone || '-'}</td>
                <td className="px-6 py-4">{c.address || '-'}</td>
                <td className="px-6 py-4 flex gap-4">
                  <button onClick={() => onEdit(c)} className="text-blue-600 hover:text-blue-800"><Edit className="w-4 h-4"/></button>
                  <button onClick={() => onDelete(c.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
            {filteredCustomers.length === 0 && (
              <tr><td colSpan="4" className="text-center py-10 text-slate-500">Tidak ada pelanggan ditemukan.</td></tr>
            )}
          </tbody>
        </table>
       </div>
    </div>
  )
}

const ProdukScreen = ({ inventory, onAddNew, onEdit, onDelete, searchTerm, setSearchTerm }) => {
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => 
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inventory, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Manajemen Produk</h2>
        <button onClick={onAddNew} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          <span>Tambah Produk</span>
        </button>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="relative w-1/3 mb-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Cari nama produk..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg"/>
        </div>
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3">Nama Produk</th>
              <th scope="col" className="px-6 py-3">Stok</th>
              <th scope="col" className="px-6 py-3">Harga/Kg</th>
              <th scope="col" className="px-6 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map(item => (
              <tr key={item.id} className="bg-white border-b">
                <td className="px-6 py-4 font-medium text-slate-900">{item.type}</td>
                <td className="px-6 py-4">{item.stock} {item.unit}</td>
                <td className="px-6 py-4">{formatCurrency(item.price)}</td>
                <td className="px-6 py-4 flex gap-4">
                  <button onClick={() => onEdit(item)} className="text-blue-600 hover:text-blue-800"><Edit className="w-4 h-4"/></button>
                  <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
            {filteredInventory.length === 0 && (
              <tr><td colSpan="4" className="text-center py-10 text-slate-500">Tidak ada produk ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// =================================================================================
// KOMPONEN UTAMA APLIKASI (MAIN LAYOUT)
// =================================================================================
const UMKMMieApp = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('kasir');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [settings, setSettings] = useState({ businessName: 'Mie Wiwiek', pricePerKg: 8000, cashbackRate: 1 });
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [strukData, setStrukData] = useState(null);

  useEffect(() => {
    console.log("STATE UPDATE: strukData berubah menjadi:", strukData);
  }, [strukData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch customers
        const { data: customersData, error: customersError } = await supabase
          .from('customers')
          .select('*');
        
        if (customersError) {
          console.error('Error fetching customers:', customersError);
        } else {
          setCustomers(customersData || []);
        }

        // Fetch transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (transactionsError) {
          console.error('Error fetching transactions:', transactionsError);
        } else {
          setTransactions(transactionsData || []);
        }

        // Fetch inventory
        const { data: inventoryData, error: inventoryError } = await supabase
          .from('inventory')
          .select('*');
        
        if (inventoryError) {
          console.error('Error fetching inventory:', inventoryError);
        } else {
          setInventory(inventoryData || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Data sudah disimpan langsung ke Supabase saat melakukan perubahan
  // Tidak perlu menyimpan ke localStorage lagi

  const addTransaction = async (orderData) => {
    try {
      const total = (orderData.pricePerKg * orderData.quantity);
      const transaction = {
        customerName: orderData.customerName,
        quantity: orderData.quantity,
        price: orderData.pricePerKg,
        total: total,
        date: new Date().toISOString().split('T')[0],
        notes: orderData.notes,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        created_at: new Date().toISOString()
      };

      // Update stock for each product in the order
      for (const item of orderData.items) {
        const { data: currentProduct, error: fetchError } = await supabase
          .from('inventory')
          .select('stock')
          .eq('id', item.id)
          .single();

        if (fetchError) throw fetchError;

        const newStock = currentProduct.stock - item.quantity;
        if (newStock < 0) {
          throw new Error(`Stok ${item.type} tidak mencukupi`);
        }

        const { error: updateError } = await supabase
          .from('inventory')
          .update({ stock: newStock })
          .eq('id', item.id);

        if (updateError) throw updateError;

        // Update local state
        setInventory(prev =>
          prev.map(product =>
            product.id === item.id
              ? { ...product, stock: newStock }
              : product
          )
        );
      }

      // Insert transaction to Supabase
      const { data: newTransactionData, error: transactionError } = await supabase
        .from('transactions')
        .insert([transaction])
        .select()
        .single();

      if (transactionError) throw transactionError;

      setTransactions(prev => [newTransactionData, ...prev]);

      // Update or create customer
      const existing = customers.find(c => c.name === orderData.customerName);
      if (existing) {
        const { error: customerError } = await supabase
          .from('customers')
          .update({
            totalPurchase: existing.totalPurchase + total,
            visits: (existing.visits || 0) + 1,
            lastTransaction: transaction.date
          })
          .eq('id', existing.id);

        if (customerError) throw customerError;

        setCustomers(prevCustomers =>
          prevCustomers.map(c => 
            c.id === existing.id 
              ? {...c, totalPurchase: c.totalPurchase + total, visits: (c.visits || 0) + 1, lastTransaction: transaction.date }
              : c
          )
        );
      } else {
        const newCustomer = {
          name: orderData.customerName,
          phone: '',
          address: '',
          totalPurchase: total,
          visits: 1,
          lastTransaction: transaction.date
        };

        const { data: newCustomerData, error: customerError } = await supabase
          .from('customers')
          .insert([newCustomer])
          .select()
          .single();

        if (customerError) throw customerError;

        setCustomers(prev => [...prev, newCustomerData]);
      }

      return newTransactionData;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const exportTransactions = useCallback((dataToExport) => {
    alert("Fitur export sedang diperbaiki. Silakan coba lagi nanti.");
  }, []);
  
  const handleSaveProduct = async (productData) => {
    try {
      const product = {
        ...productData,
        stock: Number(productData.stock),
        price: Number(productData.price),
        unit: 'kg'
      };

      if (productData.id) {
        // Update existing product
        const { data: updatedProduct, error } = await supabase
          .from('inventory')
          .update(product)
          .eq('id', productData.id)
          .select()
          .single();

        if (error) throw error;

        setInventory(prev =>
          prev.map(item => item.id === productData.id ? updatedProduct : item)
        );
      } else {
        // Create new product
        const { data: newProduct, error } = await supabase
          .from('inventory')
          .insert([product])
          .select()
          .single();

        if (error) throw error;

        setInventory(prev => [...prev, newProduct]);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Terjadi kesalahan saat menyimpan produk');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        const { error } = await supabase
          .from('inventory')
          .delete()
          .eq('id', productId);

        if (error) throw error;

        setInventory(prev => prev.filter(item => item.id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Terjadi kesalahan saat menghapus produk');
      }
    }
  };

  const openProductModal = (product = null) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };
  
  const handleSaveCustomer = async (customerData) => {
    try {
      // Pastikan semua field yang diperlukan ada dan memiliki nilai default yang sesuai
      const customer = {
        name: customerData.name,
        phone: customerData.phone || '',
        address: customerData.address || '',
        totalPurchase: customerData.totalPurchase || 0,
        visits: customerData.visits || 0,
        lastTransaction: customerData.lastTransaction || new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString()
      };

      if (customerData.id) {
        // Update existing customer
        const { data: updatedCustomer, error } = await supabase
          .from('customers')
          .update(customer)
          .eq('id', customerData.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating customer:', error);
          throw new Error('Gagal memperbarui data pelanggan: ' + error.message);
        }

        setCustomers(prev =>
          prev.map(c => c.id === customerData.id ? updatedCustomer : c)
        );
      } else {
        // Create new customer
        const { data: newCustomer, error } = await supabase
          .from('customers')
          .insert([customer])
          .select()
          .single();

        if (error) {
          console.error('Error creating customer:', error);
          throw new Error('Gagal menambahkan pelanggan baru: ' + error.message);
        }

        setCustomers(prev => [...prev, newCustomer]);
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      alert(error.message || 'Terjadi kesalahan saat menyimpan data pelanggan');
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if(window.confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
      try {
        const { error } = await supabase
          .from('customers')
          .delete()
          .eq('id', customerId);

        if (error) throw error;

        setCustomers(prev => prev.filter(c => c.id !== customerId));
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Terjadi kesalahan saat menghapus pelanggan');
      }
    }
  };

  const openCustomerModal = (customer = null) => {
    setEditingCustomer(customer);
    setIsCustomerModalOpen(true);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
    setDateFilter('');
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  }

  const PageTitle = {
    kasir: "Penjualan",
    laporan: "Laporan",
    pelanggan: "Pelanggan",
    produk: "Produk"
  };

  const Sidebar = () => (
    <aside className={`fixed lg:relative top-0 left-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col z-20 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 no-print`}>
      <div className="p-4 border-b border-slate-200">
         <h1 className="text-xl font-bold text-blue-600">{settings.businessName}</h1>
      </div>
      <nav className="flex-grow p-4 space-y-2">
        <button onClick={() => handleTabChange('kasir')} className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'kasir' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
          <ShoppingCart className="w-5 h-5" /><span>Penjualan</span>
        </button>
        <button onClick={() => handleTabChange('laporan')} className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'laporan' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
          <BarChart2 className="w-5 h-5" /><span>Laporan</span>
        </button>
        <button onClick={() => handleTabChange('pelanggan')} className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'pelanggan' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
          <Users className="w-5 h-5" /><span>Pelanggan</span>
        </button>
        <button onClick={() => handleTabChange('produk')} className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'produk' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
          <Package className="w-5 h-5" /><span>Produk</span>
        </button>
      </nav>
      <div className="p-4 border-t border-slate-200">
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          <LogOut className="w-5 h-5" /><span>Log Out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <style>{`
          @media print {
            body > * {
              display: none !important;
            }
            #print-area {
              display: block !important;
              visibility: visible !important;
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: auto !important;
              height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
              font-size: 12px !important;
            }
            .no-print {
              display: none !important;
            }
          }
      `}</style>
      <div className="flex h-screen bg-slate-50 font-sans">
        <div className="no-print flex-shrink-0">
          <Sidebar />
        </div>
        {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden no-print"></div>}
        <div className="flex-1 flex flex-col h-screen">
            <header className="flex items-center justify-between lg:justify-end p-4 bg-white border-b border-slate-200 no-print">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-slate-600">
                    <Menu className="w-6 h-6"/>
                </button>
                <h2 className="font-bold text-lg text-slate-800 lg:hidden">{PageTitle[activeTab]}</h2>
                <div className="w-6"></div>
            </header>
            <main className="flex-1 p-6 overflow-y-auto no-print">
                {activeTab === 'kasir' && <KasirScreen inventory={inventory} customers={customers} addTransaction={addTransaction} settings={settings} setStrukData={setStrukData} />}
                {activeTab === 'laporan' && <LaporanScreen transactions={transactions} customers={customers} searchTerm={searchTerm} setSearchTerm={setSearchTerm} dateFilter={dateFilter} setDateFilter={setDateFilter} exportTransactions={exportTransactions} selectedYear={selectedYear} setSelectedYear={setSelectedYear} />}
                {activeTab === 'pelanggan' && <PelangganScreen customers={customers} searchTerm={searchTerm} setSearchTerm={setSearchTerm} onAddNew={() => openCustomerModal()} onEdit={openCustomerModal} onDelete={handleDeleteCustomer} />}
                {activeTab === 'produk' && <ProdukScreen inventory={inventory} onAddNew={() => openProductModal()} onEdit={openProductModal} onDelete={handleDeleteProduct} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
            </main>
        </div>
      </div>

      <ProductModal 
        isOpen={isProductModalOpen} 
        onClose={() => setIsProductModalOpen(false)} 
        onSave={handleSaveProduct} 
        product={editingProduct} 
      />
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSave={handleSaveCustomer}
        customer={editingCustomer}
      />
      {strukData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center print:bg-transparent print:p-0">
          <div id="print-container" className="bg-white p-8 rounded-xl max-h-[90vh] overflow-y-auto print:p-0 print:rounded-none print:max-h-none print:overflow-visible">
            <StrukThermal 
                order={strukData} 
                onClose={() => setStrukData(null)} 
                settings={settings} 
            />
          </div>
        </div>
      )}
    </>
  );
};

export default UMKMMieApp;

