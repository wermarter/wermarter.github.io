import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";

type Theme = "light" | "dark";

function preferredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => setTheme(preferredTheme()), []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    const applyTheme = () => {
      document.documentElement.dataset.theme = next;
      window.localStorage.setItem("theme", next);
      setTheme(next);
    };

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "startViewTransition" in document) {
      document.startViewTransition(applyTheme);
    } else {
      applyTheme();
    }
  }

  return (
    <button className={styles.toggle} type="button" onClick={toggleTheme} aria-label={`Use ${theme === "light" ? "dark" : "light"} theme`}>
      <span aria-hidden="true" className={styles.icon}>{theme === "light" ? "◐" : "◑"}</span>
    </button>
  );
}
