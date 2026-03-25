import React, { useState, useEffect } from 'react';
import { 
  db, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  addDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from './firebase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Save, 
  LogOut, 
  LogIn, 
  ChevronLeft, 
  Image as ImageIcon, 
  Type, 
  Phone, 
  MapPin, 
  Instagram, 
  Sparkles,
  Plus,
  Trash2,
  X,
  Lock,
  User
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('adminAuth') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [content, setContent] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '1453') {
      setIsLoggedIn(true);
      sessionStorage.setItem('adminAuth', 'true');
      setLoginError('');
    } else {
      setLoginError('Kullanıcı adı veya şifre hatalı!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('adminAuth');
  };

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setGalleryImages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'content', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContent(docSnap.data());
      } else {
        // Initial default data if none exists
        setContent({
          hero: {
            title: "Doğayla İç İçe Bir Yuva",
            subtitle: "Güneşle Açan Papatyalar",
            description: "Papatyalarım Anaokulu'nda her çocuk özel bir çiçektir. Sıcak bir ortamda, sevgiyle ve değerlerimizle büyüyoruz.",
            imageUrl: "https://picsum.photos/seed/kids-art-class/800/1000"
          },
          slides: [
            { title: "Doğayla İç İçe Bir Yuva", subtitle: "Güneşle Açan Papatyalar", imageUrl: "https://picsum.photos/seed/kids-nature-1/1920/1080" },
            { title: "Sevgiyle Büyüyoruz", subtitle: "Mutlu Çocuklar, Mutlu Yarınlar", imageUrl: "https://picsum.photos/seed/kids-playing-2/1920/1080" },
            { title: "Yetenekleri Keşfediyoruz", subtitle: "Sanat ve Oyun Atölyeleri", imageUrl: "https://picsum.photos/seed/kids-art-2/1920/1080" }
          ],
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
          slideDuration: 5,
          downloadUrl: "#",
          contact: {
            phone: "0 505 635 34 05",
            address: "İsmetpaşa Mahallesi 147 Sokak No:11/A Sultangazi İSTANBUL",
            instagram: "@papatyalarimanaokulu"
          }
        });
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!isLoggedIn) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'content', 'main'), content);
      setMessage('Değişiklikler başarıyla kaydedildi!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error(error);
      setMessage('Hata oluştu!');
    }
    setSaving(false);
  };

  const handleAddGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl) return;
    try {
      await addDoc(collection(db, 'gallery'), {
        url: newImageUrl,
        caption: newImageCaption,
        createdAt: serverTimestamp()
      });
      setNewImageUrl('');
      setNewImageCaption('');
      setMessage('Resim eklendi!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error(error);
      setMessage('Resim eklenirken hata oluştu!');
    }
  };

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDeleteGalleryImage = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'gallery', id));
      setDeleteConfirm(null);
      setMessage('Resim silindi!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error(error);
      setMessage('Resim silinirken hata oluştu!');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'messages', id));
      setMessage('Mesaj silindi!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateMessageStatus = async (id: string, status: string) => {
    try {
      await setDoc(doc(db, 'messages', id), { status }, { merge: true });
    } catch (error) {
      console.error(error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-bg-soft flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md border border-accent/10"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="text-accent w-10 h-10" />
            </div>
            <h1 className="serif text-3xl text-primary">Yönetim Paneli</h1>
            <p className="text-primary/60 text-sm mt-2">Lütfen giriş yapın</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-primary/40 ml-2">Kullanıcı Adı</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30 w-5 h-5" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-bg-soft border-2 border-transparent focus:border-accent rounded-2xl p-4 pl-12 outline-none transition-all"
                  placeholder="admin"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-primary/40 ml-2">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30 w-5 h-5" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-bg-soft border-2 border-transparent focus:border-accent rounded-2xl p-4 pl-12 outline-none transition-all"
                  placeholder="••••"
                />
              </div>
            </div>

            {loginError && (
              <p className="text-red-500 text-sm text-center font-medium">{loginError}</p>
            )}

            <button 
              type="submit"
              className="w-full bg-accent text-white py-4 rounded-2xl font-bold shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Giriş Yap
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/" className="text-primary/40 text-sm hover:text-accent transition-colors flex items-center justify-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              Siteye Dön
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-soft pb-20">
      <nav className="sticky top-0 z-50 bg-[#f0f2ed] backdrop-blur-md border-b border-accent/40 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-accent/10 rounded-full transition-colors">
              <ChevronLeft size={24} className="text-primary" />
            </Link>
            <h1 className="serif text-2xl font-bold text-primary">Admin Paneli</h1>
          </div>
          <div className="flex items-center gap-4">
            {message && <span className="text-green-600 font-bold text-sm">{message}</span>}
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              <Save size={18} /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <button onClick={handleLogout} className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 mt-12 space-y-12">
        {/* Messages Section */}
        <section className="bg-white p-10 rounded-[40px] shadow-xl border border-accent/10">
          <div className="flex items-center gap-3 mb-8">
            <Phone className="text-accent" />
            <h2 className="serif text-3xl text-primary">Gelen Mesajlar ({messages.filter(m => m.status === 'new').length} Yeni)</h2>
          </div>
          
          <div className="space-y-4">
            {messages.length === 0 ? (
              <p className="text-primary/40 text-center py-10 italic">Henüz mesaj bulunmuyor.</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`p-6 rounded-3xl border ${msg.status === 'new' ? 'bg-accent/5 border-accent/20' : 'bg-bg-soft border-accent/5'} transition-all`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-primary text-lg">{msg.name}</h3>
                      <p className="text-accent font-bold text-sm">{msg.phone}</p>
                      <p className="text-primary/30 text-xs mt-1">
                        {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleString('tr-TR') : 'Yükleniyor...'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {msg.status === 'new' && (
                        <button 
                          onClick={() => handleUpdateMessageStatus(msg.id, 'read')}
                          className="text-xs bg-white text-primary px-3 py-1 rounded-full border border-accent/20 hover:bg-accent hover:text-white transition-all"
                        >
                          Okundu İşaretle
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="text-primary/70 bg-white/50 p-4 rounded-2xl border border-accent/5 italic">
                    "{msg.message || 'Mesaj bırakılmadı.'}"
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {content && (
          <>
            {/* Genel Ayarlar Section */}
            <section className="bg-white p-10 rounded-[40px] shadow-xl border border-accent/10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Sparkles className="text-accent" />
                  <h2 className="serif text-3xl text-primary">Genel Ayarlar</h2>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-primary/40 ml-2">Slayt Geçiş Süresi (Saniye)</label>
                  <input 
                    type="number" 
                    value={content.slideDuration || 5}
                    onChange={(e) => setContent({...content, slideDuration: parseInt(e.target.value) || 5})}
                    className="w-full bg-bg-soft border-2 border-transparent focus:border-accent rounded-2xl p-4 outline-none transition-all"
                  />
                  <p className="text-[10px] text-primary/30 ml-2 italic">Ana sayfadaki büyük slaytların kaç saniyede bir değişeceğini belirler.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-primary/40 ml-2">Program İndirme Linki</label>
                  <input 
                    type="text" 
                    value={content.downloadUrl || ''}
                    onChange={(e) => setContent({...content, downloadUrl: e.target.value})}
                    className="w-full bg-bg-soft border-2 border-transparent focus:border-accent rounded-2xl p-4 outline-none transition-all"
                    placeholder="https://example.com/program.pdf"
                  />
                  <p className="text-[10px] text-primary/30 ml-2 italic">"Programı İndir" butonuna tıklandığında açılacak olan bağlantı.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-primary/40 ml-2">3D Okul Tanıtım Videosu Linki</label>
                  <input 
                    type="text" 
                    value={content.videoUrl || ''}
                    onChange={(e) => setContent({...content, videoUrl: e.target.value})}
                    className="w-full bg-bg-soft border-2 border-transparent focus:border-accent rounded-2xl p-4 outline-none transition-all"
                    placeholder="https://www.youtube.com/embed/..."
                  />
                  <p className="text-[10px] text-primary/30 ml-2 italic">Slaytın altında görünecek 3D tanıtım videosunun linki (YouTube embed linki önerilir).</p>
                </div>
              </div>
            </section>

            {/* Hero Section */}
            <section className="bg-white p-10 rounded-[40px] shadow-xl border border-accent/10">
              <div className="flex items-center gap-3 mb-8">
                <Type className="text-accent" />
                <h2 className="serif text-3xl text-primary">Giriş Bölümü (Hero)</h2>
              </div>
              <div className="grid gap-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-primary/40 mb-2 block">Başlık</label>
                  <input 
                    type="text" 
                    value={content.hero.title} 
                    onChange={(e) => setContent({...content, hero: {...content.hero, title: e.target.value}})}
                    className="w-full bg-bg-soft border-2 border-transparent focus:border-accent rounded-2xl p-4 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-primary/40 mb-2 block">Alt Başlık</label>
                  <input 
                    type="text" 
                    value={content.hero.subtitle} 
                    onChange={(e) => setContent({...content, hero: {...content.hero, subtitle: e.target.value}})}
                    className="w-full bg-bg-soft border-2 border-transparent focus:border-accent rounded-2xl p-4 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-primary/40 mb-2 block">Açıklama</label>
                  <textarea 
                    rows={3}
                    value={content.hero.description} 
                    onChange={(e) => setContent({...content, hero: {...content.hero, description: e.target.value}})}
                    className="w-full bg-bg-soft border-2 border-transparent focus:border-accent rounded-2xl p-4 outline-none transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-primary/40 mb-2 block">Resim URL</label>
                  <input 
                    type="text" 
                    value={content.hero.imageUrl} 
                    onChange={(e) => setContent({...content, hero: {...content.hero, imageUrl: e.target.value}})}
                    className="w-full bg-bg-soft border-2 border-transparent focus:border-accent rounded-2xl p-4 outline-none transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Slides Section */}
            <section className="bg-white p-10 rounded-[40px] shadow-xl border border-accent/10">
              <div className="flex items-center gap-3 mb-8">
                <ImageIcon className="text-accent" />
                <h2 className="serif text-3xl text-primary">Ana Sayfa Slaytları</h2>
              </div>
              <div className="space-y-8">
                {content.slides?.map((slide: any, index: number) => (
                  <div key={index} className="p-6 bg-bg-soft rounded-3xl border border-accent/5 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-primary/30">Slayt #{index + 1}</span>
                      <button 
                        onClick={() => {
                          const newSlides = content.slides.filter((_: any, i: number) => i !== index);
                          setContent({...content, slides: newSlides});
                        }}
                        className="text-red-500 text-xs font-bold hover:underline"
                      >
                        Sil
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        placeholder="Başlık"
                        value={slide.title} 
                        onChange={(e) => {
                          const newSlides = [...content.slides];
                          newSlides[index].title = e.target.value;
                          setContent({...content, slides: newSlides});
                        }}
                        className="w-full bg-white border-2 border-transparent focus:border-accent rounded-xl p-3 outline-none transition-all"
                      />
                      <input 
                        type="text" 
                        placeholder="Alt Başlık"
                        value={slide.subtitle} 
                        onChange={(e) => {
                          const newSlides = [...content.slides];
                          newSlides[index].subtitle = e.target.value;
                          setContent({...content, slides: newSlides});
                        }}
                        className="w-full bg-white border-2 border-transparent focus:border-accent rounded-xl p-3 outline-none transition-all"
                      />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Resim URL"
                      value={slide.imageUrl} 
                      onChange={(e) => {
                        const newSlides = [...content.slides];
                        newSlides[index].imageUrl = e.target.value;
                        setContent({...content, slides: newSlides});
                      }}
                      className="w-full bg-white border-2 border-transparent focus:border-accent rounded-xl p-3 outline-none transition-all"
                    />
                  </div>
                ))}
                <button 
                  onClick={() => {
                    const newSlides = [...(content.slides || []), { title: "", subtitle: "", imageUrl: "" }];
                    setContent({...content, slides: newSlides});
                  }}
                  className="w-full py-4 border-2 border-dashed border-accent/30 rounded-3xl text-accent font-bold hover:bg-accent/5 transition-all"
                >
                  + Yeni Slayt Ekle
                </button>
              </div>
            </section>

            {/* Contact Section */}
            <section className="bg-white p-10 rounded-[40px] shadow-xl border border-accent/10">
              <div className="flex items-center gap-3 mb-8">
                <Phone className="text-accent" />
                <h2 className="serif text-3xl text-primary">İletişim Bilgileri</h2>
              </div>
              <div className="grid gap-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-primary/40 mb-2 block">Telefon</label>
                  <input 
                    type="text" 
                    value={content.contact.phone} 
                    onChange={(e) => setContent({...content, contact: {...content.contact, phone: e.target.value}})}
                    className="w-full bg-bg-soft border-2 border-transparent focus:border-accent rounded-2xl p-4 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-primary/40 mb-2 block">Adres</label>
                  <input 
                    type="text" 
                    value={content.contact.address} 
                    onChange={(e) => setContent({...content, contact: {...content.contact, address: e.target.value}})}
                    className="w-full bg-bg-soft border-2 border-transparent focus:border-accent rounded-2xl p-4 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-primary/40 mb-2 block">Instagram</label>
                  <input 
                    type="text" 
                    value={content.contact.instagram} 
                    onChange={(e) => setContent({...content, contact: {...content.contact, instagram: e.target.value}})}
                    className="w-full bg-bg-soft border-2 border-transparent focus:border-accent rounded-2xl p-4 outline-none transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Education Section */}
            <section className="bg-white p-10 rounded-[40px] shadow-xl border border-accent/10">
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className="text-accent" />
                <h2 className="serif text-3xl text-primary">Eğitim Bölümü</h2>
              </div>
              <div className="grid gap-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-primary/40 mb-2 block">Başlık</label>
                  <input 
                    type="text" 
                    value={content.education.title} 
                    onChange={(e) => setContent({...content, education: {...content.education, title: e.target.value}})}
                    className="w-full bg-bg-soft border-2 border-transparent focus:border-accent rounded-2xl p-4 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-primary/40 mb-2 block">Açıklama</label>
                  <textarea 
                    rows={3}
                    value={content.education.description} 
                    onChange={(e) => setContent({...content, education: {...content.education, description: e.target.value}})}
                    className="w-full bg-bg-soft border-2 border-transparent focus:border-accent rounded-2xl p-4 outline-none transition-all resize-none"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-primary/40 mb-2 block">Resim 1 URL</label>
                    <input 
                      type="text" 
                      value={content.education.imageUrl1} 
                      onChange={(e) => setContent({...content, education: {...content.education, imageUrl1: e.target.value}})}
                      className="w-full bg-bg-soft border-2 border-transparent focus:border-accent rounded-2xl p-4 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-primary/40 mb-2 block">Resim 2 URL</label>
                    <input 
                      type="text" 
                      value={content.education.imageUrl2} 
                      onChange={(e) => setContent({...content, education: {...content.education, imageUrl2: e.target.value}})}
                      className="w-full bg-bg-soft border-2 border-transparent focus:border-accent rounded-2xl p-4 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Workshops Section */}
            <section className="bg-white p-10 rounded-[40px] shadow-xl border border-accent/10">
              <div className="flex items-center gap-3 mb-8">
                <ImageIcon className="text-accent" />
                <h2 className="serif text-3xl text-primary">Atölyeler</h2>
              </div>
              <div className="space-y-8">
                {content.workshops?.map((workshop: any, index: number) => (
                  <div key={index} className="p-6 bg-bg-soft rounded-3xl border border-accent/5 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        placeholder="Atölye Adı"
                        value={workshop.title} 
                        onChange={(e) => {
                          const newWorkshops = [...content.workshops];
                          newWorkshops[index].title = e.target.value;
                          setContent({...content, workshops: newWorkshops});
                        }}
                        className="w-full bg-white border-2 border-transparent focus:border-accent rounded-xl p-3 outline-none transition-all"
                      />
                      <input 
                        type="text" 
                        placeholder="Resim URL"
                        value={workshop.imageUrl} 
                        onChange={(e) => {
                          const newWorkshops = [...content.workshops];
                          newWorkshops[index].imageUrl = e.target.value;
                          setContent({...content, workshops: newWorkshops});
                        }}
                        className="w-full bg-white border-2 border-transparent focus:border-accent rounded-xl p-3 outline-none transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Features Section */}
            <section className="bg-white p-10 rounded-[40px] shadow-xl border border-accent/10">
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className="text-accent" />
                <h2 className="serif text-3xl text-primary">Özellikler</h2>
              </div>
              <div className="space-y-8">
                {content.features.map((feature: any, index: number) => (
                  <div key={index} className="p-6 bg-bg-soft rounded-3xl border border-accent/5">
                    <div className="grid gap-4">
                      <input 
                        type="text" 
                        value={feature.title} 
                        onChange={(e) => {
                          const newFeatures = [...content.features];
                          newFeatures[index].title = e.target.value;
                          setContent({...content, features: newFeatures});
                        }}
                        className="w-full bg-white border-2 border-transparent focus:border-accent rounded-xl p-3 outline-none transition-all font-bold"
                      />
                      <textarea 
                        rows={2}
                        value={feature.desc} 
                        onChange={(e) => {
                          const newFeatures = [...content.features];
                          newFeatures[index].desc = e.target.value;
                          setContent({...content, features: newFeatures});
                        }}
                        className="w-full bg-white border-2 border-transparent focus:border-accent rounded-xl p-3 outline-none transition-all resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Gallery Management Section */}
            <section className="bg-white p-10 rounded-[40px] shadow-xl border border-accent/10">
              <div className="flex items-center gap-3 mb-8">
                <ImageIcon className="text-accent" />
                <h2 className="serif text-3xl text-primary">Galeri Yönetimi</h2>
              </div>
              
              <form onSubmit={handleAddGalleryImage} className="bg-bg-soft p-6 rounded-3xl border border-accent/5 mb-10 space-y-4">
                <h3 className="font-bold text-primary mb-2">Yeni Resim Ekle</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Resim URL"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full bg-white border-2 border-transparent focus:border-accent rounded-xl p-3 outline-none transition-all"
                  />
                  <input 
                    type="text" 
                    placeholder="Açıklama (Opsiyonel)"
                    value={newImageCaption}
                    onChange={(e) => setNewImageCaption(e.target.value)}
                    className="w-full bg-white border-2 border-transparent focus:border-accent rounded-xl p-3 outline-none transition-all"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-accent text-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent/80 transition-all"
                >
                  <Plus size={18} /> Galeriye Ekle
                </button>
              </form>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {galleryImages.map((img) => (
                  <div key={img.id} className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-accent/10">
                    <img 
                      src={img.url} 
                      alt={img.caption} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <button 
                      onClick={() => handleDeleteGalleryImage(img.id)}
                      className={`absolute top-2 right-2 p-2 rounded-full transition-all shadow-lg ${
                        deleteConfirm === img.id 
                        ? 'bg-red-600 scale-110 opacity-100' 
                        : 'bg-red-500 opacity-0 group-hover:opacity-100'
                      } text-white`}
                      title={deleteConfirm === img.id ? "Onaylamak için tekrar tıklayın" : "Sil"}
                    >
                      {deleteConfirm === img.id ? <Trash2 size={18} /> : <Trash2 size={14} />}
                    </button>
                    {img.caption && (
                      <div className="absolute bottom-0 inset-x-0 p-2 bg-black/50 text-white text-[10px] truncate">
                        {img.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
