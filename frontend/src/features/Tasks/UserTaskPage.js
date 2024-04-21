import useAuth from "../../hooks/useAuth"
import UserTasks from "./UserTasks"

const UserTaskPage = () => {
    const {id} = useAuth()
  return (
    <div className="container">
        {console.log(id)}
        {id && (
            <UserTasks userId={id}/>
        )}
    </div>
  )
}

export default UserTaskPage