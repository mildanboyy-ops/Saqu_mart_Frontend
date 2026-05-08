import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface BarcodeScannerProps {
  onScan: (decodedText: string) => void;
}

export default function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 150 } },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        onScan(decodedText);
      },
      () => {
      }
    );

    return () => {
      scanner.clear().catch(error => {
        console.error("Failed to clear scanner", error);
      });
    };
  }, [onScan]);

  return (
    <div className="w-full max-w-sm mx-auto overflow-hidden rounded-xl border bg-black/5">
      <div id="reader" className="w-full"></div>
    </div>
  );
}
