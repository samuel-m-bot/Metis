import React from 'react';
import ProductList from './ProductList';
import { useGetProductsQuery } from './productsApiSlice';

const ProductListPage = ({ projectId }) => {
    const {
        data: productsData,
        isLoading,
        isError,
        error
    } = useGetProductsQuery('productList', {
        pollingInterval: 120000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    const products = productsData ? productsData?.ids.map(id => productsData.entities[id]) : [];

    return (
        <div>
            <div className='row'>
                <h3>All products</h3>
                <ProductList 
                    products={products} 
                    isLoading={isLoading} 
                    isError={isError} 
                    error={error}
                />
            </div>
        </div>
    );
};

export default ProductListPage;