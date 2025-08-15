import { ToastContainer } from "react-toastify";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </>
  );
}

export default App;
