import { useState } from "react";
import { registerUser } from "../api/auth.js";

const Register = ()=>{
    const [form,setForm] = useState({
        username: "",
        email: "",
        fullName: "",
        password: "",
        bio: ""
    })
    const [avatar, setAvatar] = useState(null);

    const handleChange = (e)=>{
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleFileChange = (e)=>{
        setAvatar(e.target.files[0]);
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();

        const Form = {
            username: form.username.trim(),
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            password: form.password.trim(),
            bio: form.bio.trim(),
        };

        if(
            !Form.username ||
            !Form.fullName ||
            !Form.email ||
            !Form.password
        ){
            alert("Please fill all required fields");
            return;
        }

        
        const formData = new FormData()

        Object.keys(Form).forEach((key)=>{
            formData.append(key,Form[key])
        })

        if(avatar){
            formData.append("avatar",avatar)
        }
        
        try {
            const res = await registerUser(formData);
            console.log(res.data);
            alert("Registered Successfully")
            
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");

        }
    }
    return(
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>

            <input
                type="text"
                name="username"
                value={form.username}
                placeholder="username"
                onChange={handleChange}
            />

            <input
                type="text"
                name="fullName"
                value={form.fullName}
                placeholder="Full Name"
                onChange={handleChange}
            />

            <input
                name="email"
                type="email"
                value={form.email}
                placeholder="email"
                onChange={handleChange}
            />

            <input
                name="password"
                type="password"
                value={form.password}
                placeholder="password"
                onChange={handleChange}
            />

            <input
                name="bio"
                value={form.bio}
                placeholder="bio"
                onChange={handleChange}
            />
            <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleFileChange}
            />

              <button type="submit">Register</button>
        </form>
    )
}

export default Register