import { useState, useEffect } from "react"
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/roles"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex 
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/; 

const EditUserForm = ({ user }) => {

    const [updateUser] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();
    const navigate = useNavigate();

    const [email, setEmail] = useState(user.email);
    const [validEmail, setValidEmail] = useState(false);
    const [firstName, setFirstName] = useState(user.firstName);
    const [surname, setSurname] = useState(user.surname);
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [roles, setRoles] = useState(user.roles);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        setValidPassword(password === '' || PWD_REGEX.test(password));
    }, [password]);

    useEffect(() => {
        if (updateUser.isSuccess || deleteUser.isSuccess) {
            navigate('/admin-dashboard/users');
        }
    }, [updateUser.isSuccess, deleteUser.isSuccess, navigate]);

    const onSaveUserClicked = async () => {
        const updatedUserData = {
            id: user.id,
            email: email,
            firstName: firstName,
            surname: surname,
            roles: roles
        };
        if (password) updatedUserData.password = password; // Only add password if it's provided
        await updateUser(updatedUserData);
    };
    

    const onDeleteUserClicked = async () => {
        await deleteUser({ id: user.id });
    };

    const canSave = [validEmail, firstName, surname, roles.length, validPassword].every(Boolean);

    return (
        <div className="container mt-3">
        <h2>Edit User</h2>
        <form>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email:</label>
                <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="firstName" className="form-label">First Name:</label>
                <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="surname" className="form-label">Surname:</label>
                <input
                    type="text"
                    className="form-control"
                    id="surname"
                    value={surname}
                    onChange={e => setSurname(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="roles" className="form-label">Roles:</label>
                <select
                    multiple
                    className="form-select"
                    id="roles"
                    value={roles}
                    onChange={e => setRoles([...e.target.selectedOptions].map(o => o.value))}
                >
                    {Object.values(ROLES).map(role => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
            </div>
            <div className="d-flex justify-content-start gap-2">
                <button type="button" className="btn btn-primary" onClick={onSaveUserClicked} disabled={!canSave}>
                    <FontAwesomeIcon icon={faSave} /> Save
                </button>
                <button type="button" className="btn btn-danger" onClick={onDeleteUserClicked}>
                    <FontAwesomeIcon icon={faTrashCan} /> Delete
                </button>
            </div>
        </form>
    </div>
    );
}

export default EditUserForm;