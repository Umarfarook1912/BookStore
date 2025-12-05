import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register', { name, email, password });
            setUser(res.data.token, res.data.user);
            navigate('/');
        } catch (err) {
            alert(err?.response?.data?.message || 'Register failed');
        }
    };

    return (
        <div className="container py-4"><div className="row justify-content-center"><div className="col-md-6">
            <h3>Register</h3>
            <form onSubmit={submit}>
                <div className="mb-3"><label className="form-label">Name</label>
                    <input className="form-control" value={name} onChange={e => setName(e.target.value)} /></div>
                <div className="mb-3"><label className="form-label">Email</label>
                    <input className="form-control" value={email} onChange={e => setEmail(e.target.value)} /></div>
                <div className="mb-3"><label className="form-label">Password</label>
                    <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} /></div>
                <button className="btn btn-primary">Register</button>
            </form>
        </div></div></div>
    );
}
