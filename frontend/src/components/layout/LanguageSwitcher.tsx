import { ButtonGroup, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const cur = i18n.language?.toLowerCase().startsWith("vi") ? "vi" : "en";
  const setLang = (lng: "vi" | "en") => i18n.changeLanguage(lng);

  return (
    <ButtonGroup size="sm" aria-label="Language Switcher">
      <Button
        variant={cur === "vi" ? "primary" : "outline-primary"}
        onClick={() => setLang("vi")}
      >
        Vi
      </Button>
      <Button
        variant={cur === "en" ? "primary" : "outline-primary"}
        onClick={() => setLang("en")}
      >
        En
      </Button>
    </ButtonGroup>
  );
}
