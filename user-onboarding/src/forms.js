import axios from "axios";
import React, {useState, useEffect} from "react"; 
import * as yup from 'yup'; 
import "./App"; 

const schema = yup.object().shape({
    name: yup.string().required('name is required'), 
    email: yup.string().required('Please enter email'), 
    password: yup.string().required('Please enter password').min(6, "password needs to be 6 chars long"),
    agree: yup.boolean().oneOf([true], 'you must agree to terms')
})

export default function Form() {

    const [form, setForm] = useState({name: "", email: "", password: "", agree:""})
    const [errors, setErrors] = useState({name: "", email: "", password: "", agree:"" })
    const [disabled, setDisabled] = useState(true)

    const setFormErrors = (name, value) => {
        yup.reach(schema, name).validate(value)
        .then(() => setErrors({...errors, [name]: ""}))
        .catch(error => setErrors({...errors, [name]:error.errors[0] }))
    }

    const change = event => {
        const {checked, value, name, type } = event.target
        const valueToUse = type === 'checkbox' ? checked : value
        setFormErrors(name, valueToUse)
        setForm({...form, [name] : valueToUse})
    }

    const submit =event => {
        event.preventDefault()
        const newUser = {name: form.name, email: form.email, password: form.password, agree: form.agree}
        axios.post('https://reqres.in/api/users', newUser)
            .then( res => {
                setForm({ name: '', email: '', password: '', agree: false})
            })
            .catch(err => {
                debugger

            })
    }

    useEffect(() => {
        schema.isValid(form).then(valid => setDisabled(!valid))
    }, [form])

    return (
        <div className="App"> 
        <div style={{color: 'blue'}}> 
            <div>{errors.name}</div> <div>{errors.email}</div><div>{errors.password}</div><div>{errors.agree}</div>
        </div> 
        <form onSubmit={submit}> 
        <label> Name 
            <input onChange={change} value={form.name} name="name" type="text" /> 
        </label> 
        <label> Email 
            <input onChange={change} value={form.email} name="email" type="text" /> 
        </label> 
        <label> Password 
            <input onChange={change} value={form.password} name="password" type="text" /> 
        </label> 
        <label> Terms and Services 
            <input onChange={change} checked={form.agree} name="agree" type="checkbox" /> 
        </label> 
        <button disabled={disabled}> Submit! </button>
        </form>
        </div> 


    )







}



