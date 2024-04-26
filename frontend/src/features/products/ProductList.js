import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../../components/LoadingSpinner';

const ProductList = ({ products, isLoading, isError, error }) => {
  const [sortedProducts, setSortedProducts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const { isAdmin, isProjectManager, email } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(products)
    if (products && products.length > 0) {
      let sorted = [...products];
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

  if (isLoading) return <LoadingSpinner />

  if (isError) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error Loading Products</h4>
        <p>{error?.data?.message || "An unexpected error occurred while fetching products."}</p>
        {(isAdmin || isProjectManager) && (
          <div className="mt-3">
            <button 
              onClick={() => isAdmin ? navigate('/admin-dashboard/products/create') : navigate('/products/create')}
              className="btn btn-primary"
            >
              Try Creating a Product
            </button>
            <p className="mt-2">If the problem persists, please contact support.</p>
          </div>
        )}
      </div>
    );
  }
  

  const handleProductNavigate = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleProjectNavigate = (projectId) => {
    navigate(`/projects/${projectId}`);
  };
  
  return (
    <div className="container mt-5">
      {/* <h2 className="mb-4">Product List</h2> */}
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
            <th onClick={() => requestSort('projectId')}>
              Project {sortConfig.key === 'projectId' ? (sortConfig.direction === 'ascending' ? '▼' : '▲') : ''}
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
              <td onClick={() => handleProductNavigate(product.id)} style={{ cursor: 'pointer' }}>
                {product.name}
              </td>
              <td onClick={() => handleProjectNavigate(product.projectId._id)} style={{ cursor: 'pointer' }}>
                {product.projectId.name}
              </td>
              <td>{product.category}</td>
              <td>{new Date(product.createdAt).toLocaleDateString()}</td>
              {(isAdmin || isProjectManager) && (
                 <td>
                  <Link to={`/admin-dashboard/products/${product.id}/edit`}>Edit</Link>
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
