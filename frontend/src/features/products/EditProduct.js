import { useParams } from 'react-router-dom';
import EditProductForm from './EditProductForm';
import { useGetProductsQuery } from './productsApiSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

const EditProduct = () => {
    const { id } = useParams();

    const { product } = useGetProductsQuery("productsList", {
        selectFromResult: ({ data }) => ({
            product: data?.entities[id]
        }),
    })
    const content = product ? <EditProductForm product={product} /> : <LoadingSpinner/>;

    return content
}

export default EditProduct;
