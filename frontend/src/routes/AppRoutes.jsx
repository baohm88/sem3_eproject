import { RouterProvider } from "react-router-dom";
import { router } from "./router";

function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;
