import { Outlet } from "react-router-dom";
import { HeaderComponent } from "./Header";
import {Container} from "@mantine/core";

export function Content() {
  return (
    <>
      <HeaderComponent links={[{ label: "Departments", link: "/" }]} />
        <Container px="xs">
            <Outlet />
        </Container>
    </>
  );
}
