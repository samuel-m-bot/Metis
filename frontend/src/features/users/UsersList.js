import { useGetUsersQuery } from "./usersApiSlice"
import User from './User'
import LoadingSpinner from "../../components/LoadingSpinner"
import { useNavigate } from "react-router-dom"

const UsersList = () => {
    const navigate = useNavigate();
    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery('usersList', {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    const handleCreateNewUser = () => {
        navigate('/admin-dashboard/users/create');
    };

    let content

    if (isLoading) content = <LoadingSpinner />

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {
        const { ids } = users
        const tableContent = ids?.length && ids.map(userId => <User key={userId} userId={userId} />)

        content = (
            <div>
                <button onClick={handleCreateNewUser} className="btn btn-success mb-3">
                    Create New User
                </button>
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Email</th>
                            <th scope="col">Roles</th>
                            <th scope="col">Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableContent}
                    </tbody>
                </table>
            </div>
        );
    }

    return content;
}

export default UsersList;