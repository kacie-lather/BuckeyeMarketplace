import { useCart } from '../../context/CartContext'
import { CartItem } from '../../context/CartContext'
import { updateCartItem, removeCartItem } from '../../services/cartService'
import { fetchCart } from '../../services/cartService'

interface Props {
  item: CartItem
}

function CartItemRow({ item }: Props) {
  const { dispatch } = useCart()

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return
    await updateCartItem(item.cartItemId, newQuantity)
    const cart = await fetchCart()
    dispatch({ type: 'SET_CART', items: cart.items, total: cart.total, itemCount: cart.itemCount })
  }

  const handleRemove = async () => {
    await removeCartItem(item.cartItemId)
    const cart = await fetchCart()
    dispatch({ type: 'SET_CART', items: cart.items, total: cart.total, itemCount: cart.itemCount })
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderBottom: '1px solid #eee' }}>
      <img
        src={item.imageUrl}
        alt={item.title}
        style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '4px' }}
      />
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 'bold', margin: '0 0 4px' }}>{item.title}</p>
        <p style={{ color: '#666', margin: 0 }}>${item.price.toFixed(2)} each</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          onClick={() => handleUpdateQuantity(item.quantity - 1)}
          disabled={item.quantity <= 1}
          style={{ padding: '4px 10px', cursor: 'pointer', opacity: item.quantity <= 1 ? 0.4 : 1 }}
        >−</button>
        <span style={{ width: '32px', textAlign: 'center' }}>{item.quantity}</span>
        <button
          type="button"
          onClick={() => handleUpdateQuantity(item.quantity + 1)}
          style={{ padding: '4px 10px', cursor: 'pointer' }}
        >+</button>
      </div>
      <p style={{ width: '80px', textAlign: 'right', fontWeight: 'bold' }}>
        ${item.subtotal.toFixed(2)}
      </p>
      <button
        type="button"
        onClick={handleRemove}
        style={{ color: '#BB0000', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
      >Remove</button>
    </div>
  )
}

export default CartItemRow