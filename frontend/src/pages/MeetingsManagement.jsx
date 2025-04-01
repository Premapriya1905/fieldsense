import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios'

const PageContainer = styled.div`
  padding: 20px;
`

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
`

const Tab = styled.div`
  padding: 12px 25px;
  font-size: 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  background-color: ${props => props.active ? 'white' : '#f0f0f0'};
  color: ${props => props.active ? '#4a47a3' : '#666'};
  font-weight: ${props => props.active ? '600' : '400'};
  
  &:hover {
    background-color: white;
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

const CreateButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  background-color: #4a47a3;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s;
  
  &:hover {
    background-color: #36338f;
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
`

const TableHead = styled.thead`
  background: linear-gradient(90deg, #4a47a3 0%, #ae8a79 100%);
  color: white;
`

const Th = styled.th`
  padding: 15px;
  text-align: left;
  font-weight: 500;
`

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  &:hover {
    background-color: #f0f0f0;
  }
`

const Td = styled.td`
  padding: 15px;
  border-bottom: 1px solid #eee;
`

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`

const PageInfo = styled.div`
  color: #666;
`

const PageButtons = styled.div`
  display: flex;
  gap: 10px;
`

const PageButton = styled.button`
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: #f0f0f0;
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
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #f0f0f0;
`

const MeetingsManagement = () => {
  const [meetings, setMeetings] = useState([])
  const [activeTab, setActiveTab] = useState('meetings')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage] = useState(10)

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/meetings')
        setMeetings(response.data)
      } catch (error) {
        console.error('Error fetching meetings:', error)
      }
    }
    
    fetchMeetings()
  }, [])

  // Calculate pagination
  const indexOfLastMeeting = currentPage * rowsPerPage
  const indexOfFirstMeeting = indexOfLastMeeting - rowsPerPage
  const currentMeetings = meetings.slice(indexOfFirstMeeting, indexOfLastMeeting)
  const totalPages = Math.ceil(meetings.length / rowsPerPage)

  return (
    <PageContainer>
      <TabsContainer>
        <Tab active={activeTab === 'meetings'} onClick={() => setActiveTab('meetings')}>Meeting Management</Tab>
        <Tab active={activeTab === 'leads'} onClick={() => setActiveTab('leads')}>Leads Management</Tab>
      </TabsContainer>
      
      <Header>
        <CreateButton to="/meetings/create">
          <span style={{ marginRight: '8px' }}>+</span> Create
        </CreateButton>
      </Header>
      
      <Table>
        <TableHead>
          <tr>
            <Th>VIEW</Th>
            <Th>MEETING TITLE</Th>
            <Th>MEETING DATE</Th>
            <Th>MEETING TIME</Th>
            <Th>PARTICIPANTS</Th>
            <Th>LOCATION</Th>
            <Th>TRAVEL MODE</Th>
            <Th>EXPENSES TYPE</Th>
          </tr>
        </TableHead>
        <tbody>
          {currentMeetings.map((meeting) => (
            <Tr key={meeting.id}>
              <Td>
                <ViewIcon>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </ViewIcon>
              </Td>
              <Td>{meeting.meetingTitle}</Td>
              <Td>{meeting.meetingDate}</Td>
              <Td>{meeting.meetingTime}</Td>
              <Td>{meeting.participants}</Td>
              <Td>{meeting.location}</Td>
              <Td>{meeting.travelMode}</Td>
              <Td>{meeting.expenses}</Td>
            </Tr>
          ))}
          {currentMeetings.length === 0 && (
            <Tr>
              <Td colSpan="8" style={{ textAlign: 'center' }}>No meetings found</Td>
            </Tr>
          )}
        </tbody>
      </Table>
      
      <Pagination>
        <PageInfo>
          Rows per page: 
          <select style={{ marginLeft: '8px', padding: '5px' }}>
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </PageInfo>
        
        <PageInfo>
          {indexOfFirstMeeting + 1}-{Math.min(indexOfLastMeeting, meetings.length)} of {meetings.length}
        </PageInfo>
        
        <PageButtons>
          <PageButton onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
            &lt;&lt;
          </PageButton>
          <PageButton onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            &lt;
          </PageButton>
          <PageButton onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            &gt;
          </PageButton>
          <PageButton onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
            &gt;&gt;
          </PageButton>
        </PageButtons>
      </Pagination>
    </PageContainer>
  )
}

export default MeetingsManagement 