import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ShoppingCart, Package, ShieldCheck, BarChart3, ChevronRight, Store, ChevronDown, Mail, MapPin, Phone, Globe, Smartphone, MessagesSquare } from "lucide-react"
import { useState } from "react"
import GlobalLoading from "@/components/GlobalLoading"

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5 last:border-0 py-6 px-4 hover:bg-white/5 transition-colors rounded-2xl group">
      <button className="flex w-full justify-between items-center text-left font-black text-xl text-white group-hover:text-emerald-400 transition-colors" onClick={() => setIsOpen(!isOpen)}>
        {question}
        <div className={`p-2 rounded-full bg-white/5 transition-all ${isOpen ? 'bg-primary text-white rotate-180' : 'text-slate-500'}`}>
          <ChevronDown className="h-5 w-5" />
        </div>
      </button>
      {isOpen && (
        <motion.p 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-6 text-slate-400 leading-relaxed font-medium text-lg border-l-4 border-primary pl-6"
        >
          {answer}
        </motion.p>
      )}
    </div>
  )
}

export default function Landing() {
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate(path);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <GlobalLoading loading={isNavigating} />
      
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-2xl text-emerald-400">
            <Store className="h-8 w-8" />
            <span>SaquMart</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#features" className="hover:text-emerald-400 transition-colors text-slate-300">Fitur</a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors text-slate-300">Harga</a>
            <a href="#testimonials" className="hover:text-emerald-400 transition-colors text-slate-300">Testimoni</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors text-slate-300">FAQ</a>
            <a href="#about" className="hover:text-emerald-400 transition-colors text-slate-300">Tentang Kami</a>
            <a href="#contact" className="hover:text-emerald-400 transition-colors text-slate-300">Kontak</a>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="font-bold text-slate-400 hover:text-emerald-400" onClick={() => handleNavigate("/login")}>Sign In</Button>
            <Button className="rounded-full px-6 font-black bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 text-white" onClick={() => handleNavigate("/register")}>Coba Gratis</Button>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-950">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-900 rounded-full blur-[150px]" />
        </div>
        
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 py-1.5 px-6 border-emerald-500/20 bg-emerald-500/5 text-emerald-400 font-black uppercase tracking-widest text-[10px]">
              Sistem POS & Inventaris Terbaik untuk Toko Berkah
            </Badge>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-br from-white to-slate-500 bg-clip-text text-transparent leading-[1.1]">
              Kelola Toko Jadi <br /> <span className="text-primary italic">Lebih Berkah & Teratur</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-slate-400 mb-12 font-medium">
              SaquMart membantu Anda mengelola kasir, stok barang, hingga laporan keuangan dalam satu sistem yang cepat, aman, dan mudah digunakan.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={() => handleNavigate("/register")} className="h-16 px-10 text-xl rounded-[2rem] group premium-button font-black text-white">
                Mulai Bisnis Berkah Anda
                <ChevronRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            </div>
            
            <div className="mt-20 pt-10 border-t border-white/5">
              <p className="text-xs font-black text-slate-500 mb-8 uppercase tracking-[0.3em]">Dipercaya oleh lebih dari 5.000+ Toko di Indonesia</p>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-20 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                <span className="font-black text-2xl flex items-center gap-2 tracking-tighter text-white"><Store className="h-6 w-6 text-primary"/> RetailPlus</span>
                <span className="font-black text-2xl flex items-center gap-2 tracking-tighter text-white"><ShoppingCart className="h-6 w-6 text-primary"/> MartPro</span>
                <span className="font-black text-2xl flex items-center gap-2 tracking-tighter text-white"><Package className="h-6 w-6 text-primary"/> GrosirKita</span>
                <span className="font-black text-2xl flex items-center gap-2 tracking-tighter text-white"><BarChart3 className="h-6 w-6 text-primary"/> TokoAmanah</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="testimonials" className="py-32 bg-slate-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-white">Apa Kata Mereka?</h2>
            <p className="text-slate-400 max-w-xl mx-auto font-medium text-lg">Ribuan toko telah membuktikan kemudahan SaquMart.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: "Ahmad Rizky", role: "Pemilik Minimarket", text: "Sistemnya super cepat. Kasir nggak pernah ngeluh lemot lagi pas antrian panjang.", color: "bg-white/5 border-white/10" },
              { name: "Siti Nurhaliza", role: "Owner Butik", text: "Laporannya sangat detail. Saya bisa pantau untung rugi tiap hari langsung dari HP.", color: "bg-white/5 border-white/10" },
              { name: "Budi Santoso", role: "Toko Sembako", text: "Fitur stok masuk keluarnya juara! Gak ada lagi barang hilang nggak ketahuan.", color: "bg-white/5 border-white/10" }
            ].map((t, i) => (
              <div key={i} className={`${t.color} p-10 rounded-[2.5rem] border backdrop-blur-xl shadow-2xl hover:shadow-primary/5 transition-all relative group`}>
                <div className="absolute top-10 right-10 text-primary/10 group-hover:text-primary/20 transition-colors">
                  <MessagesSquare className="h-16 w-16" />
                </div>
                <div className="flex gap-1 mb-6 text-amber-400">
                  {"★★★★★"}
                </div>
                <p className="text-slate-300 italic mb-10 text-lg font-medium leading-relaxed relative z-10">"{t.text}"</p>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-white tracking-tight">{t.name}</h4>
                    <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-32 bg-[#051c12]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-white">Fitur Utama SaquMart</h2>
            <p className="text-emerald-400/80 max-w-xl mx-auto font-medium text-lg">Dirancang untuk kecepatan transaksi dan akurasi data inventaris Anda.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShoppingCart, title: "Kasir POS Cepat", desc: "Scan barcode, cetak struk, dan kirim struk digital dalam sekejap.", color: "bg-white/5" },
              { icon: Package, title: "Stok Terkontrol", desc: "Pantau stok masuk dan keluar secara real-time dengan sistem notifikasi.", color: "bg-white/5" },
              { icon: BarChart3, title: "Laporan Lengkap", desc: "Analisis harian hingga tahunan dengan grafik yang mudah dimengerti.", color: "bg-white/5" },
              { icon: ShieldCheck, title: "Aman & Terpercaya", desc: "Keamanan data tingkat tinggi dengan sistem manajemen hak akses user.", color: "bg-white/5" },
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10, scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                className={`${f.color} p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-xl shadow-2xl transition-all`}
              >
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-primary/20">
                  <f.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight text-white">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-32 bg-slate-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-white">Pilihan Paket Fleksibel</h2>
            <p className="text-slate-400 max-w-xl mx-auto font-medium">Mulai dari gratis untuk UMKM, hingga fitur lengkap untuk jaringan toko besar.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col hover:border-primary/50 transition-all group backdrop-blur-xl">
              <h3 className="text-2xl font-black mb-2 tracking-tight text-white group-hover:text-primary transition-colors">Starter</h3>
              <p className="text-slate-500 mb-6 font-medium text-sm italic">Cocok untuk toko kecil baru buka.</p>
              <div className="mb-10 text-white"><span className="text-5xl font-black tracking-tighter">Gratis</span></div>
              <ul className="space-y-4 mb-10 flex-1 text-slate-300">
                <li className="flex items-center gap-3 font-bold text-sm"><div className="h-2 w-2 rounded-full bg-primary" /> 1 Kasir (User)</li>
                <li className="flex items-center gap-3 font-bold text-sm"><div className="h-2 w-2 rounded-full bg-primary" /> Maks 100 Produk</li>
                <li className="flex items-center gap-3 font-bold text-sm"><div className="h-2 w-2 rounded-full bg-primary" /> Transaksi Standar</li>
              </ul>
              <Button className="w-full h-14 rounded-2xl font-black text-lg text-white border-white/10 hover:bg-white/5" variant="outline" onClick={() => handleNavigate("/register")}>Mulai Gratis</Button>
            </div>
            <div className="bg-[#0a2e1f] p-12 rounded-[3.5rem] border-4 border-primary shadow-2xl relative flex flex-col transform md:-translate-y-6">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-xl">Paling Laris</div>
              <h3 className="text-2xl font-black mb-2 tracking-tight text-white">Pro</h3>
              <p className="text-white/60 mb-6 font-medium text-sm italic">Untuk toko berkembang & ramai.</p>
              <div className="mb-10 text-white"><span className="text-6xl font-black tracking-tighter text-emerald-400">Rp 99rb</span><span className="text-white/40 text-sm font-bold">/bln</span></div>
              <ul className="space-y-4 mb-10 flex-1 text-white/80">
                <li className="flex items-center gap-3 font-bold text-sm"><ShieldCheck className="h-5 w-5 text-emerald-400" /> 5 Kasir (User)</li>
                <li className="flex items-center gap-3 font-bold text-sm"><ShieldCheck className="h-5 w-5 text-emerald-400" /> Produk Tak Terbatas</li>
                <li className="flex items-center gap-3 font-bold text-sm"><ShieldCheck className="h-5 w-5 text-emerald-400" /> Laporan Lengkap</li>
                <li className="flex items-center gap-3 font-bold text-sm"><ShieldCheck className="h-5 w-5 text-emerald-400" /> Cetak Struk Bluetooth</li>
              </ul>
              <Button className="w-full h-16 rounded-2xl font-black text-xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-emerald-900/40" onClick={() => handleNavigate("/register")}>Pilih Paket Pro</Button>
            </div>
            <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col hover:border-primary/50 transition-all group backdrop-blur-xl">
              <h3 className="text-2xl font-black mb-2 tracking-tight text-white">Enterprise</h3>
              <p className="text-slate-500 mb-6 font-medium text-sm italic">Solusi jaringan banyak cabang.</p>
              <div className="mb-10 text-white"><span className="text-5xl font-black tracking-tighter text-slate-500">Custom</span></div>
              <ul className="space-y-4 mb-10 flex-1 text-slate-300">
                <li className="flex items-center gap-3 font-bold text-sm"><div className="h-2 w-2 rounded-full bg-slate-500" /> Multi-Cabang</li>
                <li className="flex items-center gap-3 font-bold text-sm"><div className="h-2 w-2 rounded-full bg-slate-500" /> Akses API Integrasi</li>
                <li className="flex items-center gap-3 font-bold text-sm"><div className="h-2 w-2 rounded-full bg-slate-500" /> Dedicated Support</li>
                <li className="flex items-center gap-3 font-bold text-sm"><div className="h-2 w-2 rounded-full bg-slate-500" /> Custom Fitur</li>
              </ul>
              <Button className="w-full h-14 rounded-2xl font-black text-lg text-white border-white/10 hover:bg-white/5" variant="outline" onClick={() => handleNavigate("/contact")}>Hubungi Kami</Button>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-32 bg-[#051c12] relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -ml-32" />
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 relative">
              <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-2xl -z-10" />
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-12 rounded-[3rem] shadow-2xl relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Store className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white tracking-tighter">SaquMart</h3>
                    <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs">Visi & Misi Kami</p>
                  </div>
                </div>
                <p className="text-slate-300 text-lg leading-relaxed mb-8 italic">
                  "Menjadi mitra teknologi terdepan bagi UMKM Indonesia dengan menghadirkan solusi digital yang tidak hanya canggih, tapi juga membawa keberkahan dalam setiap transaksi."
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                    <div className="text-3xl font-black text-white mb-1">5K+</div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Pengguna Aktif</div>
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                    <div className="text-3xl font-black text-white mb-1">99%</div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">SLA Uptime</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 space-y-8">
              <Badge className="py-1.5 px-6 border-emerald-500/20 bg-emerald-500/5 text-emerald-400 font-black uppercase tracking-widest text-[10px]">Tentang Kami</Badge>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">Dibangun dengan <span className="text-primary">Inovasi & Nilai Barakah</span></h2>
              <p className="text-xl text-slate-400 leading-relaxed font-medium">
                SaquMart berawal dari semangat untuk mendigitalisasi pasar tradisional dan toko kelontong di Indonesia. Kami percaya bahwa teknologi harus dapat diakses oleh siapa saja, mulai dari pedagang kecil hingga pengusaha besar.
              </p>
              <ul className="space-y-4">
                {[
                  "Transparansi data keuangan 100% akurat.",
                  "Dukungan komunitas UMKM Berkah.",
                  "Pengembangan fitur berdasarkan feedback user.",
                  "Keamanan data yang terjamin dan terenkripsi."
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-white font-bold">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-32 bg-slate-950 relative">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-20">
            <Badge className="mb-4 py-1.5 px-6 border-emerald-500/20 bg-emerald-500/5 text-emerald-400 font-black uppercase tracking-widest text-[10px]">FAQ</Badge>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-4">Pertanyaan Umum</h2>
            <p className="text-slate-500 font-medium text-lg">Segala hal yang perlu Anda ketahui tentang SaquMart.</p>
          </div>
          
          <div className="bg-white/5 rounded-[3rem] border border-white/10 p-10 backdrop-blur-xl shadow-2xl space-y-2">
            <FAQItem 
              question="Apakah SaquMart bisa digunakan tanpa internet?" 
              answer="Ya! SaquMart memiliki fitur mode offline. Transaksi akan disimpan secara lokal dan akan otomatis disinkronkan ke cloud saat perangkat Anda kembali terhubung ke internet." 
            />
            <FAQItem 
              question="Perangkat apa saja yang didukung?" 
              answer="SaquMart berbasis web (SaaS), sehingga Anda bisa mengaksesnya melalui Browser di Laptop (Windows/Mac), Tablet, maupun Smartphone Android/iOS." 
            />
            <FAQItem 
              question="Bagaimana dengan keamanan data toko saya?" 
              answer="Kami menggunakan enkripsi tingkat bank untuk melindungi data Anda. Data dicadangkan (backup) secara otomatis setiap jam ke server cloud yang aman." 
            />
            <FAQItem 
              question="Apakah saya bisa mencetak struk dengan printer bluetooth?" 
              answer="Tentu. SaquMart mendukung berbagai jenis printer thermal, baik menggunakan koneksi USB di PC maupun Bluetooth di perangkat mobile." 
            />
            <FAQItem 
              question="Jika ada kendala, kemana saya harus menghubungi?" 
              answer="Tim support kami tersedia 24/7 melalui WhatsApp Support dan Email. Kami siap membantu instalasi hingga troubleshooting kapan saja." 
            />
          </div>
        </div>
      </section>
      <section id="contact" className="py-32 bg-[#051c12]">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-white">Kontak Kami</h2>
            <p className="text-lg text-emerald-400/80 mb-16 font-medium">
              Ada pertanyaan atau butuh bantuan lebih lanjut? Tim support kami siap membantu Anda 24/7.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 shadow-2xl hover:shadow-primary/5 transition-all group backdrop-blur-xl">
                <div className="bg-primary w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary/20"><MapPin className="h-6 w-6" /></div>
                <h4 className="font-black text-xl mb-3 tracking-tight text-white">Alamat Toko</h4>
                <p className="text-slate-400 text-sm leading-relaxed font-medium italic">Bumi Sawangan Indah 2 Blok D2 No 90, RT.005/RW.010, Pengasinan, Kec. Sawangan, Kota Depok, Jawa Barat 16518</p>
              </div>
              <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 shadow-2xl hover:shadow-emerald-500/5 transition-all group backdrop-blur-xl">
                <div className="bg-emerald-500 w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20"><Mail className="h-6 w-6" /></div>
                <h4 className="font-black text-xl mb-3 tracking-tight text-white">Email Support</h4>
                <p className="text-slate-400 text-sm leading-relaxed font-medium italic">support@saqumart.com<br/>info@saqumart.com</p>
              </div>
              <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 shadow-2xl hover:shadow-amber-500/5 transition-all group backdrop-blur-xl">
                <div className="bg-amber-500 w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/20"><Phone className="h-6 w-6" /></div>
                <h4 className="font-black text-xl mb-3 tracking-tight text-white">Nomor Telepon</h4>
                <p className="text-slate-400 text-sm leading-relaxed font-medium italic">0858-1754-1154<br/>(021) 555-1234</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-24 border-t bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="space-y-8">
              <div className="flex items-center gap-3 font-black text-3xl text-emerald-400">
                <Store className="h-10 w-10" />
                <span className="tracking-tighter">SaquMart</span>
              </div>
              <p className="text-slate-400 leading-relaxed font-medium">
                Platform Point of Sale (POS) dan manajemen inventaris modern yang dirancang khusus untuk UMKM dan jaringan ritel. Kelola toko Anda menjadi lebih berkah, efisien, dan menguntungkan bersama SaquMart.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all"><Globe className="h-6 w-6" /></a>
                <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all"><Smartphone className="h-6 w-6" /></a>
                <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all"><MessagesSquare className="h-6 w-6" /></a>
              </div>
            </div>
            
            <div>
              <h4 className="font-black text-lg mb-8 uppercase tracking-[0.2em] text-emerald-400">Perusahaan</h4>
              <ul className="space-y-4 font-bold text-slate-400">
                <li><a href="#about" className="hover:text-white transition-colors">Tentang Kami</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Fitur Produk</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Daftar Harga</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Testimoni Pelanggan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Karir (Hiring)</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-black text-lg mb-8 uppercase tracking-[0.2em] text-emerald-400">Bantuan</h4>
              <ul className="space-y-4 font-bold text-slate-400">
                <li><a href="#faq" className="hover:text-white transition-colors">Pusat Bantuan (FAQ)</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorial Penggunaan</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Hubungi Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-lg mb-8 uppercase tracking-[0.2em] text-emerald-400">Official Office</h4>
              <div className="space-y-6 text-slate-400">
                <div className="flex gap-4">
                  <MapPin className="h-6 w-6 text-primary shrink-0" />
                  <p className="text-sm font-medium leading-relaxed">Bumi Sawangan Indah 2 Blok D2 No 90, RT.005/RW.010, Pengasinan, Kec. Sawangan, Kota Depok, Jawa Barat 16518</p>
                </div>
                <div className="flex gap-4">
                  <Phone className="h-6 w-6 text-primary shrink-0" />
                  <p className="text-sm font-medium leading-relaxed">0858-1754-1154</p>
                </div>
                <div className="flex gap-4">
                  <Mail className="h-6 w-6 text-primary shrink-0" />
                  <p className="text-sm font-medium leading-relaxed">support@saqumart.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-sm text-slate-500 font-bold text-center md:text-left tracking-tight">
              © 2026 <span className="text-emerald-400">SaquMart Ecosystem</span>. All Rights Reserved. Crafted with Barakah.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              <span className="flex items-center gap-2"><MapPin className="h-3 w-3"/> Depok, ID</span>
              <span className="flex items-center gap-2 border-l border-white/10 pl-8"><ShieldCheck className="h-3 w-3"/> ISO 27001 SECURE</span>
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
