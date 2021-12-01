import InputField from '../form/InputField'
import { Link } from 'react-router-dom'

const Login = () => {
    return (
        <div className="card shadow p-3 m-5">
            <h1 className="display-1 font-weight-bold text-center mt-5">Login</h1>
                <form className="px-5 my-5">
                    <InputField name="Email" placeholder="Enter email"/>
                    <br />
                    <InputField name="Password" placeholder="Enter password" />
                    <br />
                    <div className="d-flex justify-content-center">
                        <Link to='/dashboard'>Login</Link>
                    </div>
               </form>
            </div>
    )
}

export default Login
