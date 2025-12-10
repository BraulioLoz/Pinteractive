import { useState } from 'react';
import { useUser } from '../../context/UserContext';

const LoginControl = () => {
    const { user, login, logout } = useUser();
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            login(inputValue);
            setInputValue(''); // Limpiar input
        }
    };

    // Si hay usuario mostramos saludo. 
    if (user) {
        return (
            <div className="d-flex align-items-center gap-3">
                <span className="text-light fw-bold">¡Hola, {user}! ¿Listo para escuchar música mientras scrolleas?</span>
                <button onClick={logout} className="btn btn-outline-danger btn-sm">
                    Salir
                </button>
            </div>
        );
    }

    // Si no, formulario. 
    return (
        <form onSubmit={handleSubmit} className="d-flex gap-2">
            <input 
            type="text" 
            className="form-control form-control-sm"
            placeHolder="Uuusuariooo..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            required
            />
            <button type="submit" className="btn btn-primary btn-sm">
                Entrar 
            </button>
        </form>
    );
};

export default LoginControl;
