import { createContext, useState, useEffect, useContext } from 'react'

// Creamos contexto 
const UserContext = createContext();

// Creamos el provider (el componente que envolvera la app)
export const UserProvider = ({ children}) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    // Funcion para login
    const login = (username) => {
        sessionStorage.setItem('user', username);
        setUser(username);
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