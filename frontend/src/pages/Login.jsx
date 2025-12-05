import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FaSignInAlt } from 'react-icons/fa';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            setUser(res.data.token, res.data.user);
            navigate('/');
        } catch (err) {
            alert(err?.response?.data?.message || 'Login failed');
        }
    };

    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col md={6}>
                    <h3><FaSignInAlt style={{ marginRight: 8 }} />Login</h3>
                    <Form onSubmit={submit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                        <Button type="submit" variant="primary">Login</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
