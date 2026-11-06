import React, { useState, useEffect } from 'react';
import { Upload, Calendar, CheckCircle2, Sparkles, Send, Image as ImageIcon } from 'lucide-react';
import { api } from '../services/api.js';
import { CustomOrder, CustomCakeConfig } from '../types.js';

interface CustomCakeBuilderProps {
  onSuccess: (order: CustomOrder) => void;
}

const DEFAULT_SHAPES = [
  { id: 'round', name: 'Klassik Dumaloq Biskvit', desc: 'Silliq yoki relyefli fransuzcha palitrali pichoq bilan sayqallangan abadiy klassika', baseMultiplier: 1.0 },
  { id: 'heart', name: 'Vintage Lambeth Yurakcha', desc: 'Viktoriya davri uslubidagi nafis relyeflar va marvaridlar', baseMultiplier: 1.15 },
  { id: 'tiered', name: 'Ikki Qavatli Arxitektura', desc: 'Tantanali to\'ylar va yubileylar uchun ulug\'vor ikki qavatli kompozitsiya', baseMultiplier: 1.4 },
  { id: 'square', name: 'Zamonaviy Kvadrat (Haute Square)', desc: 'Parij qandolatchiligi uslubidagi aniq minimalist qirralar', baseMultiplier: 1.1 },
];

const DEFAULT_WEIGHTS = [
  { weight: 1.0, servings: '6-8 kishilik', price: 75 },
  { weight: 1.5, servings: '10-12 kishilik', price: 105 },
  { weight: 2.0, servings: '14-16 kishilik', price: 135 },
  { weight: 3.0, servings: '22-26 kishilik', price: 195 },
  { weight: 5.0, servings: '40-50 kishilik (Ikki qavatli)', price: 320 },
];

const DEFAULT_FLAVORS = [
  { name: 'Madagaskar Burbon Vanili', desc: 'Tabiiy vanil urug\'lari bilan to\'yintirilgan nam va xushbo\'y biskvit' },
  { name: '72% Valrhona Qora Trufel', desc: 'Venesuela kakaosi va qovurilgan fundukli qarsildoq qatlam' },
  { name: 'Red Velvet Supreme', desc: 'Nozik kakao ohanglariga ega baxmal qizil biskvit' },
  { name: 'Bronte Pista & Malina', desc: 'Sitsiliya pistasi va yangi terilgan malinali qandolat konfituri' },
  { name: 'Tuzlangan Karamel & Yong\'oq', desc: 'Oltin karamel, fleur de sel va qovurilgan yong\'oq qatlamlari' },
];

const DEFAULT_CREAMS = [
  { name: 'Shveytsariya Merenga Kremi', desc: 'Ipakdek mayin, yengil va mukammal silliq tekstura' },
  { name: 'Oq Shokolad Ganashi', desc: '34% kakao-moyli baxmaldan oq shokolad ganashi' },
  { name: 'Cream Cheese Chantilly', desc: 'Pishloqli nozik va bulutdek yengil chantilly kremi' },
  { name: 'Valrhona Qora Shokoladli Ganash', desc: 'Chuqur va to\'yimli achchiq shokolad zavqi' },
];

const DEFAULT_DECORATIONS = [
  { name: '24K Iste\'mol Oltini & O\'rmon Mevalari', desc: 'Yangi uzilgan malina, qora smorodina va haqiqiy zarhal barglar', surcharge: 25 },
  { name: 'Qo\'lda Yasalgan Shakar Gullari', desc: 'Har bir yaprog\'i qo\'lda ishlangan nafis gultojlar va evkalipt', surcharge: 45 },
  { name: 'Bodomli Makarunlar & Karamel Toji', desc: 'Fransuzcha makarunlar va tillarang karamel to\'ri', surcharge: 30 },
  { name: 'Vintage Lambeth Bezaklari & Marvaridlar', desc: 'Ko\'p qatlamli relyef bezaklar va iste\'mol marvaridlari', surcharge: 35 },
  { name: 'Minimalist Tabiiy Vafli & Zig\'ir Qoplama', desc: 'Yengil vafli yelkanlari va quritilgan tabiiy gullar', surcharge: 20 },
];

