import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const Signup = (props) => {

    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" })
    let navigate = useNavigate()
    const { name, email, password } = credentials;

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (credentials.password === credentials.cpassword) {
            const response = await fetch("http://localhost:5000/api/auth/createuser", {

                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            })
            const json = await response.json()
            console.log(json)

            if (json.success) {
                //save the auth-token & redirect

                localStorage.setItem('token', json.authtoken);
                navigate('/')
                props.showAlert("Account created successfully ", "success")
            }
            else {
                props.showAlert("Invalid Credentials", "danger")
            }
        }
        else {
            props.showAlert("Confirm Password does not match", "danger")
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (
        <div className='container'>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">name</label>
                    <input type="text" className="form-control" id="name" name="name" value={credentials.name} onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" value={credentials.email} onChange={onChange} aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" onChange={onChange} value={credentials.password} name="password" minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" onChange={onChange} value={credentials.cpassword} name="cpassword" minLength={5} required />
                </div>

                <button disabled={credentials.email.length <= 0 || credentials.password.length <= 0} type="submit" className="btn btn-primary"  >Submit</button>
            </form>
        </div>

    )
}
