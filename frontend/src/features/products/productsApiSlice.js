import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const productsAdapter = createEntityAdapter({})

const initialState = productsAdapter.getInitialState()

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getProducts: builder.query({
            query: () => ({
                url: '/products',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedProducts = responseData.map(product => {
                    product.id = product._id
                    return product
                });
                return productsAdapter.setAll(initialState, loadedProducts)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Product', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Product', id }))
                    ]
                } else return [{ type: 'Product', id: 'LIST' }]
            }
        }),
        getProductById: builder.query({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'GET'
            }),
            transformResponse: responseData => {
                const product = { ...responseData, id: responseData._id };
                return product;
            },
            providesTags: (result, error, arg) => [{ type: 'Product', id: result.id }]
        }),
        addNewProduct: builder.mutation({
            query: initialProductData => ({
                url: '/products',
                method: 'POST',
                body: {
                    ...initialProductData,
                }
            }),
            invalidatesTags: [
                { type: 'Product', id: "LIST" }
            ]
        }),
        updateProduct: builder.mutation({
            query: productData => ({
                url: `/products/${productData.id}`,
                method: 'PATCH',
                body: productData
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Product', id: arg.id },
                { type: 'Product', id: "LIST" }
            ]
        }),        
        deleteProduct: builder.mutation({
            query: ({ id }) => ({
                url: `/products/${id}`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Product', id: arg.id }
            ]
        }),
        getProductsByProjectId: builder.query({
            query: projectId => ({
                url: `/products/project/${projectId}`,
                method: 'GET'
            }),
            transformResponse: responseData => {
                const loadedProducts = responseData.map(product => {
                    product.id = product._id;
                    return product;
                });
                return productsAdapter.setAll(initialState, loadedProducts);
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Product', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Product', id }))
                    ]
                } else return [{ type: 'Product', id: 'LIST' }];
            }
        }),
        fetchProductPerformanceReport: builder.query({
            query: () => ({
                url: `/products/analytics/product-performance`,
                method: 'GET'
            }),
            transformResponse: responseData => {
                const { factMap } = responseData.data;
                return {
                    salesPerformance: factMap["T!T"].aggregates[0].value,
                    customerFeedbackSummary: factMap["T!T"].rows.map(row => ({
                        productId: row.dataCells[0].value,
                        productName: row.dataCells[1].label,
                        customerFeedback: row.dataCells[2].label,
                        productDescription: row.dataCells[3].label,
                        lifecycleStage: row.dataCells[4].label,
                        salesAmount: parseFloat(row.dataCells[5].label.replace(/,/g, ''))
                    }))
                };
            },            
            providesTags: ['Report']
        }),
    }),
})

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useLazyGetProductByIdQuery,
    useAddNewProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useLazyGetProductsQuery,
    useGetProductsByProjectIdQuery,
    useFetchProductPerformanceReportQuery
} = productsApiSlice

// returns the query result object
export const selectProductsResult = productsApiSlice.endpoints.getProducts.select()

// creates memoized selector
const selectProductsData = createSelector(
    selectProductsResult,
    productsResult => productsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllProducts,
    selectById: selectProductById,
    selectIds: selectProductIds
    // Pass in a selector that returns the products slice of state
} = productsAdapter.getSelectors(state => selectProductsData(state) ?? initialState)