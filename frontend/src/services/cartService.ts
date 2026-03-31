import { API_BASE_URL } from '../config'

const API_BASE = `${API_BASE_URL}/api/cart`

export async function fetchCart() {
  const res = await fetch(API_BASE)
  if (res.status === 404) return { items: [], total: 0, itemCount: 0 }
  if (!res.ok) throw new Error('Failed to fetch cart')
  return res.json()
}

export async function addToCart(productId: number, quantity: number = 1) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity })
  })
  if (!res.ok) throw new Error('Failed to add item to cart')
}

export async function updateCartItem(cartItemId: number, quantity: number) {
  const res = await fetch(`${API_BASE}/${cartItemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity })
  })
  if (!res.ok) throw new Error('Failed to update quantity')
  return res.json()
}

export async function removeCartItem(cartItemId: number) {
  const res = await fetch(`${API_BASE}/${cartItemId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to remove item')
}

export async function clearCart() {
  const res = await fetch(`${API_BASE}/clear`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to clear cart')
}
