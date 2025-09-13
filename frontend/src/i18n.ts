// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        "navbar.allCategories": "All categories",
        "navbar.login": "Login",
        "navbar.dashboard": "Dashboard",
        "navbar.profile": "Profile",
        "navbar.logout": "Log out",
        // Route labels (fallback về label gốc nếu thiếu)
        "routes.Home": "Home",
        "routes.Listings": "Listings",
        "routes.Drivers": "Drivers",
        "routes.Services": "Services",
        "routes.Feedback": "Feedback",
        "routes.Advertise": "Advertise"
      }
    },
    vi: {
      translation: {
        "navbar.allCategories": "Tất cả danh mục",
        "navbar.login": "Đăng nhập",
        "navbar.dashboard": "Bảng điều khiển",
        "navbar.profile": "Hồ sơ",
        "navbar.logout": "Đăng xuất",

        "routes.Home": "Trang chủ",
        "routes.Listings": "Danh mục",
        "routes.Drivers": "Tài xế",
        "routes.Services": "Dịch vụ",
        "routes.Feedback": "Góp ý",
        "routes.Advertise": "Quảng cáo"
      }
    }
  },
  lng: "vi",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;
