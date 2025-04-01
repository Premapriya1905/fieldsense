import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { ThemeContext } from '../components/Sidebar';

const PageContainer = styled.div`
  padding: 20px;
  background-color: ${props => props.isDarkMode ? '#121212' : 'transparent'};
  color: ${props => props.isDarkMode ? '#f5f5f5' : 'inherit'};
`;

const Header = styled.div`
  background: linear-gradient(90deg, #5538ee 0%, #f0ac3f 100%);
  border-radius: 8px;
  color: white;
  padding: 15px 30px;
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 30px;
  text-align: center;
`;

const DetailsContainer = styled.div`
  background: ${props => props.isDarkMode ? '#1e1e1e' : 'white'};
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, ${props => props.isDarkMode ? '0.3' : '0.05'});
  border: 1px solid ${props => props.isDarkMode ? '#333' : '#eee'};
  color: ${props => props.isDarkMode ? '#f5f5f5' : 'inherit'};
`;

const DetailRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  margin-bottom: 20px;
`;

const DetailLabel = styled.div`
  font-weight: 600;
  margin-bottom: 5px;
  color: ${props => props.isDarkMode ? '#bbdefb' : '#333'};
`;

const DetailValue = styled.div`
  color: ${props => props.isDarkMode ? '#f5f5f5' : '#555'};
  font-size: 16px;
`;

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background-color: ${props => props.isDarkMode ? '#333' : '#eee'};
  margin: 20px 0;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 15px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  font-weight: 500;
  
  &:hover {
    opacity: 0.9;
  }
`;

const NotesButton = styled(Button)`
  background-color: ${props => props.isDarkMode ? '#333' : 'white'};
  color: ${props => props.isDarkMode ? '#f5f5f5' : '#333'};
  border: 1px solid ${props => props.isDarkMode ? '#555' : '#ddd'};
`;

const AudioButton = styled(Button)`
  background-color: ${props => props.isDarkMode ? '#333' : 'white'};
  color: ${props => props.isDarkMode ? '#f5f5f5' : '#333'};
  border: 1px solid ${props => props.isDarkMode ? '#555' : '#ddd'};
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ParticipantsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 30px;
  border-radius: 8px;
  overflow: hidden;
`;

const TableHead = styled.thead`
  background: linear-gradient(90deg, #4a47a3 0%, #f0ac3f 100%);
  color: white;
`;

const Th = styled.th`
  padding: 15px;
  text-align: left;
  font-weight: 500;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: ${props => props.isDarkMode ? '#2c2c2c' : '#f9f9f9'};
  }
  
  &:hover {
    background-color: ${props => props.isDarkMode ? '#333' : '#f0f0f0'};
  }
`;

const Td = styled.td`
  padding: 15px;
  border-bottom: 1px solid ${props => props.isDarkMode ? '#333' : '#eee'};
  color: ${props => props.isDarkMode ? '#f5f5f5' : 'inherit'};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

const PageInfo = styled.div`
  color: ${props => props.isDarkMode ? '#ccc' : '#666'};
