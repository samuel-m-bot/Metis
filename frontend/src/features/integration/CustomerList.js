import { useState } from 'react';
import { useFetchSalesforceContactsMutation } from './integrationsApiSlice';
import AssignContactModal from './AssignContactModal';
import useAuth from '../../hooks/useAuth';

const CustomerList = () => {
    const [fetchContacts, { data: contacts, isLoading, isSuccess, error }] = useFetchSalesforceContactsMutation();
    const [selectedContactId, setSelectedContactId] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const { isAdmin, isProjectManager } = useAuth();

    const handleFetchContacts = () => {
        fetchContacts();
    };

    const handleSelectContact = (contactId) => {
        setSelectedContactId(contactId);
        setModalShow(true);
    };

    return (
        <div className="container mt-3">
            <div className="d-grid gap-2">
                <button className="btn btn-primary" onClick={handleFetchContacts} disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Load Salesforce Contacts'}
                </button>
            </div>
            {error && <div className="alert alert-danger mt-2">{error?.data?.message || error.message}</div>}
            {isSuccess && contacts && (
                <ul className="list-group mt-2">
                    {Object.values(contacts.entities).map(contact => (
                        <li key={contact.Id}
                            className={`list-group-item list-group-item-action ${selectedContactId === contact.Id ? 'active' : ''}`}
                            onClick={() => handleSelectContact(contact.Id)}
                            style={{ cursor: 'pointer' }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="mb-1">{contact.FirstName} {contact.LastName}</h5>
                                    <small className="text-muted">{contact.Title || 'No Title'}</small>
                                    <p className="mb-1">Account: {contact.Account?.Name || 'No Account'}</p>
                                    <small className="text-muted">Email: {contact.Email}</small>
                                </div>
                                {(isAdmin || isProjectManager) && (
                                    <button className="btn btn-secondary" onClick={() => handleSelectContact(contact.Id)}>
                                        Add to Project
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <AssignContactModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                contactId={selectedContactId}
            />
        </div>
    );
}

export default CustomerList;