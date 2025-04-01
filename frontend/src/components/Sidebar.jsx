import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { useState, createContext, useContext, useEffect } from 'react'

// Create a theme context
export const ThemeContext = createContext();

// Create a theme provider component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  useEffect(() => {
    // Apply theme to body when theme changes
    document.body.style.backgroundColor = isDarkMode ? '#121212' : '#f5f5f5';
    document.body.style.color = isDarkMode ? '#f5f5f5' : '#333';
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const SidebarContainer = styled.div`
  width: ${props => props.isExpanded ? '200px' : '70px'};
  min-height: 100vh;
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(180deg, #2c2c2c 0%, #1a1a5c 100%)' 
    : 'linear-gradient(180deg, #b08d80 0%, #5555dd 100%)'};
  display: flex;
  flex-direction: column;
  padding-top: 15px;
  color: white;
  transition: width 0.3s ease, background 0.3s ease;
  overflow: hidden;
  position: relative;
  z-index: 10;
  font-size: 13px;
`

const UserSection = styled.div`
  display: flex;
  align-items: center;
  padding: 0 15px 15px 15px;
  margin-bottom: 8px;
  justify-content: ${props => props.isExpanded ? 'flex-start' : 'center'};
`

const UserAvatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.isDarkMode ? '#333' : 'white'};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: ${props => props.isExpanded ? '8px' : '0'};
  transition: background-color 0.3s ease;
`

const UserInfo = styled.div`
  flex: 1;
  display: ${props => props.isExpanded ? 'block' : 'none'};
  transition: opacity 0.3s ease;
  opacity: ${props => props.isExpanded ? 1 : 0};
  white-space: nowrap;
`

const UserName = styled.div`
  font-size: 13px;
  font-weight: 500;
`

const UserControls = styled.div`
  display: ${props => props.isExpanded ? 'flex' : 'none'};
  gap: 4px;
  transition: opacity 0.3s ease;
  opacity: ${props => props.isExpanded ? 1 : 0};
`

const StatusCircle = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => props.isDarkMode ? '#333' : 'white'};
  display: flex;
  justify-content: center;
  align-items: center;
  color: #4CAF50;
  font-weight: bold;
  font-size: 11px;
  transition: background-color 0.3s ease;
`

const ThemeToggle = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => props.isDarkMode ? '#333' : 'white'};
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => props.isDarkMode ? '#f5f5f5' : '#333'};
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
`

const MenuItemContainer = styled(NavLink)`
  padding: 12px 15px;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  transition: all 0.3s;
  justify-content: ${props => props.isExpanded ? 'flex-start' : 'center'};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &.active {
    background-color: rgba(255, 255, 255, 0.2);
  }
`

const IconContainer = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: ${props => props.isExpanded ? '12px' : '0'};
`

const MenuText = styled.span`
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: ${props => props.isExpanded ? 1 : 0};
  width: ${props => props.isExpanded ? 'auto' : '0'};
  display: ${props => props.isExpanded ? 'block' : 'none'};
  transition: opacity 0.3s ease, width 0.3s ease;
`

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  return (
    <SidebarContainer 
      isExpanded={isExpanded} 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
      isDarkMode={isDarkMode}
    >
      <UserSection isExpanded={isExpanded}>
        <UserAvatar isExpanded={isExpanded} isDarkMode={isDarkMode}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isDarkMode ? "#ccc" : "#666"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </UserAvatar>
        <UserInfo isExpanded={isExpanded}>
          <UserName>sham sarkar</UserName>
        </UserInfo>
        <UserControls isExpanded={isExpanded}>
          <StatusCircle isDarkMode={isDarkMode}>P</StatusCircle>
          <ThemeToggle onClick={toggleTheme} isDarkMode={isDarkMode}>
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </ThemeToggle>
        </UserControls>
      </UserSection>
      
      <MenuItemContainer to="/" isExpanded={isExpanded}>
        <IconContainer isExpanded={isExpanded}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        </IconContainer>
        <MenuText isExpanded={isExpanded}>Dashboard</MenuText>
      </MenuItemContainer>

      <MenuItemContainer to="/management" isExpanded={isExpanded}>
        <IconContainer isExpanded={isExpanded}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </IconContainer>
        <MenuText isExpanded={isExpanded}>FieldSense</MenuText>
      </MenuItemContainer>
    </SidebarContainer>
  )
}

export default Sidebar 