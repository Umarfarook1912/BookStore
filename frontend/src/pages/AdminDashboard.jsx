import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminDashboard() {
    const [books, setBooks] = useState([]);
    const [form, setForm] = useState({ title: '', author: '', price: 0 });

    const load = async () => {
        try { const res = await api.get('/books'); setBooks(res.data.items || []); } catch (err) { console.error(err); }
    };
    useEffect(() => { load(); }, []);

    const submit = async (e) => {
        e.preventDefault();
        try { await api.post('/books', form); setForm({ title: '', author: '', price: 0 }); load(); } catch (err) { alert('Failed'); }
    };

    const remove = async (id) => { if (!confirm('Delete?')) return; await api.delete(`/books/${id}`); load(); };

    return (
        <div className="container py-4">
            <h3>Admin Dashboard</h3>
            <div className="row">
                <div className="col-md-6">
                    <h5>Add Book</h5>
                    <form onSubmit={submit}>
                        <input className="form-control mb-2" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                        <input className="form-control mb-2" placeholder="Author" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
                        <input type="number" className="form-control mb-2" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
                        <button className="btn btn-primary">Add</button>
                    </form>
                </div>
                <div className="col-md-6">
                    <h5>Books</h5>
                    {books.map(b => (
                        <div key={b._id} className="d-flex justify-content-between align-items-center border p-2 mb-2">
                            <div>{b.title} - ${b.price.toFixed(2)}</div>
                            <div><button className="btn btn-danger btn-sm" onClick={() => remove(b._id)}>Delete</button></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
