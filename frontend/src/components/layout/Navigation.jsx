import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 2rem;
  margin-bottom: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  gap: 2rem;
  margin: 0;
  padding: 0;
  align-items: center;
`;

const NavItem = styled.li`
  margin: 0;
`;

const NavLink = styled(Link)`
  color: ${props => props.$isActive ? '#fff' : 'rgba(255, 255, 255, 0.8)'};
  text-decoration: none;
  font-weight: ${props => props.$isActive ? '600' : '500'};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: ${props => props.$isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  
  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const Brand = styled.div`
  color: #fff;
  font-weight: bold;
  font-size: 1.3rem;
  margin-right: auto;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PageTitle = styled.span`
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 1rem;
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  padding-left: 1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const Navigation = () => {
  const location = useLocation();
  const isConfigPage = location.pathname === '/';
  
  return (
    <Nav>
      <NavList>
        <Brand>
          KPI Dashboard
          {isConfigPage && <PageTitle>Set KPI Threshold</PageTitle>}
        </Brand>
        <NavItem>
          <NavLink to="/" $isActive={location.pathname === '/'}>
            Configure Threshold
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/playlist" $isActive={location.pathname === '/playlist'}>
            Configure Playlist
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/screens" $isActive={location.pathname === '/screens'}>
            Screen Management
          </NavLink>
        </NavItem>
      </NavList>
    </Nav>
  );
};

export default Navigation;
