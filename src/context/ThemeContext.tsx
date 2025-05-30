// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
// } from "react";

// // Theme types
// export type Theme = "light" | "dark" | "system";

// // Context value interface
// interface ThemeContextValue {
//   theme: Theme;
//   actualTheme: "light" | "dark";
//   setTheme: (theme: Theme) => void;
//   toggleTheme: () => void;
// }

// // Create context
// const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// // Provider component
// interface ThemeProviderProps {
//   children: ReactNode;
//   defaultTheme?: Theme;
// }

// export const ThemeProvider: React.FC<ThemeProviderProps> = ({
//   children,
//   defaultTheme = "system",
// }) => {
//   const [theme, setThemeState] = useState<Theme>(() => {
//     // Get theme from localStorage or use default
//     if (typeof window !== "undefined") {
//       const stored = localStorage.getItem("theme") as Theme;
//       return stored || defaultTheme;
//     }
//     return defaultTheme;
//   });

//   const [actualTheme, setActualTheme] = useState<"light" | "dark">("light");

//   // Update actual theme based on theme setting and system preference
//   useEffect(() => {
//     const updateActualTheme = () => {
//       if (theme === "system") {
//         const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
//           .matches
//           ? "dark"
//           : "light";
//         setActualTheme(systemTheme);
//       } else {
//         setActualTheme(theme);
//       }
//     };

//     updateActualTheme();

//     // Listen for system theme changes when using system theme
//     if (theme === "system") {
//       const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
//       const handleChange = () => updateActualTheme();

//       mediaQuery.addEventListener("change", handleChange);
//       return () => mediaQuery.removeEventListener("change", handleChange);
//     }
//   }, [theme]);

//   // Apply theme to document
//   useEffect(() => {
//     const root = window.document.documentElement;

//     root.classList.remove("light", "dark");
//     root.classList.add(actualTheme);
//   }, [actualTheme]);

//   // Set theme and persist to localStorage
//   const setTheme = (newTheme: Theme) => {
//     setThemeState(newTheme);
//     localStorage.setItem("theme", newTheme);
//   };

//   // Toggle between light and dark (ignores system)
//   const toggleTheme = () => {
//     if (theme === "system") {
//       // If system, switch to opposite of current system preference
//       const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
//         .matches
//         ? "dark"
//         : "light";
//       setTheme(systemTheme === "dark" ? "light" : "dark");
//     } else {
//       // Toggle between light and dark
//       setTheme(theme === "light" ? "dark" : "light");
//     }
//   };

//   const value: ThemeContextValue = {
//     theme,
//     actualTheme,
//     setTheme,
//     toggleTheme,
//   };

//   return (
//     <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
//   );
// };

// // Hook to use theme context
// export const useTheme = (): ThemeContextValue => {
//   const context = useContext(ThemeContext);
//   if (context === undefined) {
//     throw new Error("useTheme must be used within a ThemeProvider");
//   }
//   return context;
// };

// export default ThemeContext;
