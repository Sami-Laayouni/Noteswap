import Header from "../components/Header";
import { AuthProvider } from "../context/AuthContext";
/**
 * Default layout
 * @date 6/17/2023 - 4:26:44 PM
 *
 * @param {{ children: any; }} { children }
 * @returns {JSX.Element} The rendered layout of the page
 */
const DefaultLayout = ({ children }) => {
  return (
    <AuthProvider>
      <Header />
      <main>{children}</main>
    </AuthProvider>
  );
};

export default DefaultLayout;
