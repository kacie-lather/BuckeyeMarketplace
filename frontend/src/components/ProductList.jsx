import ProductCard from './ProductCard'

function ProductList({ products }) {
  if (products.length === 0) {
    return <p>No products available right now. Check back soon!</p>
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px',
      marginTop: '20px'
    }}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductList