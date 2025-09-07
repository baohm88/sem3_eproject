// import { createContext, useContext, useState, useEffect } from "react";

// // Tạo context
// const AuthContext = createContext({
//     user: null,
//     token: "",
//     isAuthenticated: false,
//     login: () => {},
//     logout: () => {},
// });

// // Hook để dùng AuthContext
// export const useAuth = () => useContext(AuthContext);

// // Provider
// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null); // { id, email, role }
//     const [token, setToken] = useState(null); // JWT
//     const [loading, setLoading] = useState(true);

//     // Load auth từ localStorage khi reload trang
//     useEffect(() => {
//         const savedToken = localStorage.getItem("token");
//         const savedUser = localStorage.getItem("user");

//         if (savedToken && savedUser) {
//             try {
//                 const parsedUser = JSON.parse(savedUser);
//                 setToken(savedToken);
//                 setUser(parsedUser);
//             } catch (e) {
//                 console.error("Lỗi parse user từ localStorage:", e);
//                 localStorage.removeItem("user"); // Xóa dữ liệu hỏng
//             }
//         }
//         setLoading(false);
//     }, []);

//     // Đăng nhập
//     const login = (userData, jwtToken) => {
//         setUser(userData);
//         setToken(jwtToken);
//         localStorage.setItem("token", jwtToken);
//         localStorage.setItem("user", JSON.stringify(userData));
//     };

//     // Đăng xuất
//     const logout = () => {
//         setUser(null);
//         setToken(null);
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//     };

//     const value = {
//         user,
//         token,
//         isAuthenticated: !!token,
//         login,
//         logout,
//     };

//     if (loading) return <div>Loading...</div>;

//     return (
//         <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
//     );
// };

// src/contexts/AuthProvider.jsx
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { setTokenGetter, setOnUnauthorized } from "../api/axios.ts"; // <-- quan trọng: dùng axios runtime hooks

const LS_TOKEN = "token";
const LS_PROFILE = "profile";

const AuthContext = createContext({
    user: null, // { id, email, role }
    token: null, // JWT
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
    setProfile: () => {},
    hasRole: () => false,
});

export const useAuth = () => useContext(AuthContext);

// decode exp của JWT (nếu có) -> số ms đến hết hạn
function getMsUntilExpiry(jwt) {
    try {
        const [, payloadB64] = jwt.split(".");
        if (!payloadB64) return null;
        const payload = JSON.parse(
            atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"))
        );
        if (!payload?.exp) return null;
        const ms = payload.exp * 1000 - Date.now();
        return ms > 0 ? ms : 0;
    } catch {
        return null;
    }
}

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null); // { id, email, role }
    const [hydrated, setHydrated] = useState(false);

    // giữ timer auto-logout (nếu token có exp)
    const expiryTimerRef = useRef(null);

    // ---- helpers ----
    const persist = (t, u) => {
        try {
            if (t) localStorage.setItem(LS_TOKEN, t);
            if (u) localStorage.setItem(LS_PROFILE, JSON.stringify(u));
        } catch {}
    };

    const clearPersist = () => {
        try {
            localStorage.removeItem(LS_TOKEN);
            localStorage.removeItem(LS_PROFILE);
        } catch {}
    };

    const scheduleAutoLogout = (jwt) => {
        // clear cũ
        if (expiryTimerRef.current) {
            clearTimeout(expiryTimerRef.current);
            expiryTimerRef.current = null;
        }
        const ms = getMsUntilExpiry(jwt);
        if (ms != null) {
            expiryTimerRef.current = setTimeout(() => {
                // token hết hạn -> logout nhẹ
                logout({ reason: "token_expired" });
            }, ms);
        }
    };

    // ---- public API ----
    const login = (profile, jwtToken) => {
        setUser(profile);
        setToken(jwtToken);
        persist(jwtToken, profile);
        scheduleAutoLogout(jwtToken);
    };

    const logout = ({ reason } = {}) => {
        setUser(null);
        setToken(null);
        clearPersist();
        // có thể điều hướng tuỳ ý
        if (!location.pathname.startsWith("/login")) {
            const qs = reason ? `?reason=${encodeURIComponent(reason)}` : "";
            window.location.assign("login" + qs);
        }
    };

    const setProfile = (profileUpdater) => {
        setUser((prev) => {
            const next =
                typeof profileUpdater === "function"
                    ? profileUpdater(prev)
                    : profileUpdater;
            try {
                localStorage.setItem(LS_PROFILE, JSON.stringify(next));
            } catch {}
            return next;
        });
    };

    const hasRole = (roles) => {
        if (!user?.role) return false;
        if (Array.isArray(roles)) return roles.includes(user.role);
        return user.role === roles;
    };

    // ---- hydrate từ localStorage ----
    useEffect(() => {
        try {
            const savedToken = localStorage.getItem(LS_TOKEN);
            const savedProfileRaw = localStorage.getItem(LS_PROFILE);
            const savedProfile = savedProfileRaw
                ? JSON.parse(savedProfileRaw)
                : null;

            if (savedToken && savedProfile) {
                setToken(savedToken);
                setUser(savedProfile);
                scheduleAutoLogout(savedToken);
            }
        } catch {
            // nếu parse lỗi -> xoá sạch
            clearPersist();
        } finally {
            setHydrated(true);
        }
    }, []);

    // ---- đồng bộ đa tab ----
    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === LS_TOKEN || e.key === LS_PROFILE) {
                try {
                    const t = localStorage.getItem(LS_TOKEN);
                    const pRaw = localStorage.getItem(LS_PROFILE);
                    const p = pRaw ? JSON.parse(pRaw) : null;
                    setToken(t);
                    setUser(p);
                    if (t) scheduleAutoLogout(t);
                } catch {
                    clearPersist();
                    setToken(null);
                    setUser(null);
                }
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, [scheduleAutoLogout]);

    // ---- nối với axios runtime hooks ----
    useEffect(() => {
        setTokenGetter(() => {
            try {
                return localStorage.getItem(LS_TOKEN);
            } catch {
                return null;
            }
        });
        setOnUnauthorized((err) => {
            // có thể hiện toast ở đây
            logout({ reason: "unauthorized" });
        });
    }, []); // set một lần

    const value = useMemo(
        () => ({
            user,
            token,
            isAuthenticated: !!token,
            login,
            logout,
            setProfile,
            hasRole,
        }),
        [user, token, hasRole, login, logout]
    );

    if (!hydrated) return <div />; // hoặc skeleton: tránh flicker

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
