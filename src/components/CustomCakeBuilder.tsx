import React, { useState } from 'react';
import { Upload, Calendar, CheckCircle2, Sparkles, Send, Image as ImageIcon } from 'lucide-react';
import { api } from '../services/api.js';
import { CustomOrder } from '../types.js';

interface CustomCakeBuilderProps {
  onSuccess: (order: CustomOrder) => void;
}

const CAKE_SHAPES = [
  { id: 'round', name: 'Classic Round Tier', desc: 'Timeless architectural cylinder with smooth or textured palette knife finish', baseMultiplier: 1.0 },
  { id: 'heart', name: 'Vintage Lambeth Heart', desc: 'Romantic Victorian piped scalloping and delicate beadwork', baseMultiplier: 1.15 },
  { id: 'tiered', name: 'Grand Two-Tier Architectural', desc: 'Dramatic height for milestone galas and intimate weddings', baseMultiplier: 1.4 },
  { id: 'square', name: 'Modern Haute Square', desc: 'Sharp minimalist bevels inspired by Parisian pastry boutiques', baseMultiplier: 1.1 },
];

const WEIGHT_OPTIONS = [
  { weight: 1.0, servings: '6-8 Servings', price: 75 },
  { weight: 1.5, servings: '10-12 Servings', price: 105 },
  { weight: 2.0, servings: '14-16 Servings', price: 135 },
  { weight: 3.0, servings: '22-26 Servings', price: 195 },
  { weight: 5.0, servings: '40-50 Servings (Double Tier)', price: 320 },
];

const FLAVORS = [
  { name: 'Madagascar Bourbon Vanilla', desc: 'Real vanilla bean caviar infused in moist buttermilk sponge' },
  { name: '72% Valrhona Dark Truffle', desc: 'Single-origin Venezuelan cocoa with roasted hazelnut crunch' },
  { name: 'Red Velvet Supreme', desc: 'Moist ruby sponge with delicate cocoa undertones' },
  { name: 'Bronte Pistachio & Raspberry', desc: 'Roasted Sicilian pistachios with housemade berry confiture' },
  { name: 'Salted Dulce de Leche Pecan', desc: 'Golden caramel sponge layered with fleur de sel and toasted pecans' },
];

const CREAMS = [
  { name: 'Swiss Meringue Buttercream', desc: 'Silky, ultra-light, satin-smooth finish' },
  { name: 'White Chocolate Ganache', desc: 'Velvety 34% cacao ganache, ivory richness' },
  { name: 'Cream Cheese Chantilly', desc: 'Delicately tangy, cloud-like consistency' },
  { name: 'Whipped Valrhona Dark Ganache', desc: 'Deep bittersweet chocolate indulgence' },
];

const DECORATIONS = [
  { name: 'Edible 24K Gold & Wild Forest Berries', desc: 'Lush organic blackberries, raspberries, and genuine gold leaf flakes', surcharge: 25 },
  { name: 'Handcrafted Sugar Blossom Cascade', desc: 'Individual sugar petals, hydrangeas, and trailing eucalyptus leaves', surcharge: 45 },
  { name: 'Almond Macarons & Spun Sugar Halo', desc: 'Housemade pastel macarons with delicate caramelized sugar crown', surcharge: 30 },
  { name: 'Victorian Lambeth Scrollwork & Pearls', desc: 'Intricate multi-layered overpiping with edible shimmering pearls', surcharge: 35 },
  { name: 'Minimalist Contemporary Floral & Linen', desc: 'Organic wafer paper sails, dried botanicals, and neutral linen texture', surcharge: 20 },
];

