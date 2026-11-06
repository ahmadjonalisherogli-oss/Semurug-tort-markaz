import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { db } from './server/db.js';
import { Order, CustomOrder } from './src/types.js';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'semurug_luxury_patisserie_secret_key_2026';

// Middleware
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Ensure upload directory
const UPLOAD_DIR = path.resolve(process.cwd(), 'data', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOAD_DIR));

// JWT Helpers (RFC 7519 standard HMAC-SHA256)
function generateToken(payload: { userId: string; email: string; role: string }): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
  const fullPayload = { ...payload, exp };

  const encodeBase64Url = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString('base64url');

  const b64Header = encodeBase64Url(header);
  const b64Payload = encodeBase64Url(fullPayload);
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${b64Header}.${b64Payload}`)
    .digest('base64url');

  return `${b64Header}.${b64Payload}.${signature}`;
}

function verifyToken(token: string): { userId: string; email: string; role: string; exp: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [b64Header, b64Payload, signature] = parts;

    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${b64Header}.${b64Payload}`)
      .digest('base64url');

    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(Buffer.from(b64Payload, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

// Authentication Middleware
interface AuthRequest extends Request {
  user?: { userId: string; email: string; role: string };
}

function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
}

function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Administrator access required' });
  }
  next();
}

// Optional Auth (for guest or logged-in users)
function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }
  next();
}

// Telegram Notification Simulator/Dispatcher
async function dispatchTelegramNotification(message: string) {
  console.log('--- TELEGRAM NOTIFICATION DISPATCH ---');
  console.log(message);
  console.log('---------------------------------------');
  // If user sets up external telegram webhook in settings, it dispatches here cleanly
}

// ==========================================
// API ROUTES
// ==========================================

// --- Auth Routes ---
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, password, full_name, phone, address } = req.body;

  if (!email || !password || !full_name) {
    return res.status(400).json({ error: 'Email, password, and full name are required' });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const newUser = db.createUser({
    email,
    password_hash: password, // In production, bcrypt.hash
    full_name,
    phone: phone || '',
    address: address || '',
    role: 'customer'
  });

  const token = generateToken({
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role
  });

  const { password_hash, ...safeUser } = newUser;
  res.status(201).json({ user: safeUser, token });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.getUserByEmail(email);
  if (!user || user.password_hash !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  const { password_hash, ...safeUser } = user;
  res.json({ user: safeUser, token });
});

app.post('/api/auth/admin-login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Admin elektron pochta va maxfiy parol talab qilinadi' });
  }

  const user = db.getUserByEmail(email);
  if (!user || user.password_hash !== password) {
    return res.status(401).json({ error: 'Noto\'g\'ri login yoki parol kiritildi' });
  }

  if (user.role !== 'admin') {
    return res.status(403).json({
      error: 'Ruxsat etilmadi: Ushbu portal faqat administratorlar uchun mo\'ljallangan. Oddiy xaridorlar xaridor loginidan foydalanishi kerak.'
    });
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  const { password_hash, ...safeUser } = user;
  res.json({ user: safeUser, token });
});

app.get('/api/auth/me', authenticateToken, (req: AuthRequest, res: Response) => {
  const user = db.getUserById(req.user!.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { password_hash, ...safeUser } = user;
  res.json({ user: safeUser });
});

app.put('/api/auth/profile', authenticateToken, (req: AuthRequest, res: Response) => {
  const { full_name, phone, address } = req.body;
  const updated = db.updateUser(req.user!.userId, { full_name, phone, address });
  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { password_hash, ...safeUser } = updated;
  res.json({ user: safeUser });
});

// --- Categories Routes ---
app.get('/api/categories', (_req: Request, res: Response) => {
  const categories = db.getCategories();
  res.json(categories);
});

app.post('/api/categories', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const { name, slug, description, image, display_order } = req.body;
  if (!name || !slug) {
    return res.status(400).json({ error: 'Name and slug are required' });
  }
  const category = db.addCategory({
    name,
    slug,
    description: description || '',
    image: image || '/src/assets/images/hero_signature_cake_1793864720413.jpg',
    display_order: display_order || 99
  });
  res.status(201).json(category);
});

// --- Products Routes ---
app.get('/api/products', (req: Request, res: Response) => {
  const {
    category,
    search,
    minPrice,
    maxPrice,
    sort,
    featured,
    availableOnly
  } = req.query;

  const products = db.getProducts({
    category: category as string,
    search: search as string,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort: sort as string,
    featured: featured === 'true',
    availableOnly: availableOnly === 'true'
  });

  res.json(products);
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.post('/api/products', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const {
    name,
    slug,
    description,
    category,
    category_slug,
    price,
    weight_grams,
    available,
    pre_order_available,
    preparation_time_hours,
    featured,
    best_seller,
    is_new,
    images,
    ingredients,
    sizes
  } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Name, price, and category are required' });
  }

  const newProduct = db.createProduct({
    name,
    slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: description || '',
    category,
    category_slug: category_slug || category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    price: Number(price),
    weight_grams: Number(weight_grams) || 1000,
    available: available !== false,
    pre_order_available: pre_order_available !== false,
    preparation_time_hours: Number(preparation_time_hours) || 12,
    featured: Boolean(featured),
    best_seller: Boolean(best_seller),
    is_new: Boolean(is_new),
    images: images && images.length ? images : ['/src/assets/images/hero_signature_cake_1793864720413.jpg'],
    ingredients: Array.isArray(ingredients) ? ingredients : ['Pure butter', 'Organic flour', 'Tahitian vanilla'],
    sizes: Array.isArray(sizes) && sizes.length ? sizes : [
      { label: 'Standard', weight_grams: Number(weight_grams) || 1000, price: Number(price) }
    ]
  });

  res.status(201).json(newProduct);
});

