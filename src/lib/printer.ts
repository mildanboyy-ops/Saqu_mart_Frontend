// Printer Utility

export const printReceipt = (contentHtml: string) => {
  // 1. Create a hidden iframe for silent printing
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  doc.write(contentHtml);
  doc.close();

  // 2. Play printer sound effect
  playPrinterSound();

  // 3. Trigger print
  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    
    // Clean up after print dialog is closed
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 500);
};

const playPrinterSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const duration = 1.5; // seconds
    const oscillatorCount = 3;
    
    for (let i = 0; i < oscillatorCount; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = i % 2 === 0 ? 'square' : 'sawtooth';
      osc.frequency.setValueAtTime(100 + (i * 50), ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10 + (i * 20), ctx.currentTime + duration);
      
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    }
  } catch (e) {
    console.warn('Printer sound could not be played', e);
  }
};

export const generateReceiptHtml = (data: any, settings: any) => {
  const itemsHtml = data.items.map((item: any) => `
    <div class="item">
      <div class="item-main">
        <span class="item-name">${item.name}</span>
        <span class="item-price">Rp ${(item.price * item.qty).toLocaleString()}</span>
      </div>
      <div class="item-sub">${item.qty} x Rp ${item.price.toLocaleString()}</div>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          @page { margin: 0; size: 58mm auto; }
          body { 
            font-family: 'Courier New', Courier, monospace; 
            width: 58mm; 
            margin: 0; 
            padding: 5mm; 
            font-size: 10pt; 
            color: #000;
          }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .store-name { font-size: 14pt; margin-bottom: 2mm; }
          .divider { border-top: 1px dashed #000; margin: 3mm 0; }
          .item { margin-bottom: 2mm; }
          .item-main { display: flex; justify-content: space-between; }
          .item-sub { font-size: 8pt; }
          .totals { margin-top: 4mm; }
          .total-row { display: flex; justify-content: space-between; margin-bottom: 1mm; }
          .grand-total { font-size: 12pt; font-weight: bold; margin-top: 2mm; border-top: 1px solid #000; padding-top: 1mm; }
          .footer { margin-top: 5mm; font-size: 8pt; text-align: center; }
          .qr { margin: 4mm auto; width: 30mm; height: 30mm; background: #eee; display: flex; align-items: center; justify-content: center; font-size: 6pt; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="center bold store-name">${settings.storeName}</div>
        <div class="center">${settings.storeAddress}</div>
        <div class="center">Telp: ${settings.storePhone}</div>
        
        <div class="divider"></div>
        <div class="center">STRUK PENJUALAN</div>
        <div class="center">${data.id}</div>
        <div class="center">${new Date(data.timestamp).toLocaleString('id-ID')}</div>
        <div class="divider"></div>
        
        ${itemsHtml}
        
        <div class="divider"></div>
        
        <div class="totals">
          <div class="total-row">
            <span>Subtotal</span>
            <span>Rp ${data.total.toLocaleString()}</span>
          </div>
          <div class="total-row">
            <span>Diskon</span>
            <span>Rp ${(data.discount || 0).toLocaleString()}</span>
          </div>
          <div class="total-row grand-total">
            <span>TOTAL</span>
            <span>Rp ${data.total.toLocaleString()}</span>
          </div>
          <div class="total-row">
            <span>Bayar (${data.method})</span>
            <span>Rp ${data.payment.toLocaleString()}</span>
          </div>
          <div class="total-row">
            <span>Kembali</span>
            <span>Rp ${data.change.toLocaleString()}</span>
          </div>
        </div>
        
        <div class="divider"></div>
        
        <div class="footer">
          <div class="bold">${settings.receiptFooter}</div>
          <p>Terima kasih telah berbelanja di SaquMart. Berkah untuk semua.</p>
          <div class="qr">SAQU-TX-VERIFIED</div>
          <div style="font-size: 6pt;">Hash: ${data.id.substring(0, 16)}...</div>
        </div>
        
        <script>
          window.onload = () => {
            // No auto-print here, we call it from the iframe context
          };
        </script>
      </body>
    </html>
  `;
};