export const CustomCakeBuilder: React.FC<CustomCakeBuilderProps> = ({ onSuccess }) => {
  const [selectedShape, setSelectedShape] = useState(CAKE_SHAPES[0]);
  const [selectedWeight, setSelectedWeight] = useState(WEIGHT_OPTIONS[1]);
  const [selectedFlavor, setSelectedFlavor] = useState(FLAVORS[0]);
  const [selectedCream, setSelectedCream] = useState(CREAMS[0]);
  const [selectedDecoration, setSelectedDecoration] = useState(DECORATIONS[0]);
  const [inscription, setInscription] = useState('Happy Birthday Sophia');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      alert('Please provide your name, phone number, and requested delivery date.');
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
      alert(`Could not submit custom order: ${err.message}`);
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
            <span>The Bespoke Atelier</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2C2420]">
            Design Your Custom Masterpiece
          </h2>
          <p className="text-sm sm:text-base text-[#5E4D44] leading-relaxed">
            Select your cake silhouette, artisanal flavor profile, handcrafted fillings, and personalized inscription. Our master pâtissiers bring your vision to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Interactive Customization Steps (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Step 1: Shape / Silhouette */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#2C2420]">
                  1. Cake Silhouette & Form
                </h3>
                <span className="text-xs text-[#895737] font-medium">{selectedShape.name}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CAKE_SHAPES.map((shape) => (
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
                  2. Weight & Portion Sizing
                </h3>
                <span className="text-xs text-[#895737] font-medium">{selectedWeight.weight} kg · {selectedWeight.servings}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {WEIGHT_OPTIONS.map((opt) => (
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
                  3. Sponge & Filling Infusion
                </h3>
                <span className="text-xs text-[#895737] font-medium">{selectedFlavor.name}</span>
              </div>
              <div className="space-y-2">
                {FLAVORS.map((flavor) => (
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
                  4. Artisanal Frosting & Finish
                </h3>
                <span className="text-xs text-[#895737] font-medium">{selectedCream.name}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CREAMS.map((cream) => (
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
                  5. Signature Decoration & Garnish
                </h3>
                <span className="text-xs text-[#895737] font-medium">+${selectedDecoration.surcharge}</span>
              </div>
              <div className="space-y-2">
                {DECORATIONS.map((dec) => (
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
                6. Custom Inscription & Moodboard Reference
              </h3>
              
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#5E4D44]">
                  Personal Inscription (Piped in French calligraphy):
                </label>
                <input
                  type="text"
                  value={inscription}
                  onChange={(e) => setInscription(e.target.value)}
                  placeholder="e.g. Happy 30th Birthday Eleanor"
                  maxLength={50}
                  className="w-full px-4 py-2.5 bg-white border border-[#E8DFD5] rounded-xl text-sm text-[#2C2420] focus:outline-none focus:ring-2 focus:ring-[#895737]"
                />
              </div>

              {/* Reference Image Upload */}
              <div className="pt-2">
                <label className="text-xs font-medium text-[#5E4D44] block mb-2">
                  Upload Inspiration / Reference Image (Optional):
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
                        alt="Custom cake reference"
                        className="h-28 object-contain rounded-lg shadow-sm border border-[#E8DFD5]"
                      />
                      <span className="text-xs text-[#895737] underline font-medium">Click to change photo</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-[#5E4D44]">
                      <Upload className="w-6 h-6 text-[#895737]" />
                      <span className="text-xs font-medium text-[#2C2420]">Drag or click to attach image file</span>
                      <span className="text-[11px] text-[#8C7A70]">Supports JPG, PNG, WEBP up to 10MB</span>
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
                  Atelier Summary
                </span>
                <span className="text-xs text-[#8C7A70]">Bespoke Order</span>
              </div>

              {/* Visual Cake Simulation Canvas */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F4EFEA] flex flex-col items-center justify-center border border-[#E8DFD5] p-4 text-center">
                <img
                  src={imagePreview || '/src/assets/images/birthday_cake_artisan_1793864721039.jpg'}
                  alt="Custom Cake Simulation"
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
                  <span>Form:</span>
                  <span className="font-semibold text-[#2C2420]">{selectedShape.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F4EFEA]">
                  <span>Weight & Servings:</span>
                  <span className="font-semibold text-[#2C2420]">{selectedWeight.weight} kg ({selectedWeight.servings})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F4EFEA]">
                  <span>Flavor:</span>
                  <span className="font-semibold text-[#2C2420]">{selectedFlavor.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F4EFEA]">
                  <span>Frosting:</span>
                  <span className="font-semibold text-[#2C2420]">{selectedCream.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F4EFEA]">
                  <span>Garnish:</span>
                  <span className="font-semibold text-[#2C2420]">{selectedDecoration.name}</span>
                </div>
              </div>

              {/* Total Estimated Price */}
              <div className="pt-2 border-t border-[#E8DFD5] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#8C7A70] uppercase tracking-wider block">Estimated Investment</span>
                  <div className="text-3xl font-serif font-bold text-[#2C2420] tabular-nums">
                    ${estimatedPrice}
                  </div>
                </div>
                <div className="text-right text-[11px] text-[#895737]">
                  <span>Complimentary Hand Delivery Included</span>
                </div>
              </div>

              {/* Client Details Form */}
              <form onSubmit={handleSubmit} className="space-y-3 pt-2">
                <div>
                  <label className="text-[11px] font-medium text-[#5E4D44] block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Lady Eleanor Sterling"
                    className="w-full px-3.5 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-[#5E4D44] block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-[#5E4D44] block mb-1">Email</label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="client@luxury.com"
                      className="w-full px-3.5 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-[#5E4D44] block mb-1">Delivery Date *</label>
                    <input
                      type="date"
                      required
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-[#5E4D44] block mb-1">Preferred Window</label>
                    <select
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                    >
                      <option value="10:00 - 12:00">10:00 - 12:00 (Morning)</option>
                      <option value="12:00 - 14:00">12:00 - 14:00 (Noon)</option>
                      <option value="14:00 - 17:00">14:00 - 17:00 (Afternoon)</option>
                      <option value="17:00 - 20:00">17:00 - 20:00 (Evening)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#5E4D44] block mb-1">Special Chef Notes</label>
                  <textarea
                    rows={2}
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="Allergies, delivery gate code, or specific floral preference..."
                    className="w-full px-3.5 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3.5 px-6 bg-[#2C2420] hover:bg-[#895737] text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting Atelier Request...' : 'Submit Bespoke Order'}</span>
                </button>
              </form>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
