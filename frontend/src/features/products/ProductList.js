import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from './productsApiSlice';
import useAuth from '../../hooks/useAuth';

const ProductList = () => {
  const { data: products, isLoading, isError, error } = useGetProductsQuery();
  const [sortedProducts, setSortedProducts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const { isAdmin, isProjectManager, email } = useAuth();
  const navigate = useNavigate()

  useEffect(() => {
    if (products && products.ids.length > 0) {
      let sorted = products.ids.map(id => products.entities[id]);
      sorted.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
      setSortedProducts(sorted);
    } else {
      setSortedProducts([]);
    }
  }, [sortConfig, products]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) {
    if (error.status === 400 && error?.data?.message === 'No products found"') {
      return (
        <div className="container mt-5">
          <h2>{error.data.message}</h2>
          {(isAdmin || isProjectManager) && (
            <button className="btn btn-primary" onClick={() => navigate('/admin-dashboard/products/create')}>
              Create New Change Request
            </button>
          )}
        </div>
      );
    }
    return <p>Error: {error?.data?.message}</p>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Product List</h2>
      {(isAdmin || isProjectManager) && (
        <button className="btn btn-primary" onClick={() => navigate('/admin-dashboard/products/create')}>
          Create New Product
        </button>
      )}
      <table className="table table-striped">
        <thead>
          <tr>
            <th onClick={() => requestSort('name')}>
              Name {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
            </th>
            <th onClick={() => requestSort('category')}>
              Category {sortConfig.key === 'category' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
            </th>
            <th onClick={() => requestSort('createdAt')}>
              Release Date {sortConfig.key === 'createdAt' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
            </th>
            {(isAdmin || isProjectManager) && (
              <th>Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map((product) => (
            <tr key={product.id}>
              <td>
                <Link to={`/products/${product.id}`}>{product.name}</Link>
              </td>
              <td>{product.category}</td>
              <td>{product.createdAt}</td>
              {(isAdmin || isProjectManager) && (
                 <td>
                  <Link to={`/admin-dashboard/products/${product.id}`}>Edit</Link>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
