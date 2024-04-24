import { useNavigate } from 'react-router-dom';
import { useGetChangeRequestByIdQuery, useLazyGetChangeRequestByIdQuery } from '../features/changes/changeRequestsApiSlice';
import { useLazyGetDocumentByIdQuery } from '../features/documents/documentsApiSlice';
import { useLazyGetDesignByIdQuery } from '../features/designs/designsApiSlice';
import { useLazyGetProductByIdQuery } from '../features/products/productsApiSlice';

const UpdateTaskTab = ({ task }) => {
  const navigate = useNavigate();
  const { data: changeRequest, isLoading: isCRLoading, isError: isCRError } = useGetChangeRequestByIdQuery(task.assignedChangeRequest);
  const [getDocument] = useLazyGetDocumentByIdQuery();
  const [getDesign] = useLazyGetDesignByIdQuery();
  const [getProduct] = useLazyGetProductByIdQuery();
  const [getChangeRequest] = useLazyGetChangeRequestByIdQuery();

  const handleNavigateToItem = async (itemId, itemType) => {
    let itemData;
    try {
      switch (itemType) {
        case 'Document':
          itemData = await getDocument(itemId).unwrap();
          navigate(`/documents/${itemId}`, { state: { itemData } });
          break;
        case 'Design':
          itemData = await getDesign(itemId).unwrap();
          navigate(`/designs/${itemId}`, { state: { itemData } });
          break;
        case 'Product':
          itemData = await getProduct(itemId).unwrap();
          navigate(`/products/${itemId}`, { state: { itemData } });
          break;
        case 'ChangeRequest':
          itemData = await getChangeRequest(itemId).unwrap();
          navigate(`/change-requests/${itemId}`, { state: { itemData } });
          break;
        default:
          console.log("Unsupported item type for update task:", itemType);
      }
    } catch (error) {
      console.error("Failed to navigate:", error);
    }
  };

  if (isCRLoading) return <div>Loading change request details...</div>;
  if (isCRError) return <div>Error loading change request details</div>;


  return (
    <div className="container mt-3">
      <h3>Update Task Details</h3>
      <div className="card mb-3">
        <div className="card-header">Task Information</div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item"><strong>Task ID:</strong> {task._id}</li>
          <li className="list-group-item">
            <strong>Main Item to Update:</strong> 
            <a onClick={() => handleNavigateToItem(changeRequest.mainItem, changeRequest.onModel)} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
              {changeRequest.mainItem}
            </a>
          </li>
          <li className="list-group-item"><strong>Description:</strong> {task.description}</li>
          <li className="list-group-item"><strong>Due By:</strong> {new Date(task.dueDate).toLocaleDateString()}</li>
        </ul>
      </div>

      <div className="card">
        <div className="card-header">Related Items</div>
        <ul className="list-group list-group-flush">
          {changeRequest.relatedDocuments?.map(doc => (
            <li key={doc} className="list-group-item">
              <strong>Document:</strong> <a onClick={() => handleNavigateToItem(doc, 'Document')} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>{doc}</a>
            </li>
          ))}
          {changeRequest.relatedDesigns?.map(design => (
            <li key={design} className="list-group-item">
              <strong>Design:</strong> <a onClick={() => handleNavigateToItem(design, 'Design')} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>{design}</a>
            </li>
          ))}
          {changeRequest.relatedProducts?.map(product => (
            <li key={product} className="list-group-item">
              <strong>Product:</strong> <a onClick={() => handleNavigateToItem(product, 'Product')} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>{product}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UpdateTaskTab;
