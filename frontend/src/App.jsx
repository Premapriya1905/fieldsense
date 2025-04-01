import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar, { ThemeProvider } from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Management from './pages/Management'
import CreateLead from './pages/CreateLead'
import CreateMeeting from './pages/CreateMeeting'
import MeetingDetails from './pages/MeetingDetails'
import LeadDetails from './pages/LeadDetails'
import styled from 'styled-components'
import { useContext } from 'react'
import { ThemeContext } from './components/Sidebar'

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
`

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  background-color: ${props => props.isDarkMode ? '#121212' : 'white'};
  margin: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, ${props => props.isDarkMode ? '0.3' : '0.05'});
  color: ${props => props.isDarkMode ? '#f5f5f5' : '#333'};
  transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
`

const FooterComponent = styled.footer`
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  padding: 15px 0;
  background-color: ${props => props.isDarkMode ? '#1e1e1e' : '#f8c14e'};
  color: ${props => props.isDarkMode ? '#f5f5f5' : '#333'};
  transition: background-color 0.3s ease, color 0.3s ease;
`

const AppContent = () => {
  const { isDarkMode } = useContext(ThemeContext);
  
  return (
    <Router>
      <AppContainer>
        <Sidebar />
        <ContentArea isDarkMode={isDarkMode}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/management" element={<Management />} />
            <Route path="/leads/create" element={<CreateLead />} />
            <Route path="/meetings/create" element={<CreateMeeting />} />
            <Route path="/leads/:id" element={<LeadDetails />} />
            <Route path="/meetings/:id" element={<MeetingDetails />} />
          </Routes>
        </ContentArea>
      </AppContainer>
      <FooterComponent isDarkMode={isDarkMode}>
        Copyright © 2023 Digielves Tech Wizards Private Limited. All rights reserved
      </FooterComponent>
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
