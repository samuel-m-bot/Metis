import { useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLoginMutation } from './authApiSlice'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import usePersist from '../../hooks/usePersist'

const Login = () => {
    const userRef = useRef()
    const errRef = useRef()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [persist, setPersist] = usePersist()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [login, {isLoading} ] = useLoginMutation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const {accessToken, role} = await login({email, password}).unwrap()
            console.log(role)
            dispatch(setCredentials({ accessToken, role}))
            setEmail('')
            setPassword('')
            navigate('/home');
        } catch (err){
            if(!errMsg.status) {
                setErrMsg('No server response')
            }else if(err.status === 400) {
                setErrMsg('Missing email or Password')
            }else if(err.status === 401){
                setErrMsg('Unauthorized')
            }else{
                setErrMsg(err.message || err.data?.message)
            }
            errRef.current.focus()
        }
    }

    const handleIDInput = (e) => setEmail(e.target.value)
    const handlePwdInput = (e) => setPassword(e.target.value)
    const handleToggle = (e) => setPersist(prev => !prev)

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
                            id="email"
                            ref={userRef}
                            value={email}
                            onChange={handleIDInput}
                            autoComplete="off"
                            placeholder='Email'
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

                        <label htmlFor="persist" className="userLoginPersistLabel">
                            <input
                                type="checkbox"
                                className="form__checkbox"
                                id="persist"
                                onChange={handleToggle}
                                checked={persist}
                            />
                            Stay logged in?
                        </label>
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