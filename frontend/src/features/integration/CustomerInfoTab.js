import { useGetSalesforceCustomerQuery } from '../projects/projectsApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const CustomerInfoTab = ({ projectId }) => {
  const { data: customer, isFetching, error } = useGetSalesforceCustomerQuery(projectId);

  if (isFetching) return <div className="text-center"><strong>Loading customer information...</strong></div>;
  if (error) return <div className="alert alert-danger">Error fetching customer information: {error.message}</div>;

  return (
    <div className="customer-info container">
      {customer ? (
        <div>
          <div className="d-flex align-items-center mb-3">
            <FontAwesomeIcon icon={faUserCircle} size="3x" className="me-2 text-primary"/>
            <h3>Customer Details</h3>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{customer.FirstName} {customer.LastName}</h5>
              <p className="card-text"><strong>Email:</strong> {customer.Email}</p>
              <p className="card-text"><strong>Phone:</strong> {customer.Account.Phone}</p>
              <p className="card-text"><strong>Account Name:</strong> {customer.Account.Name}</p>
              <p className="card-text"><strong>Description:</strong> {customer.Account.Description}</p>
              <h6 className="mt-4">Billing Address</h6>
              <p className="card-text">
                {customer.Account.BillingStreet}<br />
                {customer.Account.BillingCity}, {customer.Account.BillingState} {customer.Account.BillingPostalCode}<br />
                {customer.Account.BillingCountry}
              </p>
              <h6 className="mt-4">Shipping Address</h6>
              <p className="card-text">
                {customer.Account.ShippingStreet}<br />
                {customer.Account.ShippingCity}, {customer.Account.ShippingState} {customer.Account.ShippingPostalCode}<br />
                {customer.Account.ShippingCountry}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning">No customer information available.</div>
      )}
    </div>
  );
}

export default CustomerInfoTab;
