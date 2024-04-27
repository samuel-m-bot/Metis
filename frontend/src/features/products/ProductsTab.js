import React from 'react';
import ProductList from './ProductList';
import { useGetProductsByProjectIdQuery } from './productsApiSlice';

const ProductsTab = ({ projectId }) => {
    const {
        data: productsData,
        isLoading,
        isError,
        error
    } = useGetProductsByProjectIdQuery(projectId);

    const products = productsData ? productsData?.ids.map(id => productsData.entities[id]) : [];

    // Filter products based on their status
    const ongoingProducts = products.filter(product => product.status !== 'Published');
    const completedProducts = products.filter(product => product.status === 'Published');

    return (
        <div className="container mt-3">
            <div className='row mb-4'>
                <div className="col-12">
                    <h3>Ongoing Products</h3>
                    <ProductList 
                        products={ongoingProducts} 
                        isLoading={isLoading} 
                        isError={isError} 
                        error={error}
                    />
                </div>
            </div>
            <div className='row'>
                <div className="col-12">
                    <h3>Completed Products</h3>
                    <ProductList 
                        products={completedProducts} 
                        isLoading={isLoading} 
                        isError={isError} 
                        error={error}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductsTab;