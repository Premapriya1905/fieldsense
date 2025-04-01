import { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios'
import { ThemeContext } from '../components/Sidebar'

const PageContainer = styled.div`
  padding: 20px;
  background-color: ${props => props.isDarkMode ? '#121212' : 'transparent'};
  color: ${props => props.isDarkMode ? '#f5f5f5' : 'inherit'};
  font-size: 16px;
`

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
`

const Tab = styled.div`
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  background-color: ${props => props.active 
    ? (props.isDarkMode ? '#2d2d2d' : 'white') 
    : (props.isDarkMode ? '#1a1a1a' : '#f0f0f0')};
  color: ${props => props.active 
    ? (props.isDarkMode ? '#bbdefb' : '#4a47a3') 
    : (props.isDarkMode ? '#aaa' : '#666')};
  font-weight: ${props => props.active ? '600' : '400'};
  margin: 0 10px;
  
  &:hover {
    background-color: ${props => props.isDarkMode ? '#2d2d2d' : 'white'};
  }
`

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
`

const CreateButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background-color: #4a47a3;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 15px;
  transition: all 0.3s;
  
  &:hover {
    background-color: #36338f;
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${props => props.isDarkMode ? '#1e1e1e' : 'white'};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, ${props => props.isDarkMode ? '0.3' : '0.05'});
  border: 1px solid ${props => props.isDarkMode ? '#333' : '#eee'};
  font-size: 15px;
`

const TableHead = styled.thead`
  background: linear-gradient(90deg, #4a47a3 0%, #ae8a79 100%);
  color: white;
`

const Th = styled.th`
  padding: 12px;
  text-align: left;
  font-weight: 500;
  position: relative;
  cursor: ${props => props.sortable ? 'pointer' : 'default'};
  user-select: none;
  font-size: 15px;
  
  &:hover {
    background-color: ${props => props.sortable ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  }
`

const SortIcon = styled.span`
  position: absolute;
  margin-left: 5px;
  opacity: ${props => props.active ? 1 : 0.3};
  transition: opacity 0.2s ease;
`

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: ${props => props.isDarkMode ? '#2c2c2c' : '#f9f9f9'};
  }
  
  &:hover {
    background-color: ${props => props.isDarkMode ? '#333' : '#f0f0f0'};
  }
`

const Td = styled.td`
  padding: 10px 12px;
  border-bottom: 1px solid ${props => props.isDarkMode ? '#333' : '#eee'};
  color: ${props => props.isDarkMode ? '#f5f5f5' : 'inherit'};
  font-size: 14px;
`

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  font-size: 13px;
`

const PageInfo = styled.div`
  color: ${props => props.isDarkMode ? '#aaa' : '#666'};
  font-size: 13px;
`

const PageButtons = styled.div`
  display: flex;
  gap: 8px;
`

const PageButton = styled.button`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.isDarkMode ? '#444' : '#ddd'};
  background-color: ${props => props.isDarkMode ? '#2d2d2d' : 'white'};
  color: ${props => props.isDarkMode ? '#f5f5f5' : 'inherit'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 12px;
  
  &:hover {
    background-color: ${props => props.isDarkMode ? '#3d3d3d' : '#f0f0f0'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const ViewIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.isDarkMode ? '#2d2d2d' : '#f0f0f0'};
  color: ${props => props.isDarkMode ? '#bbdefb' : 'inherit'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.isDarkMode ? '#3d3d3d' : '#e0e0e0'};
    transform: scale(1.1);
  }
`

const Management = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('meetings')
  const [leads, setLeads] = useState([])
  const [meetings, setMeetings] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage] = useState(10)
  const [sortField, setSortField] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leadsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/leads`)
        const meetingsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/meetings`)
        
        setLeads(leadsResponse.data)
        setMeetings(meetingsResponse.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    
    fetchData()
  }, [])

  const handleSort = (field) => {
    // If clicking the same field, toggle direction
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // If clicking a new field, set it as the sort field and default to ascending
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortData = (data) => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle string comparisons (case-insensitive)
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      // Handle date comparisons
      if (sortField.includes('Date') || sortField.includes('Time')) {
        // Convert to timestamps for comparison if they are valid dates
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        
        if (!isNaN(aDate) && !isNaN(bDate)) {
          aValue = aDate.getTime();
          bValue = bDate.getTime();
        }
      }

      // Null/undefined values should go last regardless of sort direction
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Perform the comparison
      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  // Calculate pagination for leads
  const sortedLeads = sortData(leads);
  const indexOfLastLead = currentPage * rowsPerPage
  const indexOfFirstLead = indexOfLastLead - rowsPerPage
  const currentLeads = sortedLeads.slice(indexOfFirstLead, indexOfLastLead)
  const leadsPages = Math.ceil(leads.length / rowsPerPage)

  // Calculate pagination for meetings
  const sortedMeetings = sortData(meetings);
  const indexOfLastMeeting = currentPage * rowsPerPage
  const indexOfFirstMeeting = indexOfLastMeeting - rowsPerPage
  const currentMeetings = sortedMeetings.slice(indexOfFirstMeeting, indexOfLastMeeting)
  const meetingsPages = Math.ceil(meetings.length / rowsPerPage)

  const totalPages = activeTab === 'leads' ? leadsPages : meetingsPages

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentPage(1) // Reset to first page when changing tabs
    setSortField('') // Reset sorting when changing tabs
    setSortDirection('asc')
  }

  const handleViewLead = (leadId) => {
    navigate(`/leads/${leadId}`);
  };

  const handleViewMeeting = (meetingId) => {
    navigate(`/meetings/${meetingId}`);
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return (
        <SortIcon active={false}>
          
        </SortIcon>
      );
    }
    
    return (
      <SortIcon active={true}>
        {sortDirection === 'asc' ? '↑' : '↓'}
      </SortIcon>
    );
  };

  const renderSortableHeader = (field, label) => (
    <Th 
      sortable={true} 
      onClick={() => handleSort(field)}
    >
      {label} {renderSortIcon(field)}
    </Th>
  );

  const renderLeadsTable = () => (
    <Table isDarkMode={isDarkMode}>
      <TableHead>
        <tr>
          <Th>VIEW</Th>
          {renderSortableHeader('leadName', 'LEAD NAME')}
          {renderSortableHeader('leadSource', 'LEAD SOURCE')}
          {renderSortableHeader('contactPhone', 'PHONE')}
          {renderSortableHeader('contactEmail', 'EMAIL')}
          {renderSortableHeader('companyName', 'COMPANY NAME')}
          {renderSortableHeader('leadStatus', 'LEAD STATUS')}
          {renderSortableHeader('assignedSalesRep', 'ASSIGNED SALES REP')}
          {renderSortableHeader('lastContactDate', 'LAST CONTACT DATE')}
          {renderSortableHeader('nextFollowUpDate', 'NEXT FOLLOW-UP')}
        </tr>
      </TableHead>
      <tbody>
        {currentLeads.map((lead) => (
          <Tr key={lead.id} isDarkMode={isDarkMode}>
            <Td isDarkMode={isDarkMode}>
              <ViewIcon isDarkMode={isDarkMode} onClick={() => handleViewLead(lead.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </ViewIcon>
            </Td>
            <Td isDarkMode={isDarkMode}>{lead.leadName}</Td>
            <Td isDarkMode={isDarkMode}>{lead.leadSource}</Td>
            <Td isDarkMode={isDarkMode}>{lead.contactPhone}</Td>
            <Td isDarkMode={isDarkMode}>{lead.contactEmail}</Td>
            <Td isDarkMode={isDarkMode}>{lead.companyName}</Td>
            <Td isDarkMode={isDarkMode}>{lead.leadStatus}</Td>
            <Td isDarkMode={isDarkMode}>{lead.assignedSalesRep}</Td>
            <Td isDarkMode={isDarkMode}>{lead.lastContactDate}</Td>
            <Td isDarkMode={isDarkMode}>{lead.nextFollowUpDate}</Td>
          </Tr>
        ))}
        {currentLeads.length === 0 && (
          <Tr isDarkMode={isDarkMode}>
            <Td colSpan="10" style={{ textAlign: 'center' }} isDarkMode={isDarkMode}>No leads found</Td>
          </Tr>
        )}
      </tbody>
    </Table>
  )

  const renderMeetingsTable = () => (
    <Table isDarkMode={isDarkMode}>
      <TableHead>
        <tr>
          <Th>VIEW</Th>
          {renderSortableHeader('meetingTitle', 'MEETING TITLE')}
          {renderSortableHeader('meetingDate', 'MEETING DATE')}
          {renderSortableHeader('meetingTime', 'MEETING TIME')}
          {renderSortableHeader('participants', 'PARTICIPANTS')}
          {renderSortableHeader('location', 'LOCATION')}
          {renderSortableHeader('travelMode', 'TRAVEL MODE')}
          {renderSortableHeader('expenses', 'EXPENSES TYPE')}
        </tr>
      </TableHead>
      <tbody>
        {currentMeetings.map((meeting) => (
          <Tr key={meeting.id} isDarkMode={isDarkMode}>
            <Td isDarkMode={isDarkMode}>
              <ViewIcon isDarkMode={isDarkMode} onClick={() => handleViewMeeting(meeting.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </ViewIcon>
            </Td>
            <Td isDarkMode={isDarkMode}>{meeting.meetingTitle}</Td>
            <Td isDarkMode={isDarkMode}>{meeting.meetingDate}</Td>
            <Td isDarkMode={isDarkMode}>{meeting.meetingTime}</Td>
            <Td isDarkMode={isDarkMode}>{meeting.participants}</Td>
            <Td isDarkMode={isDarkMode}>{meeting.location}</Td>
            <Td isDarkMode={isDarkMode}>{meeting.travelMode}</Td>
            <Td isDarkMode={isDarkMode}>{meeting.expenses}</Td>
          </Tr>
        ))}
        {currentMeetings.length === 0 && (
          <Tr isDarkMode={isDarkMode}>
            <Td colSpan="8" style={{ textAlign: 'center' }} isDarkMode={isDarkMode}>No meetings found</Td>
          </Tr>
        )}
      </tbody>
    </Table>
  )

  const renderPagination = () => {
    const dataLength = activeTab === 'leads' ? leads.length : meetings.length
    const firstIndex = activeTab === 'leads' ? indexOfFirstLead : indexOfFirstMeeting
    const lastIndex = activeTab === 'leads' ? indexOfLastLead : indexOfLastMeeting

    return (
      <Pagination>
        <PageInfo isDarkMode={isDarkMode}>
          Rows per page: 
          <select style={{ marginLeft: '8px', padding: '4px', backgroundColor: isDarkMode ? '#2d2d2d' : 'white', color: isDarkMode ? '#f5f5f5' : 'inherit', border: `1px solid ${isDarkMode ? '#444' : '#ddd'}`, fontSize: '13px' }}>
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </PageInfo>
        
        <PageInfo isDarkMode={isDarkMode}>
          {dataLength > 0 ? `${firstIndex + 1}-${Math.min(lastIndex, dataLength)} of ${dataLength}` : '0 of 0'}
        </PageInfo>
        
        <PageButtons>
          <PageButton isDarkMode={isDarkMode} onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
            &lt;&lt;
          </PageButton>
          <PageButton isDarkMode={isDarkMode} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            &lt;
          </PageButton>
          <PageButton isDarkMode={isDarkMode} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0}>
            &gt;
          </PageButton>
          <PageButton isDarkMode={isDarkMode} onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0}>
            &gt;&gt;
          </PageButton>
        </PageButtons>
      </Pagination>
    )
  }

  return (
    <PageContainer isDarkMode={isDarkMode}>
      <TabsContainer>
        <Tab active={activeTab === 'meetings'} isDarkMode={isDarkMode} onClick={() => handleTabChange('meetings')}>
          Meeting Management
        </Tab>
        <Tab active={activeTab === 'leads'} isDarkMode={isDarkMode} onClick={() => handleTabChange('leads')}>
          Leads Management
        </Tab>
      </TabsContainer>
      
      <Header>
        <CreateButton to={activeTab === 'leads' ? "/leads/create" : "/meetings/create"}>
          <span style={{ marginRight: '8px' }}>+</span> Create {activeTab === 'leads' ? 'Lead' : 'Meeting'}
        </CreateButton>
      </Header>
      
      {activeTab === 'leads' ? renderLeadsTable() : renderMeetingsTable()}
      
      {renderPagination()}
    </PageContainer>
  )
}

export default Management 