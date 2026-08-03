import { Box } from "@mantine/core";
import { Outlet } from "react-router-dom";

export function LandingLayout() {
  return (
    <Box style={{ backgroundColor: "#F7F4EB", color: "#2B2826", minHeight: "100vh" }}>
      <Outlet />
    </Box>
  );
}

export default LandingLayout;
