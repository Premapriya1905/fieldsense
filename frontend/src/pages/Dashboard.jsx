import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios'

const DashboardContainer = styled.div`
  padding: 20px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`

const Title = styled.h1`
  font-size: 28px;
  color: #333;
  margin: 0;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`

const StatCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`

const StatTitle = styled.h3`
  font-size: 16px;
  color: #666;
  margin: 0 0 10px 0;
`

const StatValue = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: #333;
`

const QuickLinksContainer = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 15px;
`

const QuickLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  background: linear-gradient(90deg, #6a5fff 0%, #9f8bff 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(159, 139, 255, 0.3);
  }
`

const Dashboard = () => {
  const [stats, setStats] = useState({
    leads: 0,
    meetings: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leadsResponse = await axios.get('http://localhost:5000/api/leads')
        const meetingsResponse = await axios.get('http://localhost:5000/api/meetings')
        
        setStats({
          leads: leadsResponse.data.length,
          meetings: meetingsResponse.data.length,
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }
    
    fetchData()
  }, [])

  return (
    <DashboardContainer>
      <Header>
        <Title>Dashboard</Title>
        <QuickLinksContainer>
          <QuickLink to="/leads/create">Create Lead</QuickLink>
          <QuickLink to="/meetings/create">Create Meeting</QuickLink>
          <QuickLink to="/management">Manage All</QuickLink>
        </QuickLinksContainer>
      </Header>
      
      <StatsGrid>
        <StatCard>
          <StatTitle>Total Leads</StatTitle>
          <StatValue>{stats.leads}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Total Meetings</StatTitle>
          <StatValue>{stats.meetings}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Active Leads</StatTitle>
          <StatValue>0</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Upcoming Meetings</StatTitle>
          <StatValue>0</StatValue>
        </StatCard>
      </StatsGrid>
    </DashboardContainer>
  )
}

export default Dashboard 