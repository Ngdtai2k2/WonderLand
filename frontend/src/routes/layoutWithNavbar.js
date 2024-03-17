import NavigationBar from '../components/NavigationBar';

const LayoutWithNavbar = ({ children }) => (
  <>
    <NavigationBar />
    {children}
  </>
);

export default LayoutWithNavbar;
