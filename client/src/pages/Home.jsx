import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import heroImageDefault from '../assets/hero-image.jpg';
import { getImageUrl, toAbsoluteImageUrl } from '../utils/imageUtils';
import { SkeletonProductList } from '../components/SkeletonLoader';

const staticFeaturedFallback = [
  {
    name: 'Jan Silk Gown',
    price: 'Â£1,450',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBHEvUHDJxdAK2d_5kOssdB9zBHtjg5rg3TKf_kU1FecpFUnP1AkxNL3ToWJBDM3nx35KtRh9sDZpfcj9xlE5TpDLP3KmgRcb0TXR9RovlS51dT5m5Yrytfx_GkyqYSkgAA0-SPFTVggBCPE_dQLlCzC-rYBY0aHCztJuWVSIzWudsMjXatHt7yHyLxhX90oogfcxPHvutgikkOrt2lC7Q0JbqUmeBHHRNoxKMEmv1cE8rg6HpXcQMhfQjEA9eSsRWT8k36LCwapZ0',
  },
  {
    name: 'Architect Blazer',
    price: 'Â£890',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCIancbVvM_5fo37Dt3bX14iJa6KSPNVwrDQPB0OnYptxscbvAYJ7o9g1EZTTb1aizUKFXfIu9Us3Z-Z93ljFyYzCOyC2NirePd6UU-6Ycga3mRyp7JxcFmkvwp2PoJl-FsaWlOZvG6KEZsB6GoJtIsbGfqY-cO3a1QNBzta3Jeaa9O_TeeboCwH_-o-YdPaUlo5S9-dY3gUuor5xEnYYFXKvphUWad4bulsRmTIHHqjiuYhxOdAWTaPiXagLiBTONqnCtU49O1O5g',
  },
  {
    name: 'Archive Tote',
    price: 'Â£2,100',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB5OJGi7TC1792AcMkvLbejFThVDOTZN__VUSVftCUnLGWvBW2hnFkneqCmU0_gKOZYCl-69wwo8M9ROmlDJ336TdziYB7DLs0vjzJ1Y9K1AbWB5mldYYefN_-zEVW3hGqfmW_GDwRTWn8bI-QYoI-D0ZS4sACD6pZOoeh9sJ-0ZudSOCgkVPdMD4Igw25c0fp7gvpKMhY7kQoUll9o1HNAqj_aRZ2eea4GofGQnaic8PXaB8XyQFI71IIgpVPdWF-l72rk0XFI4yM',
  },
  {
    name: 'Heritage Loafer',
    price: 'Â£620',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDo9r4mpSGNEiyCLKUd3dWi9wl3MixIF6oGhZ-LneRgo-FUbXor9FTbO30-d1zxY6sCRTskRe-_y9Am4vb0hp_NtWrt75q6hcN8mYthRowJam23NxiFt7im7GD_XnjZCVP-bzwhx4NS8eT9mX3ev-cyH1K-zY0-KV3lJA4RA_rEL1l922F-KuI9FM9ZuVI9ubJy-JPjuFwqDexLnCKPSgnQwQ2psTDWaharDzNqG8_aICy7rwyFwId7C3-L7SFX9r80kUXwtvetLNU',
  },
];