app.put('/api/products/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(updated);
});

app.delete('/api/products/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ message: 'Product deleted successfully' });
});

// --- Orders Routes ---
app.post('/api/orders', optionalAuth, (req: AuthRequest, res: Response) => {
  const {
    customer_name,
    customer_email,
    customer_phone,
    delivery_address,
    delivery_date,
    delivery_time,
    order_notes,
    items,
    payment_method
  } = req.body;

  if (!customer_name || !customer_phone || !delivery_address || !delivery_date || !items || !items.length) {
    return res.status(400).json({ error: 'Please provide all required delivery details and at least one cake item' });
  }

  const settings = db.getSettings();
  const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  const delivery_cost = subtotal >= settings.free_delivery_threshold ? 0 : settings.delivery_fee;
  const total = subtotal + delivery_cost;

  const order = db.createOrder({
    user_id: req.user ? req.user.userId : null,
    customer_name,
    customer_email: customer_email || '',
    customer_phone,
    delivery_address,
    delivery_date,
    delivery_time: delivery_time || '12:00 - 15:00',
    order_notes: order_notes || '',
    items,
    subtotal,
    delivery_cost,
    total,
    payment_method: payment_method || 'card_on_delivery'
  });

  // Trigger Notification to Bakery & Telegram
  const notifyMessage = `🎂 NEW ORDER RECEIVED #${order.order_number}\nCustomer: ${order.customer_name}\nPhone: ${order.customer_phone}\nTotal: $${order.total}\nDelivery: ${order.delivery_date} (${order.delivery_time})\nItems: ${order.items.map(i => `${i.quantity}x ${i.name} [${i.size_label}]`).join(', ')}`;
  dispatchTelegramNotification(notifyMessage);

  res.status(201).json(order);
});

app.get('/api/orders', optionalAuth, (req: AuthRequest, res: Response) => {
  // If admin, return all; if logged-in customer, return their orders; otherwise empty
  if (req.user?.role === 'admin') {
    return res.json(db.getOrders());
  }
  if (req.user) {
    return res.json(db.getOrders(req.user.userId));
  }
  res.json([]);
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

app.patch('/api/orders/:id/status', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const { status } = req.body;
  const order = db.updateOrderStatus(req.params.id, status as Order['status']);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Notify customer
  dispatchTelegramNotification(`🔔 Order #${order.order_number} status updated to: ${status}`);
  res.json(order);
});

// --- Custom Orders Routes ---
app.post('/api/custom-orders', optionalAuth, (req: AuthRequest, res: Response) => {
  const {
    customer_name,
    customer_email,
    customer_phone,
    cake_type,
    weight_kg,
    flavor,
    cream,
    decoration,
    personalized_message,
    reference_image,
    delivery_date,
    delivery_time,
    estimated_price
  } = req.body;

  if (!customer_name || !customer_phone || !cake_type || !weight_kg || !delivery_date) {
    return res.status(400).json({ error: 'Please fill in all essential custom cake options' });
  }

  const customOrder = db.createCustomOrder({
    user_id: req.user ? req.user.userId : null,
    customer_name,
    customer_email: customer_email || '',
    customer_phone,
    cake_type,
    weight_kg: Number(weight_kg),
    flavor: flavor || 'Madagascar Vanilla Bean',
    cream: cream || 'Swiss Meringue Buttercream',
    decoration: decoration || 'Artisanal Piping & Berries',
    personalized_message: personalized_message || '',
    reference_image: reference_image || '',
    delivery_date,
    delivery_time: delivery_time || '14:00 - 17:00',
    estimated_price: Number(estimated_price) || 120
  });

  const notifyMessage = `✨ NEW BESPOKE CUSTOM CAKE INQUIRY #${customOrder.order_number}\nClient: ${customOrder.customer_name}\nPhone: ${customOrder.customer_phone}\nType: ${customOrder.cake_type} (${customOrder.weight_kg}kg)\nFlavor: ${customOrder.flavor}\nEst. Price: $${customOrder.estimated_price}\nDelivery: ${customOrder.delivery_date}`;
  dispatchTelegramNotification(notifyMessage);

  res.status(201).json(customOrder);
});

app.get('/api/custom-orders', optionalAuth, (req: AuthRequest, res: Response) => {
  if (req.user?.role === 'admin') {
    return res.json(db.getCustomOrders());
  }
  if (req.user) {
    return res.json(db.getCustomOrders(req.user.userId));
  }
  res.json([]);
});

app.patch('/api/custom-orders/:id/status', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const { status } = req.body;
  const order = db.updateCustomOrderStatus(req.params.id, status as CustomOrder['status']);
  if (!order) {
    return res.status(404).json({ error: 'Custom order not found' });
  }
  res.json(order);
});

