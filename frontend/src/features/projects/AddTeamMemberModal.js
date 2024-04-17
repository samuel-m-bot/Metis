import React from 'react';
import Modal from './Modal';

const AddTeamMemberModal = ({ showModal, setShowModal, availableUsers, selectedUser, setSelectedUser, onAddMember }) => {
    return (
        <div>
            {showModal && (
               <Modal onClose={() => setShowModal(false)}>
                    <h4 className="modal-header">Select a User to Add</h4>
                    <select className="modal-select" value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
                        {availableUsers.map((user) => (
                            <option key={user.id} value={user.id}>{user.firstName} {user.surname}- {user.email}</option>
                        ))}
                    </select>
                    <button className="modal-button" onClick={onAddMember}>Add Member</button>
                </Modal>
           
            )}
        </div>
    );
};

export default AddTeamMemberModal;
