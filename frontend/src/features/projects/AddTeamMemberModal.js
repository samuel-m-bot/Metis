import Modal from './Modal';

const AddTeamMemberModal = ({
    showModal,
    setShowModal,
    availableUsers,
    selectedUser,
    setSelectedUser,
    selectedRole,
    setSelectedRole,
    selectedPermissions,
    setSelectedPermissions,
    onAddMember
}) => {
    // Define available roles and permissions
    const roles = ['Admin', 'Engineer', 'Quality Control', 'Designer', 'Analyst', 'Observer'];
    const permissions = ['Read', 'Write', 'Delete'];

    return (
        <div>
            {showModal && (
               <Modal onClose={() => setShowModal(false)}>
                    <h4 className="modal-header">Select a User to Add</h4>
                    <select className="modal-select" value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
                        <option value="">Select User</option>
                        {availableUsers.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.firstName} {user.surname} - {user.email} ({user.roles.join(', ')})
                            </option>
                        ))}
                    </select>
                    
                    <h4 className="modal-header">Select Role</h4>
                    <select className="modal-select" value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>

                    <h4 className="modal-header">Select Permissions</h4>
                    {permissions.map((perm) => (
                        <div key={perm} className="checkbox-group">
                            <input
                                type="checkbox"
                                id={perm}
                                name="permissions"
                                value={perm}
                                checked={selectedPermissions.includes(perm)}
                                onChange={() => {
                                    if (selectedPermissions.includes(perm)) {
                                        setSelectedPermissions(selectedPermissions.filter(p => p !== perm));
                                    } else {
                                        setSelectedPermissions([...selectedPermissions, perm]);
                                    }
                                }}
                            />
                            <label htmlFor={perm}>{perm}</label>
                        </div>
                    ))}

                    <button className="modal-button" onClick={onAddMember} disabled={!selectedUser || !selectedRole || selectedPermissions.length === 0}>Add Member</button>
                </Modal>
            )}
        </div>
    );
};

export default AddTeamMemberModal;
