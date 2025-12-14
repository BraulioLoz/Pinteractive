import { createContext, useState, useEffect, useContext } from 'react'

// Creamos contexto 
const UserContext = createContext();

// Creamos el provider (el componente que envolvera la app)
export const UserProvider = ({ children}) => {
    const [user, setUser] = useState(null);
    // Cargar usuario desde sessionStorage al iniciar la app
    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []); //solo se ejecuta una vez 

    // Funcion para login
    const login = (userData) => {
        sessionStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    // Funcion para logout
    const logout = () => {
        sessionStorage.removeItem('user');
        setUser(null);
    };

    return (
        <UserContext.Provider value = {{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook para usarlo facil en cualquier componente
export const useUser = () => useContext(UserContext);