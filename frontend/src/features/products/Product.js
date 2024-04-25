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

  const changeRequests = [
    {
      id: 'CR001',
      title: 'Update Project Scope',
      status: 'Completed',
      reviews: [
        {
          reviewer: 'Alice Johnson',
          role: 'Project Manager',
          date: '2021-04-20',
          feedback: 'Approved with minor revisions needed.',
          decision: 'Approved',
        },
        {
          reviewer: 'Bob Smith',
          role: 'Quality Assurance',
          date: '2021-04-22',
          feedback: 'All checks passed. No further changes required.',
          decision: 'Approved',
        },
      ],
    },
    {
      id: 'CR002',
      title: 'Update Project requirements',
      status: 'Completed',
      reviews: [
        {
          reviewer: 'Gojo Sataru',
          role: 'The strongest',
          date: '2021-04-20',
          feedback: 'Approved with minor revisions needed.',
          decision: 'Approved',
        },
        {
          reviewer: 'Roymen Sukuna',
          role: 'The Fallen',
          date: '2021-04-22',
          feedback: 'All checks passed. No further changes required.',
          decision: 'Approved',
        },
      ],
    },
  ];

  return (
    <Item 
      taskType="Product" 
      itemData={itemData} 
      changeRequests={changeRequests} 
      completedChangeRequests={completedChangeRequests}
    />
  );
};

export default Product;