import { useState } from 'react'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")

    const handleSubmit = (event) => {
       
    }

    return (
        <div>
            <form>
                <input 
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={ email }
                    onChange={(e) => setEmail(e.target.value)} />
                
                <input 
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={ password }
                    onChange={(e) => setPassword(e.target.value)} />

                <input 
                    type="confirmPassword"
                    name="password"
                    placeholder="Confirm password"
                    value={ passwordConfirmation }
                    onChange={(e) => setPasswordConfirmation(e.target.value)} />

                <input 
                    type="submit"
                    name="submitBTN" />
            </form>
        </div>
    )
}

export default Login
