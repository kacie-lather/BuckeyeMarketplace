import { useCart } from '../../context/CartContext'
import { CartItem } from '../../context/CartContext'

interface Props {
  item: CartItem
}

function CartItemRow({ item }: Props) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderBottom: '1px solid #eee' }}>
      <img
        src={item.product.imageUrl}
        alt={item.product.title}
        style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '4px' }}
      />
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 'bold', margin: '0 0 4px' }}>{item.product.title}</p>
        <p style={{ color: '#666', margin: 0 }}>${item.product.price.toFixed(2)} each</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
          style={{ padding: '4px 10px', cursor: 'pointer', opacity: item.quantity <= 1 ? 0.4 : 1 }}
        >−</button>
        <span style={{ width: '32px', textAlign: 'center' }}>{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          style={{ padding: '4px 10px', cursor: 'pointer' }}
        >+</button>
      </div>
      <p style={{ width: '80px', textAlign: 'right', fontWeight: 'bold' }}>
        ${(item.product.price * item.quantity).toFixed(2)}
      </p>
      <button
        onClick={() => removeItem(item.id)}
        style={{ color: '#BB0000', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
      >Remove</button>
    </div>
  )
}

export default CartItemRow