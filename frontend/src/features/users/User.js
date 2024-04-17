import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import { useGetUsersQuery } from './usersApiSlice';
import { memo } from 'react';

const User = ({ userId }) => {
    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[userId]
        }),
    });

    const navigate = useNavigate();

    if (user) {
        const handleEdit = () => navigate(`/admin-dashboard/users/${userId}`);
        const userRolesString = user.roles.join(', ');

        return (
            <tr>
                <td>{user.email}</td>
                <td>{userRolesString}</td>
                <td>
                    <button className="btn btn-info" onClick={handleEdit}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        );
    } else return null;
}

const memoizedUser = memo(User);
export default memoizedUser;
