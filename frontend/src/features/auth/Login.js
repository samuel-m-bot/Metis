import { useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const Login = () => {
    const userRef = useRef()
    const errRef = useRef()
    const [XID, setXID] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')

    const navigate = useNavigate()

    //const [login, {isLoading} ] = useLoginMutation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        navigate('/home') 
    }

    const handleIDInput = (e) => setXID(e.target.value)
    const handlePwdInput = (e) => setPassword(e.target.value)
    // const handleToggle = (e) => setPersist(prev => !prev)

    const errClass = errMsg ? "errmsg" : "offscreen"

    const content = (
        <>
        <div className='LoginContent'>
            <div className='LoginContainer'>
            <div className="welcome_content_logo">
                logo placeholder
            </div>
                <h2>Sign In</h2>
                <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>
                <p>Please sign in or register in order to continue</p>
                <form className="viewerLoginForm" onSubmit={handleSubmit}>
                        <input
                            className="viewerLoginInput"
                            type="text"
                            id="ID"
                            ref={userRef}
                            value={XID}
                            onChange={handleIDInput}
                            autoComplete="off"
                            placeholder='ID'
                            required
                        />

                        <input
                            className="viewerLoginInput"
                            type="password"
                            id="password"
                            onChange={handlePwdInput}
                            value={password}
                            placeholder='Password'
                            required
                        />
                        <div className="ForgotPassContainer">
                            <Link  className='ForgotPass' to="/employeeLogin">Forgot password?</Link>
                        </div>
                        <button className="viewerLoginSubmitButton"><b>Login</b></button>

                    </form>
                    <div className='signUpContainer'>
                        <p>Don’t have an account? <Link  className='signUp' to="/signUp"><b>Sign up</b></Link></p>
                    </div>
            </div>
        </div>
        </>
    )
  return content
}

export default Login