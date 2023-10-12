import AdminSidebar from "../../components/AdminSidebar";
import { requireAuthenticationAdmin } from "../../middleware/admin";
const Admin = () => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "25% 75%" }}>
      <AdminSidebar />
    </div>
  );
};
export default requireAuthenticationAdmin(Admin);
