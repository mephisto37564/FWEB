import MyNavbar from "../components/navbar";
import PageWrapper from "../components/PageWrapper";
import { Outlet } from "react-router";

export default function AppLayout() {
  return (
    <>
      <MyNavbar />

      {/* Offset content for fixed navbar */}
      <div style={{ paddingTop: "80px" }}>
        <PageWrapper>
          <Outlet />
        </PageWrapper>
      </div>
    </>
  );
}
