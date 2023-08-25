import AdminSidebar from "../../components/AdminSidebar";
export default function Admin() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "25% 75%" }}>
      <AdminSidebar />
    </div>
  );
}