const Home = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [heroImage, setHeroImage] = useState(heroImageDefault);
  const [heroImageMobile, setHeroImageMobile] = useState('');
  const [heroHeading, setHeroHeading] = useState('Silhouettes Of Silence');
  const [heroDescription, setHeroDescription] = useState(
    'Challenging the noise of fast fashion. We return to the tactile purity of silk, the structural integrity of wool, and the poetry of the human form.'
  );

  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/settings');
        if (data?.heroImage) setHeroImage(data.heroImage);
        if (data?.heroImageMobile) setHeroImageMobile(data.heroImageMobile);
        if (data?.heroHeading) setHeroHeading(data.heroHeading);
        if (data?.heroDescription) setHeroDescription(data.heroDescription);
      } catch {
        // keep defaults
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setFeaturedLoading(true);
        const { data } = await axios.get('/api/products');
        const productsList = Array.isArray(data) ? data : data?.products ?? [];

        // Admin-controlled featured products: expects boolean flag on the product
        const featured = productsList.filter((p) => p.isFeatured).slice(0, 4);
        setFeaturedProducts(featured);
      } catch (error) {
        console.error('Home: error loading featured products', error);
        setFeaturedProducts([]);
      } finally {
        setFeaturedLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const heroImageUrl = toAbsoluteImageUrl(heroImage) || heroImageDefault;
  const heroImageMobileUrl = heroImageMobile
    ? (toAbsoluteImageUrl(heroImageMobile) || heroImageUrl)
    : heroImageUrl;

  const featuredDisplay = useMemo(() => {
    if (featuredProducts.length === 0) return staticFeaturedFallback;
    const mapped = featuredProducts.slice(0, 4).map((product) => ({
      ...product,
      priceText: `Rs ${product.price}`,
      imageText: getImageUrl(product.image),
    }));
    while (mapped.length < 4) mapped.push(staticFeaturedFallback[mapped.length]);
    return mapped;
  }, [featuredProducts]);

  const handleQuickAdd = (item) => {
    if (!item?._id) return;
    addToCart(item, 1);
    showToast('Added to cart', 'success');
  };

  return (
    <main className="bg-background-dark font-display text-slate-100 antialiased selection:bg-primary selection:text-background-dark">
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-background-dark">
        <div className="absolute inset-0 opacity-40">
          <img alt={heroHeading} className="hidden md:block w-full h-full object-cover grayscale" src={heroImageUrl} />
          <img alt={heroHeading} className="block md:hidden w-full h-full object-cover grayscale" src={heroImageMobileUrl} />
        </div>
        <div className="relative z-10 text-center space-y-8 max-w-5xl px-6">
          <p className="text-primary text-[10px] uppercase tracking-[0.8em] mb-4">Volume I: Our Designs</p>
          <h1 className="text-6xl md:text-9xl font-serif italic font-extralight leading-none text-outline">Our Designs</h1>
          <h2 className="text-5xl md:text-8xl font-display font-bold uppercase text-white tracking-tighter -mt-6">{heroHeading}</h2>
          <p className="max-w-md mx-auto text-slate-400 font-light leading-loose text-white text-sm tracking-widest mt-12">{heroDescription}</p>
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="px-10 py-4 border border-primary/60 hover:border-primary hover:bg-primary hover:text-black transition-all duration-300 uppercase tracking-[0.4em] text-[10px] font-semibold"
            >
              Shop Now
            </button>
          </div>
          <div className="pt-12">
            <div className="w-px h-24 bg-gradient-to-b from-primary to-transparent mx-auto"></div>
          </div>
        </div>
      </section>

      <section className="relative w-full bg-black overflow-hidden editorial-split">
        <div className="editorial-image">
          <img
            alt="Editorial 01"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-[3s]"
            src="/hero-women.png"
          />
        </div>
        <div className="editorial-text p-12 md:p-24 flex flex-col justify-center bg-background-dark">
          <span className="text-[#cfaf3a] text-xs tracking-[0.5em] mb-6 text-gold">01 / REFINED CORE</span>
            <h3 className="text-4xl font-serif mb-8 leading-tight text-white">The balance between minimalism and bold intent.</h3>
            <p className="text-slate-400 font-light leading-relaxed mb-12">
            Every garment in the  &apos;MakhmalJan&apos;  line is constructed with attention to detail and elevated finishing. Structured cuts, controlled tailoring, and fabrics selected for durability and feel.
          </p>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="inline-block border-b border-primary pb-2 text-[10px] uppercase tracking-[0.3em] font-bold hover:text-primary transition-colors self-start"
          >
            Discover The Drop
          </button>
        </div>
      </section>

      <section className="py-20 bg-background-light text-background-dark flex items-center justify-center text-center px-6">
        <div className="max-w-3xl">
          <span className="material-symbols-outlined text-4xl mb-8 text-primary/40">flare</span>
          <blockquote className="text-3xl md:text-5xl font-serif italic leading-snug">
            &quot;Luxury is not a price point. It is the quiet confidence of a seam that never breaks and a fabric that breathes with the soul.&quot;
          </blockquote>
          <p className="mt-8 uppercase tracking-[0.4em] text-[10px] font-bold opacity-50">— The Philosophy of Makhmal</p>
        </div>
      </section>

      <section className="relative w-full bg-black overflow-hidden editorial-split reverse">
        <div className="editorial-image">
          <img
            alt="Editorial 02"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-[3s]"
            src="/hero-men.webp"
          />
        </div>
        <div className="editorial-text p-12 md:p-24 flex flex-col justify-center bg-background-dark">
          <span className="text-[#cfaf3a] text-xs tracking-[0.5em] mb-6">02 / MASCULINE FLOW</span>
          <h3 className="text-4xl font-serif mb-8 leading-tight text-white">Softening the structure of power.</h3>
          <p className="text-slate-400 font-light leading-relaxed mb-12">
            Deconstructed tailoring for the modern nomad. Our Italian wool blazers remove the internal padding to reveal the natural drape of the wearer&apos;s movement.
          </p>
          <button
            type="button"
            onClick={() => navigate('/shop?category=Men')}
            className="inline-block border-b border-primary pb-2 text-[10px] uppercase tracking-[0.3em] font-bold hover:text-primary transition-colors self-start"
          >
            Examine Textures
          </button>
        </div>
      </section>

      <section className="py-12 bg-background-dark px-8 md:px-16">
        <div className="mb-16">
          <h2 className="text-3xl font-serif italic text-[#cfaf3a] mb-2">The Collections</h2>
          <p className="text-[10px] uppercase tracking-[0.5em] text-slate-500">Browse by Category</p>
        </div>
        <div className="max-w-100% mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link className="group relative aspect-[3/4] overflow-hidden" to="/shop?category=Women">
            <img alt="Women's Collection" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHEvUHDJxdAK2d_5kOssdB9zBHtjg5rg3TKf_kU1FecpFUnP1AkxNL3ToWJBDM3nx35KtRh9sDZpfcj9xlE5TpDLP3KmgRcb0TXR9RovlS51dT5m5Yrytfx_GkyqYSkgAA0-SPFTVggBCPE_dQLlCzC-rYBY0aHCztJuWVSIzWudsMjXatHt7yHyLxhX90oogfcxPHvutgikkOrt2lC7Q0JbqUmeBHHRNoxKMEmv1cE8rg6HpXcQMhfQjEA9eSsRWT8k36LCwapZ0" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex flex-col items-center justify-end pb-12">
              <h3 className="text-2xl font-serif text-white tracking-widest uppercase">Women</h3>
              <span className="text-[10px] text-[#cfaf3a] mt-4 border-b border-primary/40 pb-1 opacity-0 group-hover:opacity-100 transition-opacity">Discover</span>
            </div>
          </Link>
          <Link className="group relative aspect-[3/4] overflow-hidden" to="/shop?category=Men">
            <img alt="Men's Collection" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIancbVvM_5fo37Dt3bX14iJa6KSPNVwrDQPB0OnYptxscbvAYJ7o9g1EZTTb1aizUKFXfIu9Us3Z-Z93ljFyYzCOyC2NirePd6UU-6Ycga3mRyp7JxcFmkvwp2PoJl-FsaWlOZvG6KEZsB6GoJtIsbGfqY-cO3a1QNBzta3Jeaa9O_TeeboCwH_-o-YdPaUlo5S9-dY3gUuor5xEnYYFXKvphUWad4bulsRmTIHHqjiuYhxOdAWTaPiXagLiBTONqnCtU49O1O5g" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex flex-col items-center justify-end pb-12">
              <h3 className="text-2xl font-serif text-white tracking-widest uppercase">Men</h3>
              <span className="text-[10px] text-[#cfaf3a] mt-4 border-b border-primary/40 pb-1 opacity-0 group-hover:opacity-100 transition-opacity">Explore</span>
            </div>
          </Link>
          <Link className="group relative aspect-[3/4] overflow-hidden" to="/shop?category=Kids">
            <img alt="Kids Collection" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5OJGi7TC1792AcMkvLbejFThVDOTZN__VUSVftCUnLGWvBW2hnFkneqCmU0_gKOZYCl-69wwo8M9ROmlDJ336TdziYB7DLs0vjzJ1Y9K1AbWB5mldYYefN_-zEVW3hGqfmW_GDwRTWn8bI-QYoI-D0ZS4sACD6pZOoeh9sJ-0ZudSOCgkVPdMD4Igw25c0fp7gvpKMhY7kQoUll9o1HNAqj_aRZ2eea4GofGQnaic8PXaB8XyQFI71IIgpVPdWF-l72rk0XFI4yM" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex flex-col items-center justify-end pb-12">
              <h3 className="text-2xl font-serif text-white tracking-widest uppercase">Kids</h3>
              <span className="text-[10px] text-[#cfaf3a] mt-4 border-b border-primary/40 pb-1 opacity-0 group-hover:opacity-100 transition-opacity">View All</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="py-12 bg-[#050505] px-8 md:px-16">
        <div className="max-w-100% mx-auto flex flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-xl text-left">
            <p className="text-[#cfaf3a] text-[10px] uppercase tracking-[0.5em] mb-4">The New Standard</p>
            <h2 className="text-4xl md:text-5xl font-serif leading-tight text-white">Featured Pieces</h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="text-[10px] uppercase tracking-[0.4em] font-bold border-b-2 border-primary pb-2 text-white hover:text-primary transition-colors shrink-0"
          >
            View Full Exhibition
          </button>
        </div>
        <div className="max-w-100% mx-auto">
          {featuredLoading ? (
            <SkeletonProductList count={4} />
          ) : featuredProducts.length === 0 ? (
            <p className="text-sm text-slate-500">
              Featured styles are coming soon. In the meantime, browse our full collection in the shop.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {featuredProducts.map((item) => (
                <div key={item._id} className="group">
                  <div className="relative aspect-[3/4] bg-[#1a1a1a] mb-6 overflow-hidden max-w-xs mx-auto">
                    <img
                      alt={item.name}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer"
                      src={getImageUrl(item.image)}
                      loading="lazy"
                      onClick={() => setQuickViewProduct(item)}
                    />
                    <button
                      type="button"
                      className="absolute bottom-0 left-0 right-0 bg-primary text-black text-[10px] font-bold uppercase py-4 translate-y-full group-hover:translate-y-0 transition-transform"
                      onClick={() => handleQuickAdd(item)}
                    >
                      Quick Add
                    </button>
                  </div>
                  <h4 className="text-sm tracking-widest uppercase text-white mb-1">{item.name}</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm md:text-base text-[#cfaf3a] font-semibold font-serif">
                      Rs {item.price}
                    </span>
                    {item.isOnSale && item.originalPrice && (
                      <span className="text-[11px] text-slate-400 line-through">
                        Rs {item.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 px-8 bg-background-dark">
        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-4">
          <div className="relative group aspect-[16/9] overflow-hidden">
            <img alt="Detail 01" className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5OJGi7TC1792AcMkvLbejFThVDOTZN__VUSVftCUnLGWvBW2hnFkneqCmU0_gKOZYCl-69wwo8M9ROmlDJ336TdziYB7DLs0vjzJ1Y9K1AbWB5mldYYefN_-zEVW3hGqfmW_GDwRTWn8bI-QYoI-D0ZS4sACD6pZOoeh9sJ-0ZudSOCgkVPdMD4Igw25c0fp7gvpKMhY7kQoUll9o1HNAqj_aRZ2eea4GofGQnaic8PXaB8XyQFI71IIgpVPdWF-l72rk0XFI4yM" loading="lazy" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white/20 text-6xl font-serif group-hover:opacity-0 transition-opacity">Tactile</span>
            </div>
          </div>
          <div className="relative group aspect-[16/9] overflow-hidden">
            <img alt="Detail 02" className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo9r4mpSGNEiyCLKUd3dWi9wl3MixIF6oGhZ-LneRgo-FUbXor9FTbO30-d1zxY6sCRTskRe-_y9Am4vb0hp_NtWrt75q6hcN8mYthRowJam23NxiFt7im7GD_XnjZCVP-bzwhx4NS8eT9mX3ev-cyH1K-zY0-KV3lJA4RA_rEL1l922F-KuI9FM9ZuVI9ubJy-JPjuFwqDexLnCKPSgnQwQ2psTDWaharDzNqG8_aICy7rwyFwId7C3-L7SFX9r80kUXwtvetLNU" loading="lazy" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white/20 text-6xl font-serif group-hover:opacity-0 transition-opacity">Heritage</span>
            </div>
          </div>
        </div>
      </section>

      <section className="h-[60vh] flex flex-col items-center justify-center relative overflow-hidden px-8">
        <div className="absolute right-0 top-0 opacity-5 writing-vertical text-[15vw] font-bold tracking-tighter pointer-events-none">COLLECTION</div>
        <h2 className="text-5xl md:text-7xl font-display font-light text-center max-w-4xl leading-tight text-white">
          Transcending the <span className="italic font-serif text-[#cfaf3a]">Ephemeral</span>
        </h2>
        <div className="mt-16 flex gap-12">
          <button type="button" onClick={() => navigate('/shop')} className="px-12 py-5 border border-primary/30 hover:bg-primary hover:text-black transition-all duration-500 uppercase tracking-[0.4em] text-[10px]">
            Enter The Atelier
          </button>
        </div>
      </section>

      <section className="py-20 bg-background-dark">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-24">
            <p className="text-[#cfaf3a] text-[10px] uppercase tracking-[0.6em] mb-4">Client Voices</p>
            <h2 className="text-4xl font-serif italic text-white">The Makhmal Experience</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
            <div className="space-y-6">
              <p className="text-xl md:text-2xl font-serif leading-relaxed text-slate-300 italic">
                &quot;The level of craftsmanship in the Jan series is something I haven&apos;t seen in modern luxury for decades. It feels like wearing art.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-primary/30"></div>
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold">Elena V. â€” Milan</p>
              </div>
            </div>
            <div className="space-y-6">
              <p className="text-xl md:text-2xl font-serif leading-relaxed text-slate-300 italic">
                &quot;A rare intersection of radical simplicity and profound heritage. Makhmal Jan has redefined my understanding of the silhouette.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-primary/30"></div>
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold">Julian R. â€” London</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-white/5 bg-[#050505]">
        <div className="max-w-xl mx-auto px-6 text-center">
          <p className="text-primary text-[10px] uppercase tracking-[0.5em] mb-12">Private Correspondences</p>
          <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
            <input className="w-full bg-transparent border-0 border-b border-white/20 py-6 text-center text-xl focus:ring-0 focus:border-primary transition-colors placeholder:text-white/10" placeholder="Your Digital Identity (Email)" type="email" required />
            <button className="text-white/40 hover:text-primary uppercase tracking-[0.8em] text-[10px] transition-all" type="submit">
              Submit Access Request
            </button>
          </form>
        </div>
      </section>

      {quickViewProduct && <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
    </main>
  );
};

const QuickViewModal = ({ product, onClose }) => {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const { showToast } = useToast();
  const [qty, setQty] = useState(1);

  return (
    <div className="fashion-quickview-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Quick view product">
      <div className="fashion-quickview-modal" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="fashion-quickview-close" aria-label="Close quick view">
          <FaTimes aria-hidden="true" />
        </button>
        <div className="fashion-quickview-content">
          <div className="fashion-quickview-image">
            <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-auto max-h-[420px] object-contain" onError={(e) => { e.target.src = heroImageDefault; }} />
          </div>
          <div className="fashion-quickview-info">
            <span className="fashion-quickview-category">{product.category}</span>
            <h2 className="fashion-quickview-title">{product.name}</h2>
            <div className="fashion-quickview-price">Rs {product.price}</div>
            <p className="fashion-quickview-description">{product.description}</p>
            <div className="fashion-quickview-actions">
              <button type="button" onClick={() => { addToCart(product, qty); showToast('Added to cart', 'success'); }} className="btn btn-primary">
                Add to Cart
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isInWishlist(product._id)) {
                    removeFromWishlist(product._id);
                    showToast('Removed from wishlist', 'success');
                  } else {
                    addToWishlist(product);
                    showToast('Added to wishlist', 'success');
                  }
                }}
                className="btn btn-outline"
              >
                {isInWishlist(product._id) ? 'Remove Wishlist' : 'Add Wishlist'}
              </button>
              <input type="number" min="1" max={product.countInStock || 1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} className="form-control" style={{ maxWidth: '90px' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

