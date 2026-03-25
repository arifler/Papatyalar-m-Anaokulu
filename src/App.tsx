/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { Routes, Route, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { db, onSnapshot, doc, collection, addDoc, serverTimestamp } from "./firebase";
import Admin from "./Admin";
import Gallery from "./Gallery";
import { 
  Clock, 
  Heart, 
  Palette, 
  Users, 
  MapPin, 
  Phone, 
  Instagram, 
  CheckCircle2,
  Sparkles,
  Baby,
  Sun,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Daisy Icon Component
const DaisyIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    <circle cx="50" cy="50" r="12" className="text-accent" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
      <ellipse 
        key={angle}
        cx="50" 
        cy="25" 
        rx="10" 
        ry="20" 
        transform={`rotate(${angle} 50 50)`} 
        className="text-white fill-current stroke-black/5"
      />
    ))}
  </svg>
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/galeri" element={<Gallery />} />
    </Routes>
  );
}

function Home() {
  const [content, setContent] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formState, setFormState] = useState({ name: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'content', 'main'), (doc) => {
      if (doc.exists()) {
        setContent(doc.data());
      }
    });
    return () => unsub();
  }, []);

  // Auto-slide
  useEffect(() => {
    if (!content?.slides?.length) return;
    const duration = (content?.slideDuration || 5) * 1000;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % content.slides.length);
    }, duration);
    return () => clearInterval(timer);
  }, [content?.slides, content?.slideDuration]);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.phone) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'messages'), {
        ...formState,
        createdAt: serverTimestamp(),
        status: 'new'
      });
      setSubmitStatus('success');
      setFormState({ name: '', phone: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
    setIsSubmitting(false);
  };

  // Fallback data
  const data = content || {
    slides: [
      { title: "Doğayla İç İçe Bir Yuva", subtitle: "Güneşle Açan Papatyalar", imageUrl: "https://picsum.photos/seed/kids-nature-1/1920/1080" },
      { title: "Sevgiyle Büyüyoruz", subtitle: "Mutlu Çocuklar, Mutlu Yarınlar", imageUrl: "https://picsum.photos/seed/kids-playing-2/1920/1080" },
      { title: "Yetenekleri Keşfediyoruz", subtitle: "Sanat ve Oyun Atölyeleri", imageUrl: "https://picsum.photos/seed/kids-art-2/1920/1080" }
    ],
    hero: {
      title: "Doğayla İç İçe Bir Yuva",
      subtitle: "Güneşle Açan Papatyalar",
      description: "Papatyalarım Anaokulu'nda her çocuk özel bir çiçektir. Sıcak bir ortamda, sevgiyle ve değerlerimizle büyüyoruz.",
      imageUrl: "https://picsum.photos/seed/kids-art-class/800/1000"
    },
    features: [
      { title: "4-6 Yaş Grubu", desc: "Her yaşın gelişimsel ihtiyacına göre tasarlanmış, oyun temelli sınıflar.", iconName: "Baby" },
      { title: "Değerler Eğitimi", desc: "Kökleri sağlam, dalları sevgiye uzanan bir karakter eğitimi programı.", iconName: "Heart" },
      { title: "Atölye Dünyası", desc: "Sanattan bilime, her gün yeni bir keşif ve yaratıcılık yolculuğu.", iconName: "Palette" }
    ],
    education: {
      title: "Karakterimiz Papatya Gibi Saf",
      description: "Değerler eğitimi programımızla, çocuklarımızın içindeki iyiliği ve güzelliği besliyoruz.",
      items: ["Dürüstlük ve Güven", "Doğa Sevgisi", "Paylaşma Kültürü", "Nezaket Kuralları"],
      imageUrl1: "https://picsum.photos/seed/kids-playground-fun/500/700",
      imageUrl2: "https://picsum.photos/seed/kids-reading-group/500/700"
    },
    workshops: [
      { title: "Mutfak Sanatları", imageUrl: "https://picsum.photos/seed/kids-baking-activity/400/600", color: "bg-orange-400" },
      { title: "Doğa Atölyesi", imageUrl: "https://picsum.photos/seed/kids-gardening-activity/400/600", color: "bg-green-400" },
      { title: "Görsel Sanatlar", imageUrl: "https://picsum.photos/seed/kids-drawing-activity/400/600", color: "bg-purple-400" },
      { title: "Ritim & Dans", imageUrl: "https://picsum.photos/seed/kids-music-activity/400/600", color: "bg-blue-400" }
    ],
    contact: {
      phone: "0 505 635 34 05",
      address: "İsmetpaşa Mahallesi 147 Sokak No:11/A Sultangazi İSTANBUL",
      instagram: "@papatyalarimanaokulu"
    },
    downloadUrl: "#"
  };

  const slides = data.slides || [];

  return (
    <div className="min-h-screen selection:bg-accent/30 relative overflow-x-hidden">
      {/* Background Daisy Patterns */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
        <DaisyIcon className="absolute top-20 left-10 w-40 h-40 rotate-12" />
        <DaisyIcon className="absolute top-1/3 right-[-5%] w-64 h-64 -rotate-12" />
        <DaisyIcon className="absolute bottom-20 left-[-2%] w-48 h-48 rotate-45" />
        <DaisyIcon className="absolute top-1/2 left-1/2 w-32 h-32 opacity-50" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#f0f2ed] backdrop-blur-md border-b border-accent/40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <DaisyIcon className="w-10 h-10" />
            </div>
            <span className="serif text-2xl font-bold tracking-tight text-primary">Papatyalarım Anaokulu</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-primary/70">
            <a href="#programlar" className="hover:text-primary transition-colors">Programlar</a>
            <a href="#egitim" className="hover:text-primary transition-colors">Eğitim</a>
            <a href="#atolyeler" className="hover:text-primary transition-colors">Atölyeler</a>
            <Link to="/galeri" className="hover:text-primary transition-colors">Galeri</Link>
            <a href="#iletisim" className="hover:text-primary transition-colors">İletişim</a>
          </div>
          <a 
            href="https://wa.me/905056353405?text=Merhabalar%20okulunuzla%20ilgili%20bilgi%20almak%20istiyorum" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-accent text-primary px-6 py-2 rounded-full text-sm font-bold shadow-sm hover:shadow-md transition-all border border-white/50 flex items-center gap-2"
          >
            <WhatsAppIcon className="w-4 h-4" />
            Kayıt Bilgi
          </a>
        </div>
      </nav>

      {/* School Name Banner - Positioned between Menu and Slider */}
      <div className="pt-20 bg-white">
        <div className="py-6 text-center bg-gradient-to-b from-white to-bg-soft border-b border-accent/10">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="serif text-2xl md:text-3xl text-primary tracking-[0.15em] font-bold"
          >
            Papatyalarım <span className="text-accent italic">Anaokulu</span> & Oyunevi
          </motion.h2>
          <div className="flex justify-center gap-2 mt-2">
            <div className="w-1 h-1 rounded-full bg-accent"></div>
            <div className="w-12 h-px bg-accent/30 self-center"></div>
            <div className="w-1 h-1 rounded-full bg-accent"></div>
          </div>
        </div>
      </div>

      {/* Hero Slider Section */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
        <AnimatePresence mode="wait">
          {slides.length > 0 && (
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <img 
                src={slides[currentSlide].imageUrl} 
                className="w-full h-full object-cover" 
                alt={slides[currentSlide].title}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent"></div>
              
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-6 w-full">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="max-w-2xl"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent text-primary rounded-full text-xs font-black uppercase tracking-widest mb-8">
                      <Sun size={14} className="fill-current" />
                      {slides[currentSlide].subtitle}
                    </div>
                    <h1 className="serif text-6xl md:text-8xl text-white leading-tight mb-8">
                      {slides[currentSlide].title.split(' ').slice(0, -1).join(' ')} <br />
                      <span className="italic text-accent">{slides[currentSlide].title.split(' ').slice(-1)}</span>
                    </h1>
                    <div className="flex gap-4">
                      <a 
                        href="https://wa.me/905056353405?text=Merhabalar%20okulunuzla%20ilgili%20bilgi%20almak%20istiyorum" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-white text-primary px-8 py-4 rounded-full font-bold hover:bg-accent transition-all shadow-xl flex items-center gap-2"
                      >
                        <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                        Kayıt Bilgi
                      </a>
                      <Link to="/galeri" className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all flex items-center justify-center">
                        Okulumuz
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Slider Controls */}
        <div className="absolute bottom-10 right-10 flex gap-4 z-20">
          <button 
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all ${currentSlide === i ? 'w-8 bg-accent' : 'w-2 bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      {/* 3D Video Section */}
      {data.videoUrl && (
        <section className="py-12 bg-bg-soft">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="serif text-3xl text-primary mb-8 text-center">3D Okul Tanıtım Turu</h2>
            <div className="aspect-video rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
              <iframe
                src={data.videoUrl}
                className="w-full h-full"
                title="3D Okul Tanıtım Turu"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>
      )}

      {/* Hero Section (Original - Hidden or replaced by slider) */}
      {/* Keeping the structure but the slider is the main hero now */}

      {/* Features Grid */}
      <section id="programlar" className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-24">
            <DaisyIcon className="w-12 h-12 mx-auto mb-6 opacity-40" />
            <h2 className="serif text-5xl md:text-6xl mb-6 text-primary">Neden Papatyalarım?</h2>
            <p className="text-primary/60 font-medium">Çocuklarımızın doğal merakını ve yeteneklerini papatya tazeliğinde destekliyoruz.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {data.features.map((item: any, i: number) => (
              <motion.div 
                key={i}
                {...fadeIn}
                className="p-12 rounded-[50px] bg-bg-soft border-2 border-accent/10 hover:border-accent/40 transition-all hover:shadow-xl group"
              >
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-10 shadow-md group-hover:scale-110 transition-transform">
                  {item.iconName === 'Baby' ? <Baby className="text-primary" /> : item.iconName === 'Heart' ? <Heart className="text-accent fill-current" /> : <Palette className="text-primary" />}
                </div>
                <h3 className="serif text-3xl mb-6 text-primary">{item.title}</h3>
                <p className="text-primary/70 leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="egitim" className="py-32 overflow-hidden bg-bg-soft">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div {...fadeIn} className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="aspect-[3/4] rounded-[60px] overflow-hidden shadow-xl border-4 border-white">
                  <img src={data.education.imageUrl1} alt="Oyun Oynayan Çocuklar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="aspect-[3/4] rounded-[60px] overflow-hidden mt-16 shadow-xl border-4 border-white">
                  <img src={data.education.imageUrl2} alt="Öğrenen Çocuklar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <DaisyIcon className="w-32 h-32 opacity-20" />
              </div>
            </motion.div>
            
            <motion.div {...fadeIn}>
              <h2 className="serif text-5xl md:text-6xl mb-10 text-primary">{data.education.title.split(' ').slice(0, -2).join(' ')} <br /><span className="italic text-accent">{data.education.title.split(' ').slice(-2).join(' ')}</span></h2>
              <p className="text-xl text-primary/70 mb-10 leading-relaxed font-medium">
                {data.education.description}
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {data.education.items.map((text: string, i: number) => (
                  <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-accent/10">
                    <DaisyIcon className="w-6 h-6 shrink-0" />
                    <span className="font-bold text-primary">{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Workshops Section */}
      <section id="atolyeler" className="py-32 bg-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
            <div className="max-w-2xl">
              <span className="text-accent font-black uppercase tracking-widest text-sm mb-4 block">Atölye Etkinlikleri</span>
              <h2 className="serif text-5xl md:text-7xl mb-8">Yetenekler <br />Çiçek Açıyor</h2>
              <p className="text-white/70 text-lg font-medium">Her gün farklı bir atölye ile çocuklarımızın ilgi alanlarını keşfediyoruz.</p>
            </div>
            <a 
              href={content?.downloadUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-accent text-primary px-10 py-5 rounded-full font-black hover:scale-105 transition-transform shadow-xl shadow-black/20 inline-block text-center"
            >
              Programı İndir
            </a>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {data.workshops.map((item: any, i: number) => (
              <motion.div 
                key={i}
                whileHover={{ y: -15 }}
                className="relative aspect-[3/4] rounded-[40px] overflow-hidden group border-4 border-white/10"
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent opacity-80"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-10">
                  <div className={`w-10 h-10 ${item.color} rounded-full mb-4 shadow-lg border-2 border-white`}></div>
                  <h4 className="serif text-3xl font-bold">{item.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="iletisim" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-[80px] p-12 md:p-24 shadow-2xl border-4 border-accent/10 grid lg:grid-cols-2 gap-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-[0.05] -translate-y-1/2 translate-x-1/2">
              <DaisyIcon className="w-96 h-96" />
            </div>
            
            <div className="relative z-10">
              <h2 className="serif text-5xl md:text-6xl mb-10 text-primary">Bize Ulaşın</h2>
              <p className="text-primary/60 text-lg font-medium mb-16 leading-relaxed">
                Minik papatyamızın eğitim yolculuğuna birlikte başlayalım. Okulumuzu ziyaret etmek için randevu alabilirsiniz.
              </p>
              
              <div className="space-y-10">
                <a 
                  href="https://maps.app.goo.gl/rPgbkwE6SsCH2J4m9" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-8 group hover:bg-white/50 p-4 -m-4 rounded-[32px] transition-all"
                >
                  <div className="w-16 h-16 bg-accent/20 rounded-3xl flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors">
                    <MapPin className="text-primary" size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-primary uppercase tracking-widest text-xs mb-2">Konum</h4>
                    <p className="text-primary/70 font-bold">{data.contact.address}</p>
                    <span className="text-xs text-accent font-black uppercase tracking-widest mt-1 block group-hover:translate-x-1 transition-transform">Haritada Gör →</span>
                  </div>
                </a>
                <a 
                  href={`tel:${data.contact.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-8 group hover:bg-white/50 p-4 -m-4 rounded-[32px] transition-all"
                >
                  <div className="w-16 h-16 bg-accent/20 rounded-3xl flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors">
                    <Phone className="text-primary" size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-primary uppercase tracking-widest text-xs mb-2">Telefon</h4>
                    <p className="text-primary/70 font-bold text-xl">{data.contact.phone}</p>
                    <span className="text-xs text-accent font-black uppercase tracking-widest mt-1 block group-hover:translate-x-1 transition-transform">Hemen Ara →</span>
                  </div>
                </a>
                <a 
                  href={`https://instagram.com/${data.contact.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-8 group hover:bg-white/50 p-4 -m-4 rounded-[32px] transition-all"
                >
                  <div className="w-16 h-16 bg-accent/20 rounded-3xl flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors">
                    <Instagram className="text-primary" size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-primary uppercase tracking-widest text-xs mb-2">Instagram</h4>
                    <p className="text-primary/70 font-bold">{data.contact.instagram}</p>
                    <span className="text-xs text-accent font-black uppercase tracking-widest mt-1 block group-hover:translate-x-1 transition-transform">Takip Et →</span>
                  </div>
                </a>
              </div>
            </div>
            
            <form onSubmit={handleFormSubmit} className="bg-bg-soft p-10 rounded-[50px] border-2 border-accent/10 space-y-8 relative z-10">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-primary/40 ml-2">Veli Adı Soyadı</label>
                  <input 
                    type="text" 
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                    className="w-full bg-white border-2 border-transparent focus:border-accent rounded-3xl p-5 outline-none transition-all shadow-sm" 
                    placeholder="Adınız Soyadınız" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-primary/40 ml-2">Telefon</label>
                  <input 
                    type="tel" 
                    required
                    value={formState.phone}
                    onChange={(e) => setFormState({...formState, phone: e.target.value})}
                    className="w-full bg-white border-2 border-transparent focus:border-accent rounded-3xl p-5 outline-none transition-all shadow-sm" 
                    placeholder="05xx xxx xx xx" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-primary/40 ml-2">Mesajınız</label>
                  <textarea 
                    rows={4} 
                    value={formState.message}
                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                    className="w-full bg-white border-2 border-transparent focus:border-accent rounded-3xl p-5 outline-none transition-all shadow-sm resize-none" 
                    placeholder="Sorularınızı buraya yazabilirsiniz..."
                  ></textarea>
                </div>
              </div>
              
              {submitStatus === 'success' && (
                <div className="bg-green-100 text-green-700 p-4 rounded-2xl text-center font-bold">
                  Mesajınız başarıyla gönderildi! En kısa sürede size döneceğiz.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="bg-red-100 text-red-700 p-4 rounded-2xl text-center font-bold">
                  Bir hata oluştu. Lütfen daha sonra tekrar deneyin.
                </div>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent text-primary py-6 rounded-3xl font-black text-lg hover:shadow-2xl hover:shadow-accent/20 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? 'Gönderiliyor...' : 'Bilgi Formu Gönder'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-white border-t-4 border-accent/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-10">
            <DaisyIcon className="w-12 h-12" />
            <span className="serif text-3xl font-bold text-primary">Papatyalarım Anaokulu</span>
          </div>
          <div className="flex flex-wrap justify-center gap-10 text-sm font-black uppercase tracking-widest text-primary/50 mb-12">
            <Link to="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
            <a href="#egitim" className="hover:text-primary transition-colors">Hakkımızda</a>
            <Link to="/galeri" className="hover:text-primary transition-colors">Galeri</Link>
            <Link to="/admin" className="hover:text-primary transition-colors">Yönetim</Link>
          </div>
          <div className="h-px bg-accent/20 w-40 mx-auto mb-12"></div>
          <p className="text-sm text-primary/30 font-bold">© 2026 Papatyalarım Anaokulu & Oyunevi. Sevgiyle Tasarlandı.</p>
        </div>
      </footer>
    </div>
  );
}
