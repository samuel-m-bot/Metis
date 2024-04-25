import { useNavigate } from "react-router-dom";
const ChangeRequestDetails = ({ changeRequestData }) => {
    const navigate = useNavigate();
    // Handler for navigation based on item type
    const handleNavigateToItem = () => {
        let path;
        switch (changeRequestData.onModel) {
            case 'Document':
                path = `/documents/${changeRequestData.mainItem}`;
                break;
            case 'Design':
                path = `/designs/${changeRequestData.mainItem}`;
                break;
            case 'Product':
                path = `/products/${changeRequestData.mainItem}`;
                break;
            case 'ChangeRequest':
                path = `/change-requests/${changeRequestData.mainItem}`;
                break;
            default:
                console.log("Unsupported item type for navigation");
                return;
        }
        navigate(path);
    };
    return (
        <div className="change-request-details">
              <div className="general-information">
                  <h3>General Information</h3>
                  <p><strong>ID:</strong> {changeRequestData._id}</p>
                  <p><strong>Title:</strong> {changeRequestData.title}</p>
                  <p><strong>Main Item Affected:</strong> 
                        <a onClick={handleNavigateToItem} 
                        className="text-primary text-decoration-none" 
                        style={{ cursor: 'pointer' }}>
                        {changeRequestData.onModel} (ID: {changeRequestData.mainItem})
                        </a>
                    </p>
                  <p><strong>Status:</strong> {changeRequestData.status}</p>
                  <p><strong>Request Date:</strong> {new Date(changeRequestData.dateRequested).toLocaleDateString()}</p>
                  <p><strong>Requested By:</strong> {changeRequestData.requestedBy.firstName} {changeRequestData.requestedBy.surname}</p>
                  <p><strong>Assigned To:</strong> {changeRequestData.assignedTo ? `${changeRequestData.assignedTo.firstName} ${changeRequestData.assignedTo.surname}` : 'Unassigned'}</p>
                  <p><strong>Priority:</strong> {changeRequestData.priority}</p>
                  <p><strong>Estimated Completion Date:</strong> {new Date(changeRequestData.estimatedCompletionDate).toLocaleDateString()}</p>
              </div>

              <div className="rationale">
                  <h3>Rationale for Change</h3>
                  <p>{changeRequestData.description}</p>
              </div>

              <div className="impact-analysis">
                  <h3>Impact Analysis</h3>
                  <p><strong>Risk Assessment:</strong> {changeRequestData.riskAssessment}</p>
                  <p><strong>Impact Level:</strong> {changeRequestData.impactLevel}</p>
              </div>

              <div className="change-type">
                  <h3>Change Type</h3>
                  <p>{changeRequestData.changeType}</p>
              </div>

              <div className="approvals">
                  <h3>Approvals</h3>
                  {/* Dynamic rendering based on approval status, dummy values used here */}
                  <p><strong>Design Lead:</strong> Pending</p>
                  <p><strong>Production Manager:</strong> Approved</p>
                  <p><strong>Finance Department:</strong> Reviewing</p>
              </div>
          </div>
    );
};

export default ChangeRequestDetails;