export const CustomCakeBuilder: React.FC<CustomCakeBuilderProps> = ({ onSuccess }) => {
  const [shapes, setShapes] = useState(DEFAULT_SHAPES);
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const [flavors, setFlavors] = useState(DEFAULT_FLAVORS);
  const [creams, setCreams] = useState(DEFAULT_CREAMS);
  const [decorations, setDecorations] = useState(DEFAULT_DECORATIONS);

  const [selectedShape, setSelectedShape] = useState(DEFAULT_SHAPES[0]);
  const [selectedWeight, setSelectedWeight] = useState(DEFAULT_WEIGHTS[1]);
  const [selectedFlavor, setSelectedFlavor] = useState(DEFAULT_FLAVORS[0]);
  const [selectedCream, setSelectedCream] = useState(DEFAULT_CREAMS[0]);
  const [selectedDecoration, setSelectedDecoration] = useState(DEFAULT_DECORATIONS[0]);
  const [inscription, setInscription] = useState("Tug'ilgan kuningiz bilan!");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load live custom cake configurations from backend API
  useEffect(() => {
    let isMounted = true;
    api.getCustomCakeOptions()
      .then((cfg: CustomCakeConfig) => {
        if (!isMounted || !cfg) return;
        if (cfg.shapes?.length) {
          setShapes(cfg.shapes);
          setSelectedShape(cfg.shapes[0]);
        }
        if (cfg.weights?.length) {
          setWeights(cfg.weights);
          setSelectedWeight(cfg.weights[1] || cfg.weights[0]);
        }
        if (cfg.flavors?.length) {
          setFlavors(cfg.flavors);
          setSelectedFlavor(cfg.flavors[0]);
        }
        if (cfg.creams?.length) {
          setCreams(cfg.creams);
          setSelectedCream(cfg.creams[0]);
        }
        if (cfg.decorations?.length) {
          setDecorations(cfg.decorations);
          setSelectedDecoration(cfg.decorations[0]);
        }
      })
      .catch((err) => console.warn('Using cached atelier custom configuration:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Client Details
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('14:00 - 17:00');
  const [specialNotes, setSpecialNotes] = useState('');

  // Calculate estimated price
  const estimatedPrice = Math.round(
    (selectedWeight.price * selectedShape.baseMultiplier) + selectedDecoration.surcharge
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !deliveryDate) {
      alert('Iltimos, ismingiz, telefon raqamingiz va yetkazib berish sanasini kiriting.');
      return;
    }

    setIsSubmitting(true);
    try {
      let uploadedUrl = '';
      if (imagePreview) {
        try {
          const uploadRes = await api.uploadImage(imagePreview);
          uploadedUrl = uploadRes.url;
        } catch {
          uploadedUrl = imagePreview; // Fallback to data URL
        }
      }

      const customOrder = await api.createCustomOrder({
        customer_name: clientName,
        customer_phone: clientPhone,
        customer_email: clientEmail,
        cake_type: `${selectedShape.name}`,
        weight_kg: selectedWeight.weight,
        flavor: selectedFlavor.name,
        cream: selectedCream.name,
        decoration: selectedDecoration.name,
        personalized_message: inscription,
        reference_image: uploadedUrl,
        delivery_date: deliveryDate,
        delivery_time: deliveryTime,
        estimated_price: estimatedPrice,
        order_notes: specialNotes,
      });

      onSuccess(customOrder);
    } catch (err: any) {
      alert(`Maxsus buyurtma yuborishda xatolik yuz berdi: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest text-[#895737] uppercase">
            <Sparkles className="w-4 h-4 text-[#C59B62]" />
            <span>Mualliflik Qandolat Atelesi</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2C2420]">
            O'z Orzuingizdagi Maxsus Tortni Yarating
          </h2>
          <p className="text-sm sm:text-base text-[#5E4D44] leading-relaxed">
            Tort shakli, mualliflik biskviti, nafis to'ldirmasi, bezak kremi va shaxsiy tabrik yozuvini tanlang. Bizning mohir qandolatchilarimiz sizning g'oyangizni qandolat san'atiga aylantiradi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Interactive Customization Steps (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Step 1: Shape / Silhouette */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#2C2420]">
                  1. Tort Shakli & Silueti
                </h3>
                <span className="text-xs text-[#895737] font-medium">{selectedShape.name}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {shapes.map((shape) => (
                  <button
                    key={shape.id}
                    type="button"
                    onClick={() => setSelectedShape(shape)}
                    className={`p-4 rounded-2xl text-left border transition-all ${
                      selectedShape.id === shape.id
                        ? 'border-[#2C2420] bg-white shadow-md'
                        : 'border-[#E8DFD5] bg-[#F4EFEA] hover:border-[#D4C5B9]'
                    }`}
                  >
                    <div className="font-semibold text-sm text-[#2C2420]">{shape.name}</div>
                    <div className="text-xs text-[#5E4D44] mt-1 leading-relaxed">{shape.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Weight & Servings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#2C2420]">
                  2. Vazn & Porsiya Miqdori
                </h3>
                <span className="text-xs text-[#895737] font-medium">{selectedWeight.weight} kg · {selectedWeight.servings}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {weights.map((opt) => (
                  <button
                    key={opt.weight}
                    type="button"
                    onClick={() => setSelectedWeight(opt)}
                    className={`p-3 rounded-xl text-center border transition-all ${
                      selectedWeight.weight === opt.weight
                        ? 'border-[#2C2420] bg-[#2C2420] text-white shadow-sm'
                        : 'border-[#E8DFD5] bg-[#F4EFEA] text-[#2C2420] hover:bg-white'
                    }`}
                  >
                    <div className="text-base font-bold font-serif tabular-nums">{opt.weight} kg</div>
                    <div className="text-[11px] opacity-80 mt-0.5">{opt.servings}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Flavor & Sponge */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#2C2420]">
                  3. Biskvit & To'ldirish Ta'mi
                </h3>
                <span className="text-xs text-[#895737] font-medium">{selectedFlavor.name}</span>
              </div>
              <div className="space-y-2">
                {flavors.map((flavor) => (
                  <button
                    key={flavor.name}
                    type="button"
                    onClick={() => setSelectedFlavor(flavor)}
                    className={`w-full p-3.5 rounded-xl text-left border flex items-center justify-between gap-4 transition-all ${
                      selectedFlavor.name === flavor.name
                        ? 'border-[#895737] bg-white shadow-sm ring-1 ring-[#895737]'
                        : 'border-[#E8DFD5] bg-[#F4EFEA] hover:bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold text-[#2C2420]">{flavor.name}</div>
                      <div className="text-xs text-[#5E4D44] mt-0.5">{flavor.desc}</div>
                    </div>
                    {selectedFlavor.name === flavor.name && (
                      <CheckCircle2 className="w-5 h-5 text-[#895737] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Cream & Frosting */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#2C2420]">
                  4. Bezak Kremi & Qoplama
                </h3>
                <span className="text-xs text-[#895737] font-medium">{selectedCream.name}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {creams.map((cream) => (
                  <button
                    key={cream.name}
                    type="button"
                    onClick={() => setSelectedCream(cream)}
                    className={`p-3.5 rounded-xl text-left border transition-all ${
                      selectedCream.name === cream.name
                        ? 'border-[#2C2420] bg-white shadow-sm ring-1 ring-[#2C2420]'
                        : 'border-[#E8DFD5] bg-[#F4EFEA] hover:bg-white'
                    }`}
                  >
                    <div className="text-sm font-semibold text-[#2C2420]">{cream.name}</div>
                    <div className="text-xs text-[#5E4D44] mt-0.5">{cream.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 5: Decoration & Accents */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#2C2420]">
                  5. Eksklyuziv Bezak & Qo'shimchalar
                </h3>
                <span className="text-xs text-[#895737] font-medium">+${selectedDecoration.surcharge}</span>
              </div>
              <div className="space-y-2">
                {decorations.map((dec) => (
                  <button
                    key={dec.name}
                    type="button"
                    onClick={() => setSelectedDecoration(dec)}
                    className={`w-full p-3.5 rounded-xl text-left border flex items-center justify-between gap-4 transition-all ${
                      selectedDecoration.name === dec.name
                        ? 'border-[#895737] bg-white shadow-sm ring-1 ring-[#895737]'
                        : 'border-[#E8DFD5] bg-[#F4EFEA] hover:bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold text-[#2C2420] flex items-center gap-2">
                        <span>{dec.name}</span>
                        <span className="text-xs font-mono font-medium text-[#895737] tabular-nums">+${dec.surcharge}</span>
                      </div>
                      <div className="text-xs text-[#5E4D44] mt-0.5">{dec.desc}</div>
                    </div>
                    {selectedDecoration.name === dec.name && (
                      <CheckCircle2 className="w-5 h-5 text-[#895737] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 6: Personal Inscription & Reference Photo */}
            <div className="space-y-4 pt-2">
              <h3 className="font-serif text-lg font-bold text-[#2C2420]">
                6. Shaxsiy Tabrik Yozuvi & Namuna Rasm
              </h3>
              
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#5E4D44]">
                  Shaxsiy tabrik yozuvi (Fransuzcha xattotlik uslubida yoziladi):
                </label>
                <input
                  type="text"
                  value={inscription}
                  onChange={(e) => setInscription(e.target.value)}
                  placeholder="Masalan: Tug'ilgan kuning bilan, Azizam!"
                  maxLength={50}
                  className="w-full px-4 py-2.5 bg-white border border-[#E8DFD5] rounded-xl text-sm text-[#2C2420] focus:outline-none focus:ring-2 focus:ring-[#895737]"
                />
              </div>

              {/* Reference Image Upload */}
              <div className="pt-2">
                <label className="text-xs font-medium text-[#5E4D44] block mb-2">
                  Namuna yoki ilhomlantiruvchi rasm yuklash (ixtiyoriy):
                </label>
                <div className="border-2 border-dashed border-[#D4C5B9] rounded-2xl p-6 text-center bg-[#F4EFEA] hover:bg-[#EFE8DE] transition-colors relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {imagePreview ? (
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={imagePreview}
                        alt="Maxsus tort namunasi"
                        className="h-28 object-contain rounded-lg shadow-sm border border-[#E8DFD5]"
                      />
                      <span className="text-xs text-[#895737] underline font-medium">Rasmni almashtirish uchun bosing</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-[#5E4D44]">
                      <Upload className="w-6 h-6 text-[#895737]" />
                      <span className="text-xs font-medium text-[#2C2420]">Rasmni tanlash yoki bu yerga tashlang</span>
                      <span className="text-[11px] text-[#8C7A70]">JPG, PNG, WEBP formatlarini qo'llab-quvvatlaydi (10MB gacha)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Live Visual Summary & Checkout Form (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            
            {/* Real-time Visual Cake Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8DFD5] shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#895737]">
                  Atelier Xulosasi
                </span>
                <span className="text-xs text-[#8C7A70]">Eksklyuziv Buyurtma</span>
              </div>

              {/* Visual Cake Simulation Canvas */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F4EFEA] flex flex-col items-center justify-center border border-[#E8DFD5] p-4 text-center">
                <img
                  src={imagePreview || '/src/assets/images/birthday_cake_artisan_1793864721039.jpg'}
                  alt="Maxsus tort vizualizatsiyasi"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl"
                />
                
                {/* Live Piped Inscription Overlay */}
                {inscription && (
                  <div className="absolute bottom-4 left-4 right-4 bg-[#2C2420]/80 backdrop-blur-md px-3 py-2 rounded-xl text-center shadow-lg border border-white/20">
                    <span className="font-serif italic text-sm text-[#D4A373] tracking-wide block">
                      "{inscription}"
                    </span>
                  </div>
                )}
              </div>

              {/* Spec breakdown */}
              <div className="space-y-2 text-xs text-[#5E4D44]">
                <div className="flex justify-between py-1 border-b border-[#F4EFEA]">
                  <span>Shakl:</span>
                  <span className="font-semibold text-[#2C2420]">{selectedShape.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F4EFEA]">
                  <span>Vazn & Porsiya:</span>
                  <span className="font-semibold text-[#2C2420]">{selectedWeight.weight} kg ({selectedWeight.servings})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F4EFEA]">
                  <span>Ta'm:</span>
                  <span className="font-semibold text-[#2C2420]">{selectedFlavor.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F4EFEA]">
                  <span>Qoplama Kremi:</span>
                  <span className="font-semibold text-[#2C2420]">{selectedCream.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F4EFEA]">
                  <span>Bezak:</span>
                  <span className="font-semibold text-[#2C2420]">{selectedDecoration.name}</span>
                </div>
              </div>

              {/* Total Estimated Price */}
              <div className="pt-2 border-t border-[#E8DFD5] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#8C7A70] uppercase tracking-wider block">Taxminiy Qiymat</span>
                  <div className="text-3xl font-serif font-bold text-[#2C2420] tabular-nums">
                    ${estimatedPrice}
                  </div>
                </div>
                <div className="text-right text-[11px] text-[#895737]">
                  <span>Maxsus Kuryer Bilan Ehtiyotkorona Yetkazish Bepul</span>
                </div>
              </div>

              {/* Client Details Form */}
              <form onSubmit={handleSubmit} className="space-y-3 pt-2">
                <div>
                  <label className="text-[11px] font-medium text-[#5E4D44] block mb-1">To'liq Ismingiz *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nilufar Rahimova"
                    className="w-full px-3.5 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-[#5E4D44] block mb-1">Telefon Raqamingiz *</label>
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+998 (90) 123-4567"
                      className="w-full px-3.5 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-[#5E4D44] block mb-1">Elektron Pochta</label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="nilufar@domain.uz"
                      className="w-full px-3.5 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-[#5E4D44] block mb-1">Yetkazib Berish Sanasi *</label>
                    <input
                      type="date"
                      required
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-[#5E4D44] block mb-1">Yetkazish Vaqti</label>
                    <select
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                    >
                      <option value="10:00 - 12:00">10:00 - 12:00 (Tonggi)</option>
                      <option value="12:00 - 14:00">12:00 - 14:00 (Tushki)</option>
                      <option value="14:00 - 17:00">14:00 - 17:00 (Kungi)</option>
                      <option value="17:00 - 20:00">17:00 - 20:00 (Kechki)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#5E4D44] block mb-1">Qandolatchi Uchun Maxsus Izoh / Talablar</label>
                  <textarea
                    rows={2}
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="Allergiya, eshik kodi yoki gullar bo'yicha alohida istaklar..."
                    className="w-full px-3.5 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3.5 px-6 bg-[#2C2420] hover:bg-[#895737] text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Buyurtma yuborilmoqda...' : 'Maxsus Tort Buyurtmasini Yuborish'}</span>
                </button>
              </form>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