`;

const MeetingDetails = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { id } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/meetings/${id}`);
        setMeeting(response.data);
        
        // Parse participants if they're in string format
        if (response.data.participants) {
          try {
            const participantsArray = response.data.participants.split(',').map(p => {
              // Try to extract name, organization, department, email
              const parts = p.trim().split(' - ');
              return {
                name: parts[0] || '',
                organization: parts[1] || 'GoPhygital',
                department: parts[2] || 'IT',
                email: parts[3] || `${parts[0].toLowerCase()}@gmail.com`
              };
            });
            setParticipants(participantsArray);
          } catch (e) {
            // If parsing fails, create a single participant
            setParticipants([{
              name: response.data.participants,
              organization: 'GoPhygital',
              department: 'IT',
              email: `${response.data.participants.toLowerCase()}@gmail.com`
            }]);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching meeting:', error);
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [id]);

  if (loading) {
    return <PageContainer isDarkMode={isDarkMode}>Loading meeting details...</PageContainer>;
  }

  if (!meeting) {
    return <PageContainer isDarkMode={isDarkMode}>Meeting not found</PageContainer>;
  }

  return (
    <PageContainer isDarkMode={isDarkMode}>
      <Header>Field Sense Meeting Details</Header>
      
      <DetailsContainer isDarkMode={isDarkMode}>
        <DetailRow>
          <DetailItem>
            <DetailLabel isDarkMode={isDarkMode}>Title:</DetailLabel>
            <DetailValue isDarkMode={isDarkMode}>{meeting.meetingTitle}</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel isDarkMode={isDarkMode}>Date:</DetailLabel>
            <DetailValue isDarkMode={isDarkMode}>{meeting.meetingDate}</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel isDarkMode={isDarkMode}>Time:</DetailLabel>
            <DetailValue isDarkMode={isDarkMode}>{meeting.meetingTime}</DetailValue>
          </DetailItem>
        </DetailRow>
        
        <DetailRow>
          <DetailItem>
            <DetailLabel isDarkMode={isDarkMode}>Participants :</DetailLabel>
            <DetailValue isDarkMode={isDarkMode}>{meeting.participants || '0'}</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel isDarkMode={isDarkMode}>Meeting Agenda:</DetailLabel>
            <DetailValue isDarkMode={isDarkMode}>{meeting.meetingAgenda || 'N/A'}</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel isDarkMode={isDarkMode}>Meeting Location:</DetailLabel>
            <DetailValue isDarkMode={isDarkMode}>{meeting.location || 'N/A'}</DetailValue>
          </DetailItem>
        </DetailRow>
        
        <DetailRow>
          <DetailItem>
            <DetailLabel isDarkMode={isDarkMode}>Travel Mode :</DetailLabel>
            <DetailValue isDarkMode={isDarkMode}>{meeting.travelMode || 'N/A'}</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel isDarkMode={isDarkMode}>Expenses:</DetailLabel>
            <DetailValue isDarkMode={isDarkMode}>{meeting.expenses || 'N/A'}</DetailValue>
          </DetailItem>
        </DetailRow>
        
        <Divider isDarkMode={isDarkMode} />
        
        <ButtonsContainer>
          <NotesButton isDarkMode={isDarkMode}>Notes</NotesButton>
          <AudioButton isDarkMode={isDarkMode}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="22"></line>
            </svg>
            Audio
          </AudioButton>
        </ButtonsContainer>
      </DetailsContainer>
      
      <ParticipantsTable>
        <TableHead>
          <tr>
            <Th>NAME</Th>
            <Th>ORGANIZATION</Th>
            <Th>DEPARTMENT</Th>
            <Th>EMAIL ID</Th>
          </tr>
        </TableHead>
        <tbody>
          {participants.map((participant, index) => (
            <Tr key={index} isDarkMode={isDarkMode}>
              <Td isDarkMode={isDarkMode}>{participant.name}</Td>
              <Td isDarkMode={isDarkMode}>{participant.organization}</Td>
              <Td isDarkMode={isDarkMode}>{participant.department}</Td>
              <Td isDarkMode={isDarkMode}>{participant.email}</Td>
            </Tr>
          ))}
          {participants.length === 0 && (
            <Tr isDarkMode={isDarkMode}>
              <Td colSpan="4" style={{ textAlign: 'center' }} isDarkMode={isDarkMode}>No participants</Td>
            </Tr>
          )}
        </tbody>
      </ParticipantsTable>
      
      <Pagination>
        <PageInfo isDarkMode={isDarkMode}>Rows per page: 10</PageInfo>
        <PageInfo isDarkMode={isDarkMode}>1-{participants.length} of {participants.length}</PageInfo>
      </Pagination>
    </PageContainer>
  );
};

export default MeetingDetails; 