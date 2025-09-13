import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { setTokenGetter, setOnUnauthorized } from "../api/axios"; // fixed import (no .ts)

const LS_TOKEN = "token";
const LS_PROFILE = "profile";

const AuthContext = createContext({
    profile: null,
    token: null,
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
    setProfile: () => {},
    hasRole: () => false,
});

export const useAuth = () => useContext(AuthContext);

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
    const [profile, setProfileState] = useState(null);
    const [hydrated, setHydrated] = useState(false);

    const expiryTimerRef = useRef(null);

    const persist = (t, p) => {
        try {
            if (t) localStorage.setItem(LS_TOKEN, t);
            if (p) localStorage.setItem(LS_PROFILE, JSON.stringify(p));
        } catch {}
    };

    const clearPersist = () => {
        try {
            localStorage.removeItem(LS_TOKEN);
            localStorage.removeItem(LS_PROFILE);
        } catch {}
    };

    const scheduleAutoLogout = (jwt) => {
        if (expiryTimerRef.current) {
            clearTimeout(expiryTimerRef.current);
            expiryTimerRef.current = null;
        }
        const ms = getMsUntilExpiry(jwt);
        if (ms != null) {
            expiryTimerRef.current = setTimeout(() => {
                logout({ reason: "token_expired" });
            }, ms);
        }
    };

    const login = (nextProfile, jwtToken) => {
        setProfileState(nextProfile);
        setToken(jwtToken);
        persist(jwtToken, nextProfile);
        scheduleAutoLogout(jwtToken);
    };

    const logout = ({ reason } = {}) => {
        setProfileState(null);
        setToken(null);
        clearPersist();
        if (!location.pathname.startsWith("/login")) {
            const qs = reason ? `?reason=${encodeURIComponent(reason)}` : "";
            window.location.assign("/login" + qs);
        }
    };

    const setProfile = (profileUpdater) => {
        setProfileState((prev) => {
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
        if (!profile?.role) return false;
        if (Array.isArray(roles)) return roles.includes(profile.role);
        return profile.role === roles;
    };

    useEffect(() => {
        try {
            const savedToken = localStorage.getItem(LS_TOKEN);
            const savedProfileRaw = localStorage.getItem(LS_PROFILE);
            const savedProfile = savedProfileRaw
                ? JSON.parse(savedProfileRaw)
                : null;
            if (savedToken && savedProfile) {
                setToken(savedToken);
                setProfileState(savedProfile);
                scheduleAutoLogout(savedToken);
            }
        } catch {
            clearPersist();
        } finally {
            setHydrated(true);
        }
    }, []);

    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === LS_TOKEN || e.key === LS_PROFILE) {
                try {
                    const t = localStorage.getItem(LS_TOKEN);
                    const pRaw = localStorage.getItem(LS_PROFILE);
                    const p = pRaw ? JSON.parse(pRaw) : null;
                    setToken(t);
                    setProfileState(p);
                    if (t) scheduleAutoLogout(t);
                } catch {
                    clearPersist();
                    setToken(null);
                    setProfileState(null);
                }
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    useEffect(() => {
        setTokenGetter(() => {
            try {
                return localStorage.getItem(LS_TOKEN);
            } catch {
                return null;
            }
        });
        setOnUnauthorized((_err) => {
            logout({ reason: "unauthorized" });
        });
    }, []);

    const value = useMemo(
        () => ({
            profile,
            token,
            isAuthenticated: !!token,
            login,
            logout,
            setProfile,
            hasRole,
        }),
        [profile, token]
    );

    if (!hydrated) return <div />;

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