// --- Reviews Routes ---
app.get('/api/reviews', (req: Request, res: Response) => {
  const { product_id } = req.query;
  const reviews = db.getReviews(product_id as string);
  res.json(reviews);
});

app.post('/api/reviews', (req: Request, res: Response) => {
  const { product_id, user_name, rating, comment } = req.body;
  if (!product_id || !user_name || !rating || !comment) {
    return res.status(400).json({ error: 'Product ID, name, rating, and comment are required' });
  }

  const review = db.createReview({
    product_id,
    user_name,
    rating: Math.min(5, Math.max(1, Number(rating))),
    comment,
    is_verified_purchase: true
  });

  res.status(201).json(review);
});

app.delete('/api/reviews/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteReview(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Review not found' });
  }
  res.json({ message: 'Review removed' });
});

// --- File Upload for Custom Cake References ---
app.post('/api/upload', (req: Request, res: Response) => {
  try {
    const { imageBase64, filename } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const matches = imageBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      // If it's already an existing URL or path, return directly
      return res.json({ url: imageBase64 });
    }

    const ext = matches[1].split('/')[1] || 'jpg';
    const buffer = Buffer.from(matches[2], 'base64');
    const safeName = `cake_ref_${Date.now()}_${Math.floor(Math.random() * 10000)}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, safeName);

    fs.writeFileSync(filePath, buffer);
    const fileUrl = `/uploads/${safeName}`;

    res.json({ url: fileUrl });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save image', details: err.message });
  }
});

// --- Settings & Admin Stats ---
app.get('/api/settings', (_req: Request, res: Response) => {
  res.json(db.getSettings());
});

app.put('/api/settings', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  res.json(updated);
});

app.get('/api/admin/stats', authenticateToken, requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getAdminStats());
});

app.get('/api/admin/customers', authenticateToken, requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getUsers());
});

// --- Inquiries Routes ---
app.post('/api/inquiries', (req: Request, res: Response) => {
  const { name, phone, email, message } = req.body;
  if (!name || !phone || !message) {
    return res.status(400).json({ error: 'Name, phone, and inquiry message are required' });
  }

  const inquiry = db.createInquiry({
    name,
    phone,
    email: email || '',
    message,
  });

  dispatchTelegramNotification(
    `📩 YANGI XABAR / INQUIRY #${inquiry.id}\nFoydalanuvchi: ${inquiry.name}\nTel: ${inquiry.phone}\nEmail: ${inquiry.email}\nXabar: "${inquiry.message}"`
  );

  res.status(201).json(inquiry);
});

app.get('/api/inquiries', authenticateToken, requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getInquiries());
});

app.patch('/api/inquiries/:id/status', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const { status } = req.body;
  const updated = db.updateInquiryStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }
  res.json(updated);
});

app.delete('/api/inquiries/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteInquiry(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }
  res.json({ message: 'Inquiry removed' });
});

// --- FAQs Routes ---
app.get('/api/faqs', (_req: Request, res: Response) => {
  res.json(db.getFaqs());
});

app.post('/api/faqs', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const { question, answer, display_order } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ error: 'Question and answer are required' });
  }
  const faq = db.createFaq({
    question,
    answer,
    display_order: display_order || 99,
  });
  res.status(201).json(faq);
});

app.put('/api/faqs/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateFaq(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'FAQ not found' });
  }
  res.json(updated);
});

app.delete('/api/faqs/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteFaq(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'FAQ not found' });
  }
  res.json({ message: 'FAQ removed' });
});

// --- Gallery Routes ---
app.get('/api/gallery', (_req: Request, res: Response) => {
  res.json(db.getGallery());
});

app.post('/api/gallery', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const { image, caption, tag, display_order } = req.body;
  if (!image) {
    return res.status(400).json({ error: 'Image URL is required' });
  }
  const item = db.createGalleryItem({
    image,
    caption: caption || 'Semurug Patisserie Highlight',
    tag: tag || '@semurug_cakes',
    display_order: display_order || 99,
  });
  res.status(201).json(item);
});

app.delete('/api/gallery/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteGalleryItem(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Gallery item not found' });
  }
  res.json({ message: 'Gallery item deleted' });
});

// --- Custom Cake Options Routes ---
app.get('/api/custom-cake-options', (_req: Request, res: Response) => {
  res.json(db.getCustomOptions());
});

app.put('/api/custom-cake-options', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateCustomOptions(req.body);
  res.json(updated);
});

// ==========================================
// VITE MIDDLEWARE & FRONTEND SERVING
// ==========================================
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🍰 Semurug Cake Center server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
