import { Sidebar } from '../sidebar';
import { AuthProvider } from '../AuthContext';

type Props = {
    children?: React.ReactNode;
  };
  
const DashboardLayout: React.FC<Props> = ({children}) => {
    return (
      <AuthProvider><Sidebar/>{children}</AuthProvider>
  );
};
export default DashboardLayout;