import api from './api'

export async function fetchCart() {
  const res = await api.get('/cart')
  return res.data
}

export async function addToCart(productId: number, quantity: number = 1) {
  await api.post('/cart', { productId, quantity })
}

export async function updateCartItem(cartItemId: number, quantity: number) {
  const res = await api.put(`/cart/${cartItemId}`, { quantity })
  return res.data
}

export async function removeCartItem(cartItemId: number) {
  await api.delete(`/cart/${cartItemId}`)
}

export async function clearCart() {
  await api.delete('/cart/clear')
}
