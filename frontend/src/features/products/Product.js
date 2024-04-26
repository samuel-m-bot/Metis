import { useParams } from 'react-router-dom';
import { useGetProductByIdQuery } from './productsApiSlice';
import Item from '../items/Item';

const Product = () => {
  const { productId } = useParams();
  const { data: itemData, isLoading, isError, error } = useGetProductByIdQuery(productId, {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  const completedChangeRequests = [
    { id: 'CR001', title: 'Initial Creation', dateCompleted: '2022-01-10', status: 'Completed' },
    { id: 'CR002', title: 'Add Safety Section', dateCompleted: '2022-03-15', status: 'Completed' },
    { id: 'CR003', title: 'Revise Specifications', dateCompleted: '2022-04-20', status: 'Completed' },
  ];

  return (
    <Item 
      itemType="Product" 
      itemData={itemData} 
      completedChangeRequests={completedChangeRequests}
    />
  );
};

export default Product;