import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { ThemeContext } from '../components/Sidebar';

const PageContainer = styled.div`
  padding: 20px;
  background-color: ${props => props.isDarkMode ? '#121212' : 'transparent'};
  color: ${props => props.isDarkMode ? '#f5f5f5' : 'inherit'};
  font-size: 14px;
`;

const Header = styled.div`
  background: linear-gradient(90deg, #5538ee 0%, #f0ac3f 100%);
  border-radius: 8px;
  color: white;
  padding: 12px 25px;
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 25px;
  text-align: center;
`;

const DetailsContainer = styled.div`
  background: ${props => props.isDarkMode ? '#1e1e1e' : 'white'};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, ${props => props.isDarkMode ? '0.3' : '0.05'});
  border: 1px solid ${props => props.isDarkMode ? '#333' : '#eee'};
  color: ${props => props.isDarkMode ? '#f5f5f5' : 'inherit'};
  font-size: 13px;
`;

const DetailRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 12px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const DetailLabel = styled.div`
  font-weight: 600;
  margin-right: 8px;
  color: ${props => props.isDarkMode ? '#bbdefb' : '#333'};
  min-width: 180px;
  flex-shrink: 0;
  font-size: 13px;
`;

const DetailValue = styled.div`
  color: ${props => props.isDarkMode ? '#f5f5f5' : '#555'};
  font-size: 13px;
`;

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background-color: ${props => props.isDarkMode ? '#333' : '#eee'};
  margin: 15px 0;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
  gap: 12px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 13px;
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

const ActivitySection = styled.div`
  margin-top: 25px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  margin-bottom: 12px;
  color: ${props => props.isDarkMode ? '#bbdefb' : '#333'};
`;

const ActivityTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
  border-radius: 8px;
  overflow: hidden;
  font-size: 13px;
`;

const TableHead = styled.thead`
  background: linear-gradient(90deg, #4a47a3 0%, #f0ac3f 100%);
  color: white;
`;

const Th = styled.th`
  padding: 10px 12px;
  text-align: left;
  font-weight: 500;
  font-size: 12px;
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
  padding: 8px 12px;
  border-bottom: 1px solid ${props => props.isDarkMode ? '#333' : '#eee'};
  color: ${props => props.isDarkMode ? '#f5f5f5' : 'inherit'};
  font-size: 12px;
`;

const LeadDetails = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/leads/${id}`);
        setLead(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lead:', error);
        setLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  if (loading) {
    return <PageContainer isDarkMode={isDarkMode}>Loading lead details...</PageContainer>;
  }

  if (!lead) {
    return <PageContainer isDarkMode={isDarkMode}>Lead not found</PageContainer>;
  }

  // Mock activity data (in a real app, you would fetch this)
  const activities = [
    { 
      date: '2023-03-15',
      time: '10:30 AM',
      type: 'Call',
      description: 'Discussed product pricing',
      actionItems: 'Send proposal by end of week',
      nextFollowUp: '2023-03-22'
    },
    { 
      date: '2023-03-10',
      time: '2:00 PM',
      type: 'Email',
      description: 'Sent product information',
      actionItems: 'Schedule a call',
      nextFollowUp: '2023-03-15'
    }
  ];

  return (
    <PageContainer isDarkMode={isDarkMode}>
      <Header>Field Sense Lead Details</Header>
      
      <DetailsContainer isDarkMode={isDarkMode}>
        <DetailRow>
          <DetailItem>
            <DetailLabel isDarkMode={isDarkMode}>Lead Name:</DetailLabel>
            <DetailValue isDarkMode={isDarkMode}>{lead.leadName}</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel isDarkMode={isDarkMode}>Lead Source :</DetailLabel>
            <DetailValue isDarkMode={isDarkMode}>{lead.leadSource}</DetailValue>
          </DetailItem>
        </DetailRow>
        
        <DetailRow>  
          <DetailItem>
            <DetailLabel isDarkMode={isDarkMode}>Company Name :</DetailLabel>
            <DetailValue isDarkMode={isDarkMode}>{lead.companyName}</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel isDarkMode={isDarkMode}>Lead Status :</DetailLabel>
            <DetailValue isDarkMode={isDarkMode}>{lead.leadStatus}</DetailValue>
          </DetailItem>
        </DetailRow>

        <DetailRow>
          <DetailItem>
            <DetailLabel isDarkMode={isDarkMode}>Contact Email:</DetailLabel>
            <DetailValue isDarkMode={isDarkMode}>{lead.contactEmail}</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel isDarkMode={isDarkMode}>Last Contact Date :</DetailLabel>
            <DetailValue isDarkMode={isDarkMode}>{lead.lastContactDate}</DetailValue>
          </DetailItem>
        </DetailRow>
        
        <DetailRow>
          <DetailItem>
            <DetailLabel isDarkMode={isDarkMode}>Contact Phone:</DetailLabel>
            <DetailValue isDarkMode={isDarkMode}>{lead.contactPhone}</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel isDarkMode={isDarkMode}>Assigned Sales Representative :</DetailLabel>
            <DetailValue isDarkMode={isDarkMode}>{lead.assignedSalesRep}</DetailValue>
          </DetailItem>
        </DetailRow>
        
        <DetailRow>
          <DetailItem>
            <DetailLabel isDarkMode={isDarkMode}>Next Follow-up Date :</DetailLabel>
            <DetailValue isDarkMode={isDarkMode}>{lead.nextFollowUpDate}</DetailValue>
          </DetailItem>
        </DetailRow>
      </DetailsContainer>
      
      <ActivitySection>
        <SectionTitle isDarkMode={isDarkMode}>Activity History</SectionTitle>
        
        <ActivityTable>
          <TableHead>
            <tr>
              <Th>DATE</Th>
              <Th>TIME</Th>
              <Th>TYPE</Th>
              <Th>DESCRIPTION</Th>
              <Th>ACTION ITEMS</Th>
              <Th>NEXT FOLLOW-UP</Th>
            </tr>
          </TableHead>
          <tbody>
            {activities.map((activity, index) => (
              <Tr key={index} isDarkMode={isDarkMode}>
                <Td isDarkMode={isDarkMode}>{activity.date}</Td>
                <Td isDarkMode={isDarkMode}>{activity.time}</Td>
                <Td isDarkMode={isDarkMode}>{activity.type}</Td>
                <Td isDarkMode={isDarkMode}>{activity.description}</Td>
                <Td isDarkMode={isDarkMode}>{activity.actionItems}</Td>
                <Td isDarkMode={isDarkMode}>{activity.nextFollowUp}</Td>
              </Tr>
            ))}
            {activities.length === 0 && (
              <Tr isDarkMode={isDarkMode}>
                <Td colSpan="6" style={{ textAlign: 'center' }} isDarkMode={isDarkMode}>No activities</Td>
              </Tr>
            )}
          </tbody>
        </ActivityTable>
      </ActivitySection>
    </PageContainer>
  );
};

export default LeadDetails; 