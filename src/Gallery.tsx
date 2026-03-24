import React, { useState, useEffect } from 'react';
import { db, collection, onSnapshot, query, orderBy } from './firebase';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, X, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const imgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryImage[];
      setImages(imgs);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-bg-soft">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#f0f2ed] backdrop-blur-md border-b border-accent/40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors">
            <ChevronLeft size={20} />
            Ana Sayfa
          </Link>
          <h1 className="serif text-2xl font-bold text-primary">Okulumuzdan Kareler</h1>
          <div className="w-24"></div> {/* Spacer */}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="text-primary/60 font-bold">Resimler yükleniyor...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-primary/40 text-xl font-medium">Henüz fotoğraf eklenmemiş.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedImage(image)}
                className="group relative aspect-square bg-white rounded-[40px] overflow-hidden shadow-lg cursor-pointer border-4 border-white hover:border-accent transition-all"
              >
                <img 
                  src={image.url} 
                  alt={image.caption || 'Galeri Resmi'} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Maximize2 className="text-white w-10 h-10" />
                </div>
                {image.caption && (
                  <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white font-medium text-sm">{image.caption}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary/95 flex items-center justify-center p-6"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-10 right-10 text-white hover:text-accent transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={40} />
            </button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[80vh] flex flex-col items-center"
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={selectedImage.url} 
                alt={selectedImage.caption} 
                className="w-full h-full object-contain rounded-3xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
              {selectedImage.caption && (
                <p className="text-white mt-6 text-xl font-medium serif">{selectedImage.caption}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
