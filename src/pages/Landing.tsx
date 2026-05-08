import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ShoppingCart, Package, ShieldCheck, BarChart3, ChevronRight, Store, ChevronDown, Mail, MapPin, Phone, Globe, Smartphone, MessagesSquare } from "lucide-react"
import { useState } from "react"

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b last:border-0 py-4">
      <button className="flex w-full justify-between items-center text-left font-semibold text-lg" onClick={() => setIsOpen(!isOpen)}>
        {question}
        <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <p className="mt-4 text-muted-foreground leading-relaxed animate-in slide-in-from-top-2 fade-in">{answer}</p>}
    </div>
  )
}

export default function Landing() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <nav className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-2xl text-primary">
            <Store className="h-8 w-8" />
            <span>SaquMart</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#features" className="hover:text-primary transition-colors">Fitur</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Harga</a>
            <a href="#testimonials" className="hover:text-primary transition-colors">Testimoni</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
            <a href="#about" className="hover:text-primary transition-colors">Tentang Kami</a>
            <a href="#contact" className="hover:text-primary transition-colors">Kontak</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Masuk</Button>
            </Link>
            <Link to="/register">
              <Button className="rounded-full px-6">Mulai Sekarang</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-400 rounded-full blur-[120px]" />
        </div>
        
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 py-1 px-4 border-primary/20 bg-primary/5 text-primary">
              Sistem POS & Inventaris Terbaik untuk Toko Berkah
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Kelola Toko Jadi <br /> <span className="text-primary">Lebih Berkah & Teratur</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-muted-foreground mb-10">
              SaquMart membantu Anda mengelola kasir, stok barang, hingga laporan keuangan dalam satu sistem yang cepat, aman, dan mudah digunakan.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full group">
                  Coba Gratis Sekarang 
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full">
                  Lihat Demo Kasir
                </Button>
              </Link>
            </div>
            
            <div className="mt-20 pt-10 border-t border-primary/10">
              <p className="text-sm font-semibold text-muted-foreground mb-6 uppercase tracking-widest">Dipercaya oleh lebih dari 5.000+ Toko di Indonesia</p>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <span className="font-bold text-xl flex items-center gap-2"><Store className="h-6 w-6"/> RetailPlus</span>
                <span className="font-bold text-xl flex items-center gap-2"><ShoppingCart className="h-6 w-6"/> MartPro</span>
                <span className="font-bold text-xl flex items-center gap-2"><Package className="h-6 w-6"/> GrosirKita</span>
                <span className="font-bold text-xl flex items-center gap-2"><BarChart3 className="h-6 w-6"/> TokoAmanah</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Fitur Utama SaquMart</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Dirancang untuk kecepatan transaksi dan akurasi data inventaris Anda.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShoppingCart, title: "Kasir POS Cepat", desc: "Scan barcode, cetak struk, dan kirim struk digital dalam sekejap." },
              { icon: Package, title: "Stok Terkontrol", desc: "Pantau stok masuk dan keluar secara real-time dengan sistem notifikasi." },
              { icon: BarChart3, title: "Laporan Lengkap", desc: "Analisis harian hingga tahunan dengan grafik yang mudah dimengerti." },
              { icon: ShieldCheck, title: "Aman & Terpercaya", desc: "Keamanan data tingkat tinggi dengan sistem manajemen hak akses user." },
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pilihan Paket Fleksibel</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Mulai dari gratis untuk UMKM, hingga fitur lengkap untuk jaringan toko besar.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-all flex flex-col">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <p className="text-muted-foreground mb-4">Cocok untuk toko kecil baru buka.</p>
              <div className="mb-6"><span className="text-4xl font-black">Gratis</span></div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> 1 Kasir (User)</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Maks 100 Produk</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Transaksi Standar</li>
              </ul>
              <Link to="/register"><Button className="w-full" variant="outline">Mulai Gratis</Button></Link>
            </div>
            <div className="bg-card p-8 rounded-2xl border-2 border-primary shadow-lg relative flex flex-col transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Paling Laris</div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <p className="text-muted-foreground mb-4">Untuk toko berkembang & ramai.</p>
              <div className="mb-6"><span className="text-4xl font-black">Rp 99rb</span><span className="text-muted-foreground">/bln</span></div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> 5 Kasir (User)</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Produk Tak Terbatas</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Laporan Lengkap</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Cetak Struk Bluetooth</li>
              </ul>
              <Link to="/register"><Button className="w-full">Pilih Pro</Button></Link>
            </div>
            <div className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-all flex flex-col">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <p className="text-muted-foreground mb-4">Solusi jaringan banyak cabang.</p>
              <div className="mb-6"><span className="text-4xl font-black">Custom</span></div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Multi-Cabang</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Akses API Integrasi</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Dedicated Support</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Custom Fitur</li>
              </ul>
              <a href="#contact"><Button className="w-full" variant="outline">Hubungi Kami</Button></a>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Apa Kata Mereka?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Ribuan toko telah membuktikan kemudahan SaquMart.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: "Ahmad Rizky", role: "Pemilik Minimarket", text: "Sistemnya super cepat. Kasir nggak pernah ngeluh lemot lagi pas antrian panjang." },
              { name: "Siti Nurhaliza", role: "Owner Butik", text: "Laporannya sangat detail. Saya bisa pantau untung rugi tiap hari langsung dari HP." },
              { name: "Budi Santoso", role: "Toko Sembako", text: "Fitur stok masuk keluarnya juara! Gak ada lagi barang hilang nggak ketahuan." }
            ].map((t, i) => (
              <div key={i} className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all">
                <div className="flex gap-1 mb-4 text-orange-400">
                  {"★★★★★"}
                </div>
                <p className="text-muted-foreground italic mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{t.name}</h4>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pertanyaan Umum</h2>
            <p className="text-muted-foreground">Jawaban cepat untuk pertanyaan yang sering diajukan.</p>
          </div>
          <div className="bg-card rounded-2xl border shadow-sm p-6 md:p-8">
            <FAQItem question="Apakah SaquMart bisa dipakai offline?" answer="Untuk saat ini SaquMart membutuhkan koneksi internet (online) agar data transaksi langsung tersimpan dengan aman ke server dan bisa dipantau real-time dari mana saja." />
            <FAQItem question="Bagaimana cara berlangganan paket Pro?" answer="Anda bisa mendaftar akun gratis terlebih dahulu, kemudian melakukan upgrade ke paket Pro melalui menu Pengaturan di dalam Dashboard aplikasi." />
            <FAQItem question="Apakah data saya aman?" answer="Tentu! Kami menggunakan enkripsi standar industri dan pencadangan (backup) otomatis setiap hari untuk memastikan data toko Anda tetap aman dan tidak hilang." />
            <FAQItem question="Bisa dipakai di HP atau Tablet?" answer="Bisa. SaquMart dirancang responsif sehingga nyaman digunakan di HP, Tablet (iPad/Android), maupun layar komputer Kasir (PC/Laptop)." />
          </div>
        </div>
      </section>

      <section id="about" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Tentang Kami</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              SaquMart (Sahabat Quran Mart) hadir untuk memberikan solusi Point of Sale (POS) yang modern, cepat, dan berkah. Kami percaya bahwa manajemen toko yang baik adalah kunci kesuksesan usaha. Dengan antarmuka yang ramah pengguna, sistem yang aman, dan integrasi penuh, kami siap membantu UMKM hingga ritel besar mencapai efisiensi operasional maksimal.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Kontak Kami</h2>
            <p className="text-lg text-muted-foreground mb-12">
              Ada pertanyaan atau butuh bantuan lebih lanjut? Tim support kami siap membantu Anda 24/7.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <h4 className="font-bold text-lg mb-2 text-primary">Alamat</h4>
                <p className="text-muted-foreground">Jl. Berkah No. 123, Jakarta Selatan, Indonesia</p>
              </div>
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <h4 className="font-bold text-lg mb-2 text-primary">Email</h4>
                <p className="text-muted-foreground">support@saqumart.com<br/>info@saqumart.com</p>
              </div>
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <h4 className="font-bold text-lg mb-2 text-primary">Telepon</h4>
                <p className="text-muted-foreground">+62 811 2233 4455<br/>(021) 555-1234</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-16 border-t bg-card text-card-foreground">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-2 font-bold text-2xl text-primary">
                <Store className="h-8 w-8" />
                <span>SaquMart</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Platform Point of Sale (POS) dan manajemen inventaris modern yang dirancang khusus untuk UMKM dan jaringan ritel. Kelola toko Anda menjadi lebih berkah, efisien, dan menguntungkan bersama SaquMart.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"><Globe className="h-5 w-5" /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"><Smartphone className="h-5 w-5" /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"><MessagesSquare className="h-5 w-5" /></a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Perusahaan</h4>
              <ul className="space-y-4">
                <li><a href="#about" className="text-muted-foreground hover:text-primary transition-colors">Tentang Kami</a></li>
                <li><a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Fitur Produk</a></li>
                <li><a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Daftar Harga</a></li>
                <li><a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors">Testimoni Pelanggan</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Karir (Hiring)</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Bantuan & Panduan</h4>
              <ul className="space-y-4">
                <li><a href="#faq" className="text-muted-foreground hover:text-primary transition-colors">Pusat Bantuan (FAQ)</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Tutorial Penggunaan</a></li>
                <li><a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">Hubungi Support</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Syarat & Ketentuan</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Kebijakan Privasi</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Berlangganan Info</h4>
              <p className="text-muted-foreground mb-4">Dapatkan tips bisnis ritel dan penawaran menarik dari kami setiap minggunya.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email Anda..." className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                <Button>Kirim</Button>
              </div>
            </div>
          </div>
          
          <div className="border-t py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2026 SaquMart (Sahabat Quran Mart). Hak Cipta Dilindungi Undang-Undang.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4"/> Jakarta, ID</span>
              <span className="flex items-center gap-2"><Phone className="h-4 w-4"/> +62 811 2233</span>
              <span className="flex items-center gap-2"><Mail className="h-4 w-4"/> halo@saqumart.com</span>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  )
}
