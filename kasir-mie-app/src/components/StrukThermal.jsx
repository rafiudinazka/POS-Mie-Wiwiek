import React from 'react';
import { formatCurrency } from '../utils';
import { Printer, Download, X } from 'lucide-react';

const StrukThermal = ({ order, onClose, settings }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    // Buat konten struk dalam format teks
    const content = `
${settings.businessName}
${settings.address || 'Jl. Mie Enak No. 1, Surabaya'}
${settings.phone || 'Telp: 0812-3456-7890'}

CASH RECEIPT
${order.date} ${order.time}

${order.items.map(item => 
  `${item.type} x${item.quantity}\t${formatCurrency((item.price || settings.pricePerKg) * item.quantity)}`
).join('\n')}

Total: ${formatCurrency(order.total)}
Customer: ${order.customerName}

Terima kasih atas kunjungan Anda!
    `.trim();

    // Buat blob dan download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `struk-${order.date.replace(/\//g, '')}-${order.time.replace(/:/g, '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!order) {
    return null;
  }

  const separator = '********************************';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 print:hidden">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-[320px] w-full">
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <h2 className="text-lg font-semibold">Struk Pembayaran</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Area Struk yang akan dicetak */}
        <div className="p-4 bg-gray-50">
          <div id="print-area" className="w-full font-mono text-[10px] text-black bg-white p-4 shadow-sm">
            <div className="text-center mb-2">
              <h3 className="font-bold text-sm uppercase">{settings.businessName}</h3>
              <p>{settings.address || 'Jl. Mie Enak No. 1, Surabaya'}</p>
              <p>{settings.phone || 'Telp: 0812-3456-7890'}</p>
            </div>
            <div className="overflow-hidden whitespace-nowrap">{separator}</div>
            <div className="text-center my-1">
              <h4 className="font-bold">CASH RECEIPT</h4>
              <p className="text-xs">
                {order.date} {order.time}
              </p>
            </div>
            <div className="overflow-hidden whitespace-nowrap">{separator}</div>
            <div className="my-2">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left font-bold w-[70%]">Description</th>
                    <th className="text-right font-bold w-[30%]">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="text-left align-top">
                        {item.type} x{item.quantity}
                      </td>
                      <td className="text-right align-top">
                        {formatCurrency((item.price || settings.pricePerKg) * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="overflow-hidden whitespace-nowrap">{separator}</div>
            <div className="my-2 space-y-1">
              <div className="flex justify-between font-bold">
                <span>TOTAL</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
              <div className="text-xs">
                <p>Customer: {order.customerName}</p>
              </div>
            </div>
            <div className="overflow-hidden whitespace-nowrap">{separator}</div>
            <div className="mt-2 text-center text-xs">
              <p>Terima kasih atas kunjungan Anda!</p>
              <p>Silakan datang kembali</p>
            </div>
          </div>
        </div>

        {/* Tombol aksi */}
        <div className="flex justify-end gap-2 p-4 border-t print:hidden">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <Download size={16} />
            Simpan
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            <Printer size={16} />
            Cetak
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrukThermal;
