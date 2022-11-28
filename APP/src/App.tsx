import React from "react";
import "./App.css";
import { MantineProvider } from "@mantine/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./store/app.store";
import { NotificationsProvider } from "@mantine/notifications";
import { Content } from "./layout/Content";
import { DepartmentViewComponent } from "./component/DepartmentView.Component";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Content />,
    children: [
      { path: "", element: <DepartmentViewComponent /> },
    ],
  },
]);

function App() {
  const themeClass = useSelector(
    (state: RootState) => state.themeReducer.class
  );

  return (
    <MantineProvider
      theme={{ colorScheme: themeClass === "dark" ? "dark" : "light" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <NotificationsProvider position="top-right" zIndex={2077}>
        <div className="App">
          <RouterProvider router={router} />
        </div>
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default App;
