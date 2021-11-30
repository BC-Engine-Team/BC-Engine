import InputField from '../form/InputField'
import { Link } from 'react-router-dom'

const Login = () => {
    return (
        <div className="card shadow p-3 m-5">
            <h1 className="display-1 font-weight-bold text-center mt-5">Login</h1>
                <form>
                    <InputField name="Email" placeholder="Enter email"/>

                    <InputField name="Password" placeholder="Enter password" />
                    <div className="w-25 d-flex justify-content-center">
                        <Link to='/dashboard' className="submitButton btn btn-light px-4 shadow-sm border mb-5" name="submitBTN">Login</Link>
                    </div>
               </form>
            </div>
    )
}

export default Login
