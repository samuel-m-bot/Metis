import React from 'react';
import ProductList from './ProductList';
import { useGetProductsByProjectIdQuery } from './productsApiSlice';

const ProductsTab = ({ projectId }) => {
    const {
        data: ongoingProducts,
        isLoading: isLoadingOngoing,
        isError: isErrorOngoing,
        error: errorOngoing
    } = useGetProductsByProjectIdQuery( projectId, {status: 'Ongoing' });

    const {
        data: completedProducts,
        isLoading: isLoadingCompleted,
        isError: isErrorCompleted,
        error: errorCompleted
    } = useGetProductsByProjectIdQuery( projectId, {status: 'Completed' });

    return (
        <div>
            <div className='row'>
                <h3>Ongoing Products</h3>
                {console.log(ongoingProducts)}
                <ProductList 
                    products={ongoingProducts ? ongoingProducts?.ids.map(id => ongoingProducts.entities[id]) : []} 
                    isLoading={isLoadingOngoing} 
                    isError={isErrorOngoing} 
                    error={errorOngoing}
                />
            </div>
            <div className='row'>
                <h3>Completed Products</h3>
                <ProductList 
                    products={completedProducts ? completedProducts?.ids.map(id => completedProducts.entities[id]) : []} 
                    isLoading={isLoadingCompleted} 
                    isError={isErrorCompleted} 
                    error={errorCompleted}
                />
            </div>
        </div>
    );
};

export default ProductsTab;
