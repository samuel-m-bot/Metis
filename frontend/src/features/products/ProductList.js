import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const initialProducts = [
  { id: 1, name: 'Product A', category: 'Electronics', releaseDate: '2022-01-01', productId: 'A123' },
  { id: 2, name: 'Product B', category: 'Software', releaseDate: '2022-05-15', productId: 'B456' },
  { id: 3, name: 'Product C', category: 'Hardware', releaseDate: '2022-07-22', productId: 'C789' },
];

const ProductList = () => {
  const [products, setProducts] = useState(initialProducts);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  useEffect(() => {
    let sortedProducts = [...initialProducts];
    sortedProducts.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setProducts(sortedProducts);
  }, [sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Product List</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th onClick={() => requestSort('name')}>
              Name {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
            </th>
            <th onClick={() => requestSort('category')}>
              Category {sortConfig.key === 'category' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
            </th>
            <th onClick={() => requestSort('releaseDate')}>
              Release Date {sortConfig.key === 'releaseDate' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
            </th>
            <th onClick={() => requestSort('productId')}>
              Product ID {sortConfig.key === 'productId' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <Link to={`/products/${product.productId}`}>{product.name}</Link>
              </td>
              <td>{product.category}</td>
              <td>{product.releaseDate}</td>
              <td>{product.productId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
