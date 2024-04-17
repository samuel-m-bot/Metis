import { useState, useEffect } from "react";
import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for validating email
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/; // Regex for validating password

const NewUserForm = () => {

    const [addNewUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewUserMutation();

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
    }, [password]);

    useEffect(() => {
        if (isSuccess) {
            setEmail('');
            setFirstName('');
            setSurname('');
            setPassword('');
            setRoles([]);
            navigate('/admin-dashboard/users');
        }
    }, [isSuccess, navigate]);

    const onSaveUserClicked = async (e) => {
        e.preventDefault();
        if (canSave) {
            await addNewUser({ email, firstName, surname, password, roles });
        }
    };

    const canSave = [validEmail, firstName, surname, roles.length, validPassword].every(Boolean) && !isLoading;

    return (
        <div className="container mt-3">
            <h2>Create New User</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
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
                        required
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
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input
                        type="password"
                        className={`form-control ${validPassword ? '' : 'is-invalid'}`}
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <div className="invalid-feedback">
                        Password must be 4-12 characters long and include special characters (!@#$%).
                    </div>
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
                <button type="button" className="btn btn-primary" onClick={onSaveUserClicked} disabled={!canSave}>
                    <FontAwesomeIcon icon={faSave} /> Create
                </button>
            </form>
        </div>
    );
}

export default NewUserForm;