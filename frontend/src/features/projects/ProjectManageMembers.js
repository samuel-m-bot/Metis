import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProjectTeamMembersQuery, useAddTeamMemberMutation, useRemoveTeamMemberMutation } from './projectsApiSlice';
import { useGetUsersQuery } from '../users/usersApiSlice';
import AddTeamMemberModal from './AddTeamMemberModal';

const ProjectManageMembers = () => {
    const { id: projectId } = useParams();
    const navigate = useNavigate();
    const { data: projectDetails, isLoading: isLoadingProjectDetails, isError, error } = useGetProjectTeamMembersQuery(projectId);
    const { data: allUsers, isLoading: isLoadingUsers } = useGetUsersQuery();
    const [addTeamMember, { isLoading: isUpdating }] = useAddTeamMemberMutation();
    const [removeTeamMember, { isLoading: isRemoving, isSuccess, error: removeError }] = useRemoveTeamMemberMutation();
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);

    useEffect(() => {
        if (allUsers && projectDetails) {
            const currentMemberIds = new Set(projectDetails.teamMembers.map(member => member.userId));
            const filteredUsers = Object.values(allUsers.entities).filter(user => !currentMemberIds.has(user.id));
            setAvailableUsers(filteredUsers);
        }
    }, [allUsers, projectDetails]);

    const handleRemoveMember = async (userId) => {
        try {
            const result = await removeTeamMember({ projectId, teamMemberId: userId }).unwrap();
            console.log("Member removed successfully:", result);
        } catch (err) {
            console.error("Failed to remove team member:", err);
        }
    };

    const handleAddMember = async () => {
        if (selectedUser && selectedRole && selectedPermissions.length > 0) {
            try {
                await addTeamMember({ projectId, userId: selectedUser, role: selectedRole, permissions: selectedPermissions }).unwrap();
                setShowModal(false);
            } catch (error) {
                console.error('Failed to add the team member:', error);
            }
        }
    };

    if (isLoadingProjectDetails || isLoadingUsers || isUpdating) return <p>Loading...</p>;
    if (isError) return <p>Error: {error?.data.message}</p>;
    if (!projectDetails?.teamMembers.length) {
        return (
            <div className="container mt-3">
                <p className="text-muted">No team members...</p>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add Team Member</button>
                <AddTeamMemberModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    availableUsers={availableUsers}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    selectedRole={selectedRole}
                    setSelectedRole={setSelectedRole}
                    selectedPermissions={selectedPermissions}
                    setSelectedPermissions={setSelectedPermissions}
                    onAddMember={handleAddMember}
                />
            </div>
        );
    }

    return (
        <div className="container mt-3">
            <h2>Manage Team Members for {projectDetails.projectName}</h2>
            <ul className="list-group">
                {projectDetails.teamMembers.map((member) => (
                    <li key={member.userId} className="list-group-item d-flex justify-content-between align-items-center">
                        {member.userId.firstName} {member.userId.lastName} - {member.role}
                        <button className="btn btn-danger" onClick={() => handleRemoveMember(member.userId)} disabled={isRemoving}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
            <button className="btn btn-primary mt-3" onClick={() => setShowModal(true)}>Add Team Member</button>
            <AddTeamMemberModal
                showModal={showModal}
                setShowModal={setShowModal}
                availableUsers={availableUsers}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
                selectedPermissions={selectedPermissions}
                setSelectedPermissions={setSelectedPermissions}
                onAddMember={handleAddMember}
            />
        </div>
    );
};

export default ProjectManageMembers;
