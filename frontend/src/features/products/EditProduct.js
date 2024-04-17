import { useParams } from 'react-router-dom';
import EditProductForm from './EditProductForm';
import { useSelector } from 'react-redux';
import { selectProductById } from './productsApiSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

const EditProduct = () => {
    const { id } = useParams();
    const product = useSelector(state => selectProductById(state, id));

    const content = product ? <EditProductForm product={product} /> : <LoadingSpinner/>;

    return content;
}

export default EditProduct;
