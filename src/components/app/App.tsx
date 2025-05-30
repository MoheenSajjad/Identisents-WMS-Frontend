import { NotificationProvider } from "@/context/NotificationContext";
import { Router } from "./router";

export const App = () => {
  return (
    <NotificationProvider>
      <Router />
    </NotificationProvider>
  );
};
