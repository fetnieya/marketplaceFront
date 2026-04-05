/**
 * Cart helper: sync with backend when user is logged in, else use localStorage.
 * Cart in localStorage is always the source for display (header badge, Cart page, Checkout).
 */

const CART_STORAGE_KEY = 'cart';
const API_BASE = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';

function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getCurrentUser() {
  try {
    const u = localStorage.getItem('currentUser');
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
}

function getCartFromStorage() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function setCartToStorage(items) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('cart-updated'));
}

/**
 * @param {import('axios').default} axios
 * @returns {Promise<Array<{ product: any, quantity: number }>>}
 */
export async function fetchCart(axios) {
  const user = getCurrentUser();
  if (user && user.id) {
    try {
      const res = await axios.get(`${API_BASE}/cart`, { headers: getAuthHeaders() });
      const items = Array.isArray(res.data) ? res.data : [];
      setCartToStorage(items);
      return items;
    } catch (err) {
      console.warn('Cart fetch failed, using localStorage', err);
      return getCartFromStorage();
    }
  }
  return getCartFromStorage();
}

/**
 * Add item to cart (API if logged in, then sync to localStorage).
 * @param {import('axios').default} axios
 * @param {number} productId
 * @param {number} quantity
 * @param {object} [product] - optional product snapshot for localStorage when guest
 */
export async function addToCart(axios, productId, quantity, product = null) {
  const user = getCurrentUser();
  if (user && user.id) {
    try {
      const res = await axios.post(
        `${API_BASE}/cart/items`,
        { productId: Number(productId), quantity: Number(quantity) },
        { headers: getAuthHeaders() }
      );
      const items = Array.isArray(res.data) ? res.data : [];
      setCartToStorage(items);
      return items;
    } catch (err) {
      console.warn('Add to cart API failed, using localStorage', err?.response?.status, err?.response?.data);
      // Fallback: add to localStorage so the user is never blocked
      const cart = getCartFromStorage();
      const existing = cart.find((i) => i.product && i.product.id === productId);
      if (existing) {
        existing.quantity += quantity;
      } else if (product) {
        cart.push({
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            oldPrice: product.oldPrice ?? null,
            image: product.image || (product.images && product.images[0] && product.images[0].url) || null,
          },
          quantity,
        });
      } else {
        cart.push({ product: { id: productId, name: '', price: 0, image: null }, quantity });
      }
      setCartToStorage(cart);
      return cart;
    }
  }
  const cart = getCartFromStorage();
  const existing = cart.find((i) => i.product && i.product.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else if (product) {
    cart.push({
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice ?? null,
        image: product.image || (product.images && product.images[0] && product.images[0].url) || null,
      },
      quantity,
    });
  } else {
    cart.push({ product: { id: productId, name: '', price: 0, image: null }, quantity });
  }
  setCartToStorage(cart);
  return cart;
}

/**
 * Update quantity for a product in cart.
 * @param {import('axios').default} axios
 * @param {number} productId
 * @param {number} quantity
 */
export async function updateCartQuantity(axios, productId, quantity) {
  const user = getCurrentUser();
  if (user && user.id) {
    try {
      await axios.patch(
        `${API_BASE}/cart/items/${productId}`,
        { quantity },
        { headers: getAuthHeaders() }
      );
      return fetchCart(axios);
    } catch (err) {
      console.error('Update cart failed', err);
      throw err;
    }
  }
  const cart = getCartFromStorage();
  const item = cart.find((i) => i.product && i.product.id === productId);
  if (item) {
    item.quantity = quantity;
    if (item.quantity < 1) {
      cart.splice(cart.indexOf(item), 1);
    }
    setCartToStorage(cart);
  }
  return cart;
}

/**
 * Remove item from cart.
 * @param {import('axios').default} axios
 * @param {number} productId
 */
export async function removeFromCart(axios, productId) {
  const user = getCurrentUser();
  if (user && user.id) {
    try {
      await axios.delete(`${API_BASE}/cart/items/${productId}`, { headers: getAuthHeaders() });
      return fetchCart(axios);
    } catch (err) {
      console.error('Remove from cart failed', err);
      throw err;
    }
  }
  const cart = getCartFromStorage().filter((i) => i.product && i.product.id !== productId);
  setCartToStorage(cart);
  return cart;
}

export function getCartCount() {
  const cart = getCartFromStorage();
  return cart.reduce((sum, i) => sum + (i.quantity || 1), 0);
}

export { getCartFromStorage, setCartToStorage, getCurrentUser, CART_STORAGE_KEY };
