import React, { useState, useEffect } from 'react';
import { getIds, getProducts } from './apiRequests';

function ProductList({ products }) {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <p>ID: {product.id}</p>
          <p>Name: {product.product}</p>
          <p>Price: {product.price}</p>
          <p>Brand: {product.brand || 'N/A'}</p>
        </li>
      ))}
    </ul>
  );
}

function App() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [nameFilter, setNameFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const ids = await getIds({ offset: (page - 1) * 50, limit: 50 });
        const productsData = await getProducts(ids);
        setProducts(productsData.filter((product) => {
          const nameMatch = !nameFilter || product.product.toLowerCase().includes(nameFilter.toLowerCase());
          const priceMatch = !priceFilter || parseFloat(product.price) === parseFloat(priceFilter);
          const brandMatch = !brandFilter || product.brand?.toLowerCase().includes(brandFilter.toLowerCase());
          return nameMatch && priceMatch && brandMatch;
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [page, nameFilter, priceFilter, brandFilter]);

  return (
    <div className="App">
      <h1>Product List</h1>
      <div>
        <label>
          Name:
          <input
            type="text"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          />
        </label>
        <label>
          Brand:
          <input
            type="text"
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
          />
        </label>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ProductList products={products} />
          <div>
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>
              Previous
            </button>
            <span>
              Page {page}
            </span>
            <button onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;