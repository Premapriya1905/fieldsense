import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios'

const PageContainer = styled.div`
  padding: 20px;
`

const PageHeader = styled.div`
  background: linear-gradient(90deg, #5538ee 0%, #f0ac3f 100%);
  border-radius: 8px;
  color: white;
  padding: 15px 30px;
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 30px;
  text-align: center;
`

const FormContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
`

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`

const Label = styled.label`
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
`

const Input = styled.input`
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #5538ee;
  }
`

const Select = styled.select`
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #5538ee;
  }
`

const Button = styled.button`
  background-color: #000;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: block;
  margin: 30px auto 0;
  
  &:hover {
    background-color: #222;
  }
`

const CreateLead = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    leadName: '',
    leadSource: '',
    contactPhone: '',
    contactEmail: '',
    companyName: '',
    leadStatus: 'active',
    assignedSalesRep: '',
    lastContactDate: '',
    nextFollowUpDate: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      console.log("Submitting form data:", formData);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/leads`, formData);
      console.log("Lead created successfully:", response.data);
      navigate('/management');
    } catch (error) {
      console.error('Error creating lead:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server error data:', error.response.data);
        console.error('Status code:', error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
    }
  }

  return (
    <PageContainer>
      <PageHeader>Create Leads</PageHeader>
      
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label>Lead Name</Label>
              <Input 
                type="text" 
                name="leadName" 
                placeholder="Lead Name" 
                value={formData.leadName} 
                onChange={handleChange} 
                required 
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Lead Source</Label>
              <Input 
                type="text" 
                name="leadSource" 
                placeholder="Lead Source" 
                value={formData.leadSource} 
                onChange={handleChange} 
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Contact Phone</Label>
              <Input 
                type="tel" 
                name="contactPhone" 
                placeholder="Phone" 
                value={formData.contactPhone} 
                onChange={handleChange} 
              />
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label>Contact Email</Label>
              <Input 
                type="email" 
                name="contactEmail" 
                placeholder="Email" 
                value={formData.contactEmail} 
                onChange={handleChange} 
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Company Name</Label>
              <Input 
                type="text" 
                name="companyName" 
                placeholder="Company Name" 
                value={formData.companyName} 
                onChange={handleChange} 
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Lead Status</Label>
              <Select 
                name="leadStatus" 
                value={formData.leadStatus} 
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="onHold">On Hold</option>
                <option value="lost">Lost</option>
                <option value="converted">Converted</option>
              </Select>
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label>Assigned Sales Representative</Label>
              <Input 
                type="text" 
                name="assignedSalesRep" 
                placeholder="Assigned Sales Representative" 
                value={formData.assignedSalesRep} 
                onChange={handleChange} 
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Last Contact Date</Label>
              <Input 
                type="date" 
                name="lastContactDate" 
                value={formData.lastContactDate} 
                onChange={handleChange} 
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Next Follow-up Date</Label>
              <Input 
                type="date" 
                name="nextFollowUpDate" 
                value={formData.nextFollowUpDate} 
                onChange={handleChange} 
              />
            </FormGroup>
          </FormRow>
          
          <Button type="submit">Create Leads</Button>
        </form>
      </FormContainer>
    </PageContainer>
  )
}

export default CreateLead 