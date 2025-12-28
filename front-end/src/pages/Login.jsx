import { useState } from "react";
import { loginUser } from "../api/auth.js";


const Login = ()=>{
    const [form,setForm] = useState({
        username: "",
        password: "",
    })

    
    const handleChange = (e)=>{
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        if (!form.username || !form.password) {
            alert("Username and password are required");
            return;
        }

        const payload = {
            username: form.username.trim(),
            password: form.password.trim(),
        };

        try {
            const res = await loginUser(payload);
            console.log(res.data);
            alert("logined Successfully")
        } catch (error) {
            alert(error.response?.data?.message || "Cannot login please try again");
        }
    }
    return(
        <form onSubmit={handleSubmit}>
            <h2>login</h2>

            <input
                type="text"
                name="username"
                value={form.username}
                placeholder="username"
                onChange={handleChange}
            />

            <input
                type="password"
                name="password"
                value={form.password}
                placeholder="password"
                onChange={handleChange}
            />
            <button type="submit">Login</button>
        </form>
    )
}