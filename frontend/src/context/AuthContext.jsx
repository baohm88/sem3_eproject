import { createContext, useContext, useState, useEffect } from "react";

// Tạo context
const AuthContext = createContext({
    user: null,
    token: "",
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
});

// Hook để dùng AuthContext
export const useAuth = () => useContext(AuthContext);

// Provider
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { id, email, role }
    const [token, setToken] = useState(null); // JWT
    const [loading, setLoading] = useState(true);

    // Load auth từ localStorage khi reload trang
    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (savedToken && savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setToken(savedToken);
                setUser(parsedUser);
            } catch (e) {
                console.error("Lỗi parse user từ localStorage:", e);
                localStorage.removeItem("user"); // Xóa dữ liệu hỏng
            }
        }
        setLoading(false);
    }, []);

    // Đăng nhập
    const login = (userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    // Đăng xuất
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    const value = {
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
    };

    if (loading) return <div>Loading...</div>;

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
