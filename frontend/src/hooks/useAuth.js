import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../features/auth/authSlice"
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isProjectManager = false
    let isAdmin = false
    let status = "User"

    if (token) {
        const decoded = jwtDecode(token)
        const { id, email, firstName, surname, roles } = decoded.UserInfo 

        isProjectManager = roles.includes('Project Manager')
        isAdmin = roles.includes('Admin')

        if (isProjectManager) status = "Project Manager"
        if (isAdmin) status = "Admin"

        return { id, email, firstName, surname, status, isAdmin: isAdmin, isProjectManager: isProjectManager } 
    }

    return { id: '', email: '', firstName: '', surname: '', isAdmin: false, isProjectManager: false }
}
export default useAuth
