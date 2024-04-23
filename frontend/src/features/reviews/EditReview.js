import { useParams } from 'react-router-dom';
import EditReviewForm from './EditReviewForm';
import { useGetReviewsQuery } from './reviewsApiSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

const EditReview = () => {
    const { id } = useParams();

    const { review } = useGetReviewsQuery("reviewList", {
        selectFromResult: ({ data }) => ({
            review: data?.entities[id]
        }),
    })
    const content = review ? <EditReviewForm review={review} /> : <LoadingSpinner/>;

    return content
}

export default EditReview;