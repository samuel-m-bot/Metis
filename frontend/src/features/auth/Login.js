import { useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLoginMutation } from './authApiSlice'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import usePersist from '../../hooks/usePersist'
import metisLogo from '../../img/metis-logo-no-background.png' // Ensure correct import for image

const Login = () => {
    const userRef = useRef()
    const errRef = useRef()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [persist, setPersist] = usePersist()

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [login, { isLoading }] = useLoginMutation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { accessToken, role } = await login({ email, password }).unwrap()
            dispatch(setCredentials({ accessToken, role }))
            setEmail('')
            setPassword('')
            navigate('/home')
        } catch (err) {
            if (!err.status) {
                setErrMsg('No server response')
            } else if (err.status === 400) {
                setErrMsg('Missing email or Password')
            } else if (err.status === 401) {
                setErrMsg('Unauthorized')
            } else {
                setErrMsg(err.message || err.data?.message)
            }
            errRef.current.focus()
        }
    }

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <div className="text-center">
                                <img src={metisLogo} alt="Metis Logo" className="mb-4 img-fluid" style={{ maxWidth: '150px' }} />
                                <h2 className="card-title">Sign In</h2>
                                <p ref={errRef} className={errMsg ? "alert alert-danger" : "offscreen"} aria-live="assertive">{errMsg}</p>
                                <p>Please sign in or register in order to continue.</p>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="email"
                                        ref={userRef}
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        autoComplete="off"
                                        placeholder='Email'
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        className="form-control"
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder='Password'
                                        required
                                    />
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <button type="submit" className="btn btn-primary" disabled={isLoading}><b>Login</b></button>
                                </div>
                                <div className="form-check mb-3">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="persist"
                                        onChange={() => setPersist(prev => !prev)}
                                        checked={persist}
                                    />
                                    <label className="form-check-label" htmlFor="persist">Stay logged in?</label>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
