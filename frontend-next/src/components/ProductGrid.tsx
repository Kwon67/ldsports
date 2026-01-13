'use client';

import ProductCard from './ProductCard';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
}

function ProductGrid({ products }: ProductGridProps) {
  return (
    <section id="camisas" className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
        {products.map((product, index) => (
          <div
            key={product.id}
            style={{ animationDelay: `${index * 100}ms` }}
            className="animate-fade-in-scale"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductGrid;
