import { useNavigate } from 'react-router-dom';
import { useGetChangeRequestByIdQuery, useLazyGetChangeRequestByIdQuery } from '../features/changes/changeRequestsApiSlice';
import { Button } from 'react-bootstrap';
import { useLazyGetDocumentByIdQuery } from '../features/documents/documentsApiSlice';
import { useLazyGetDesignByIdQuery } from '../features/designs/designsApiSlice';
import { useLazyGetProductByIdQuery } from '../features/products/productsApiSlice';
import { useCompleteTaskAndSetupReviewMutation } from '../features/Tasks/tasksApiSlice';

const UpdateTaskTab = ({ task }) => {
  const navigate = useNavigate();
  const { data: changeRequest, isLoading: isCRLoading, isError: isCRError } = useGetChangeRequestByIdQuery(task?.assignedChangeRequest);
  const [getDocument] = useLazyGetDocumentByIdQuery();
  const [getDesign] = useLazyGetDesignByIdQuery();
  const [getProduct] = useLazyGetProductByIdQuery();
  const [getChangeRequest] = useLazyGetChangeRequestByIdQuery();
  const [completeTaskAndSetupReview, { isLoading: isTaskLoading }] = useCompleteTaskAndSetupReviewMutation();

  const handleCompleteUpdate = async () => {
    try {
        const reviewSetupData = {
            projectId: task.projectId,
            task: task,
            createdItemId: changeRequest.id 
        };
        await completeTaskAndSetupReview(reviewSetupData).unwrap();
        alert("Update completed and review process initiated.");
    } catch (error) {
        alert("Failed to complete the update: " + error.message);
    }
};

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

      <div className="instructions card mt-3">
        <div className="card-header">Update Steps</div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            Follow the links to main and related items.
          </li>
          <li className="list-group-item">
            In the action dropdown, select 'Check Out' to start editing.
          </li>
          <li className="list-group-item">
            Download and make necessary changes to the item.
          </li>
          <li className="list-group-item">
            Return to the item page, select 'Check In' from the dropdown, and update any necessary fields.
          </li>
          <li className="list-group-item">
            Go back to this task tab and mark the update as complete.
          </li>
        </ul>
      </div>
      <Button variant="primary" onClick={handleCompleteUpdate}>
          Complete Update
      </Button>
    </div>

  );
};

export default UpdateTaskTab;
