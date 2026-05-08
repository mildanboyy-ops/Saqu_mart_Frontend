import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCart } from '@/store/useCart';
import { toast } from 'sonner';
import { Trash2, Plus, Minus, Search, Banknote, Printer, ChevronLeft, Camera, PackagePlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useProductStore } from '@/store/useProductStore';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { cn } from '@/lib/utils';
import { useMemberStore } from '@/store/useMemberStore';

function playBeep() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    console.log("Audio not supported");
  }
}

export default function POS() {
  const [barcode, setBarcode] = useState('');
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [customerPhone, setCustomerPhone] = useState("");
  const [discount, setDiscount] = useState(0);
  const settings = useSettingsStore();
  const taxRate = settings.taxRate;
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Non-Cash'>('Cash');
  const [isTempProductOpen, setIsTempProductOpen] = useState(false);
  const [tempProduct, setTempProduct] = useState({ name: '', price: '' });
  const [selectedMember, setSelectedMember] = useState<{name: string, phone: string, balance: number} | null>(null);
  const [isDepositChange, setIsDepositChange] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  
  const { updateBalance, getMemberByPhone } = useMemberStore();
  const { cart, total, addToCart, removeFromCart, updateQty, clearCart } = useCart();
  const { products, updateStock } = useProductStore();
  const { addTransaction } = useTransactionStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const finalTotal = total - discount + (total * taxRate / 100);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'F2') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'F4') {
        e.preventDefault();
        if (cart.length > 0) setIsPaymentOpen(true);
      }
      if (e.key === 'Escape') {
        setIsPaymentOpen(false);
        setIsScannerOpen(false);
        setIsTempProductOpen(false);
        setIsReceiptOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart]);

  const handleAddTempProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempProduct.name || !tempProduct.price) return;
    
    const newItem = {
      id: `temp-${Date.now()}`,
      barcode: `TEMP-${Date.now()}`,
      name: `[TEMP] ${tempProduct.name}`,
      price: Number(tempProduct.price),
      costPrice: 0,
      stock: 999,
      category: 'Sampingan'
    };
    
    addToCart(newItem);
    setTempProduct({ name: '', price: '' });
    setIsTempProductOpen(false);
    toast.success("Produk sementara ditambahkan");
  };

  const handleCheckMember = () => {
    const member = getMemberByPhone(customerPhone);
    if (member) {
      setSelectedMember(member);
      toast.success(`Member ditemukan: ${member.name}`);
    } else {
      setSelectedMember(null);
      toast.error("Member tidak ditemukan");
    }
  };

  const handleScan = (code: string) => {
    const product = products.find(p => p.barcode === code);
    if (product) {
      if (product.stock <= 0) {
        toast.error("Stok habis!");
        return;
      }
      playBeep();
      addToCart(product);
      setBarcode('');
      setIsScannerOpen(false);
      toast.success(`${product.name} ditambahkan`);
    } else {
      toast.error('Barcode tidak ditemukan!');
    }
  };

  const handleManualBarcode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode.trim()) return;
    handleScan(barcode);
  };

  const handlePayment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const pay = Number(paymentAmount);

    if (pay < finalTotal && paymentMethod === 'Cash') {
      toast.error("Uang pembayaran kurang!");
      return;
    }

    const kembalian = paymentMethod === 'Cash' ? pay - finalTotal : 0;
    
    if (selectedMember && isDepositChange && kembalian > 0) {
      updateBalance(selectedMember.phone, kembalian);
    }
    
    const profit = cart.reduce((acc, item) => {
      const product = products.find(p => p.barcode === item.barcode);
      const cost = product?.costPrice || 0;
      return acc + ((item.price - cost) * item.qty);
    }, 0) - discount;

    const txData = {
      id: `TRX-${Date.now()}`,
      items: cart.map(i => ({
        id: i.id,
        name: i.name,
        price: i.price,
        qty: i.qty,
        costPrice: products.find(p => p.barcode === i.barcode)?.costPrice || 0
      })),
      total: finalTotal,
      profit: profit,
      payment: paymentMethod === 'Cash' ? pay : finalTotal,
      change: (selectedMember && isDepositChange) ? 0 : kembalian,
      method: paymentMethod,
      timestamp: new Date().toISOString()
    };

    addTransaction(txData);
    setLastTransaction(txData);

    cart.forEach(item => {
      const product = products.find(p => p.barcode === item.barcode);
      if (product) {
        updateStock(product.id, -item.qty);
      }
    });

    playBeep();
    setIsPaymentOpen(false);
    setIsReceiptOpen(true);
    // Modal akan mengurus reset saat ditutup
  };

  const handleNextTransaction = () => {
    clearCart();
    setPaymentAmount("");
    setBarcode('');
    setCustomerPhone("");
    setDiscount(0);
    setSelectedMember(null);
    setIsDepositChange(false);
    setIsReceiptOpen(false);
    setIsPaymentOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const printReceipt = () => {
    if (!lastTransaction) return;
    const printWindow = window.open('', '_blank', 'width=450,height=700');
    if (!printWindow) return;

    const itemsHtml = lastTransaction.items.map((item: any) => `
      <tr>
        <td style="padding: 4px 0;">
          <div style="font-weight: bold;">${item.name}</div>
          <div style="font-size: 10px;">${item.qty} x Rp ${item.price.toLocaleString()}</div>
        </td>
        <td style="text-align: right; vertical-align: top; padding: 4px 0;">
          Rp ${(item.price * item.qty).toLocaleString()}
        </td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Struk SaquMart - ${lastTransaction.id}</title>
          <style>
            @page { margin: 0; }
            body { 
              font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              width: 320px; 
              margin: 0 auto; 
              padding: 30px; 
              color: #000;
              line-height: 1.4;
            }
            .header { text-align: center; margin-bottom: 25px; }
            .store-name { font-size: 22px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: -0.5px; }
            .store-info { font-size: 11px; color: #444; margin-top: 4px; }
            
            .divider { border-top: 1.5px dashed #000; margin: 15px 0; }
            
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th { text-align: left; border-bottom: 1px solid #000; padding-bottom: 5px; }
            
            .totals { margin-top: 15px; font-size: 13px; }
            .total-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
            .grand-total { font-size: 18px; font-weight: 900; border-top: 1px solid #000; padding-top: 8px; margin-top: 8px; }
            
            .footer { text-align: center; margin-top: 30px; font-size: 11px; }
            .transaction-id { font-family: monospace; font-size: 10px; color: #666; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="store-name">${settings.storeName}</h1>
            <div class="store-info">
              ${settings.storeAddress}<br>
              Telp: ${settings.storePhone}
            </div>
          </div>

          <div class="divider"></div>
          
          <table>
            <thead>
              <tr>
                <th>Produk</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="divider"></div>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal</span>
              <span>Rp ${lastTransaction.total.toLocaleString()}</span>
            </div>
            <div class="total-row">
              <span>Metode Bayar</span>
              <span>${lastTransaction.method}</span>
            </div>
            <div class="total-row">
              <span>Tunai</span>
              <span>Rp ${lastTransaction.payment.toLocaleString()}</span>
            </div>
            <div class="total-row">
              <span>Kembali</span>
              <span>Rp ${lastTransaction.change.toLocaleString()}</span>
            </div>
            <div class="total-row grand-total">
              <span>TOTAL</span>
              <span>Rp ${lastTransaction.total.toLocaleString()}</span>
            </div>
          </div>

          <div class="footer">
            <div style="font-weight: bold; margin-bottom: 4px;">${settings.receiptFooter}</div>
            <div>${new Date(lastTransaction.timestamp).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</div>
            <div class="transaction-id">${lastTransaction.id}</div>
          </div>

          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex h-full bg-muted/30">
      <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
        <div className="flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
          <Link to="/dashboard">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-primary tracking-tight">Kasir POS</h1>
            <p className="text-xs text-muted-foreground hidden md:block">F1: Cari • F4: Bayar • Esc: Batal</p>
          </div>
        </div>

        <Card className="border-primary/20 shadow-sm border-2">
          <CardContent className="p-4">
            <form onSubmit={handleManualBarcode} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
              <Input 
                ref={inputRef}
                className="h-16 pl-12 pr-32 text-xl font-medium shadow-lg border-primary/20"
                placeholder="Scan barcode..."
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                autoFocus
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button type="button" variant="ghost" size="icon" className="h-12 w-12 text-amber-500" onClick={() => setIsTempProductOpen(true)}>
                  <PackagePlus className="h-6 w-6" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className={cn("h-12 w-12", isScannerOpen && "bg-primary/10 text-primary")} onClick={() => setIsScannerOpen(!isScannerOpen)}>
                  <Camera className="h-6 w-6" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10">
                <TableRow>
                  <TableHead>Produk</TableHead>
                  <TableHead className="text-center w-32">Qty</TableHead>
                  <TableHead className="text-right">Harga</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground">Keranjang kosong.</TableCell></TableRow>
                )}
                {cart.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.barcode}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(item.id, item.qty - 1)} disabled={item.qty <= 1}><Minus className="h-3 w-3" /></Button>
                        <span className="w-8 text-center font-bold">{item.qty}</span>
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(item.id, item.qty + 1)}><Plus className="h-3 w-3" /></Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">Rp {item.price.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-bold text-primary">Rp {(item.price * item.qty).toLocaleString()}</TableCell>
                    <TableCell><Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => removeFromCart(item.id)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <div className="w-[380px] border-l bg-card p-6 flex flex-col shadow-xl">
        <h2 className="text-lg font-bold mb-4">Ringkasan</h2>
        <div className="space-y-4 flex-1 overflow-y-auto">
          <div className="flex justify-between text-sm text-muted-foreground"><span>Total Item</span><span>{cart.reduce((s, i) => s + i.qty, 0)} Pcs</span></div>
          <div className="flex justify-between text-sm text-muted-foreground"><span>Pajak ({taxRate}%)</span><span>Rp {(total * taxRate / 100).toLocaleString()}</span></div>
          
          <div className="space-y-2">
            <Label className="text-xs">Member (WhatsApp)</Label>
            <div className="flex gap-1">
              <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="h-9" placeholder="08..." />
              <Button size="icon" variant="outline" className="h-9 w-9" onClick={handleCheckMember}><Search className="h-4 w-4" /></Button>
            </div>
            {selectedMember && (
              <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 text-xs">
                <p className="font-bold">{selectedMember.name} • Rp {selectedMember.balance.toLocaleString()}</p>
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input type="checkbox" checked={isDepositChange} onChange={(e) => setIsDepositChange(e.target.checked)} />
                  <span>Jadikan kembalian sebagai Deposit</span>
                </label>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs">Diskon (Rp)</Label>
            <Input type="number" value={discount || ''} onChange={(e) => setDiscount(Number(e.target.value))} className="h-9" placeholder="0" />
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground font-medium">TOTAL PEMBAYARAN</p>
            <div className="text-4xl font-black text-primary tracking-tighter">
              <span className="text-xl mr-1">Rp</span>{finalTotal.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="pt-6 space-y-3">
          <Button size="lg" className="h-16 text-xl font-bold w-full gap-2 rounded-2xl" onClick={() => setIsPaymentOpen(true)} disabled={cart.length === 0}>
            <Banknote className="h-6 w-6" /> BAYAR (F4)
          </Button>
          <Button variant="ghost" className="text-destructive w-full" onClick={clearCart} disabled={cart.length === 0}>Batal</Button>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Selesaikan Pembayaran</DialogTitle></DialogHeader>
          <div className="space-y-6 py-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Total Tagihan</p>
              <h2 className="text-5xl font-black text-primary tracking-tighter">Rp {finalTotal.toLocaleString()}</h2>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant={paymentMethod === 'Cash' ? 'default' : 'outline'} onClick={() => setPaymentMethod('Cash')} className="h-14 font-bold">TUNAI</Button>
              <Button variant={paymentMethod === 'Non-Cash' ? 'default' : 'outline'} onClick={() => setPaymentMethod('Non-Cash')} className="h-14 font-bold">QRIS / DEBIT</Button>
            </div>

            {paymentMethod === 'Cash' && (
              <div className="space-y-4">
                <div className="relative">
                  <Input 
                    type="number" 
                    value={paymentAmount} 
                    onChange={(e) => setPaymentAmount(e.target.value)} 
                    className="h-16 text-4xl font-black text-right pr-4" 
                    placeholder="0"
                    autoFocus
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">Rp</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[50000, 100000, finalTotal].map(v => (
                    <Button key={v} variant="outline" onClick={() => setPaymentAmount(v.toString())} className="font-bold">
                      {v === finalTotal ? 'Pas' : v.toLocaleString()}
                    </Button>
                  ))}
                </div>
                {Number(paymentAmount) >= finalTotal && (
                   <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-center">
                      <p className="text-xs text-green-600 font-bold uppercase">Kembalian</p>
                      <p className="text-2xl font-black text-green-700">Rp {(Number(paymentAmount) - finalTotal).toLocaleString()}</p>
                   </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button className="w-full h-12 text-lg font-bold" onClick={handlePayment}>KONFIRMASI BAYAR</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt Modal */}
      <Dialog open={isReceiptOpen} onOpenChange={(open) => { if(!open) handleNextTransaction(); }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader className="items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <Printer className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl">Transaksi Berhasil</DialogTitle>
          </DialogHeader>
          
          <div className="border-y-2 border-dashed my-4 py-4 space-y-3 font-mono text-sm">
             <div className="text-center font-bold mb-4">
               <p className="text-lg">{settings.storeName}</p>
               <p className="text-[10px] font-normal">{settings.storeAddress}</p>
             </div>
             {lastTransaction?.items.map((item: any, idx: number) => (
               <div key={idx} className="flex justify-between">
                 <span>{item.name} x{item.qty}</span>
                 <span>{(item.price * item.qty).toLocaleString()}</span>
               </div>
             ))}
             <div className="border-t border-dashed pt-3">
               <div className="flex justify-between font-bold">
                 <span>TOTAL</span>
                 <span>Rp {lastTransaction?.total.toLocaleString()}</span>
               </div>
               <div className="flex justify-between text-xs opacity-70">
                 <span>BAYAR ({lastTransaction?.method})</span>
                 <span>{lastTransaction?.payment.toLocaleString()}</span>
               </div>
               <div className="flex justify-between text-xs opacity-70">
                 <span>KEMBALI</span>
                 <span>{lastTransaction?.change.toLocaleString()}</span>
               </div>
             </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button className="w-full gap-2" onClick={printReceipt}><Printer className="h-4 w-4" /> Cetak Struk Fisik</Button>
            <Button variant="outline" className="w-full" onClick={handleNextTransaction}>Transaksi Baru</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isTempProductOpen} onOpenChange={setIsTempProductOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Produk Sementara</DialogTitle></DialogHeader>
          <form onSubmit={handleAddTempProduct} className="space-y-4">
             <div className="space-y-2">
               <Label>Nama Barang</Label>
               <Input value={tempProduct.name} onChange={(e) => setTempProduct({...tempProduct, name: e.target.value})} placeholder="Contoh: Gorengan" />
             </div>
             <div className="space-y-2">
               <Label>Harga</Label>
               <Input type="number" value={tempProduct.price} onChange={(e) => setTempProduct({...tempProduct, price: e.target.value})} placeholder="0" />
             </div>
             <Button type="submit" className="w-full">Tambah</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
