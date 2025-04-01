import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'

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

const TextArea = styled.textarea`
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  min-height: 120px;
  resize: vertical;
  
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

const MapContainer = styled.div`
  height: 300px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 15px;
  border: 1px solid #ddd;
`

const LocationButton = styled.button`
  background-color: #5538ee;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 15px;
  
  &:hover {
    background-color: #4428cc;
  }
`

const MapPlaceholder = styled.div`
  height: 300px;
  border-radius: 4px;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  margin-bottom: 15px;
`

const StatusMessage = styled.div`
  padding: 8px 12px;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: ${props => props.isError ? '#fff0f0' : '#f0f8ff'};
  color: ${props => props.isError ? '#d32f2f' : '#0288d1'};
  border: 1px solid ${props => props.isError ? '#ffcdd2' : '#bbdefb'};
  font-size: 14px;
`

const AutocompleteContainer = styled.div`
  position: relative;
  margin-bottom: 15px;
`

const SearchBoxWrapper = styled.div`
  width: 100%;
  
  input {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    
    &:focus {
      outline: none;
      border-color: #5538ee;
    }
  }
`

const MapInstructions = styled.div`
  background-color: #f0f8ff;
  border: 1px solid #bbdefb;
  border-radius: 4px;
  padding: 8px 12px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #0288d1;
`

const libraries = ['places'];

const CreateMeeting = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    meetingTitle: '',
    meetingDate: '',
    meetingTime: '',
    participants: '',
    location: '',
    travelMode: '',
    expenses: '',
    meetingAgenda: '',
    latitude: null,
    longitude: null
  })
  const [map, setMap] = useState(null)
  const [currentLocation, setCurrentLocation] = useState({
    lat: 28.6139, // Default coordinates (Delhi)
    lng: 77.2090
  })
  const [statusMessage, setStatusMessage] = useState(null)
  const [marker, setMarker] = useState(null)
  const [searchBox, setSearchBox] = useState(null)
  
  // Load Google Maps API with Places library
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCbCo-zPDHPNOBD0qQArRclzuUZLKiL7UM',
    libraries,
  })

  const onMapLoad = useCallback(function callback(map) {
    setMap(map)
    
    // Create a standard marker
    if (window.google) {
      const newMarker = new window.google.maps.Marker({
        position: currentLocation,
        map: map,
        draggable: true,
        title: "Meeting location"
      })
      
      // Add drag event listener
      newMarker.addListener('dragend', () => {
        const newPosition = newMarker.getPosition()
        const newLocation = {
          lat: newPosition.lat(),
          lng: newPosition.lng()
        }
        setCurrentLocation(newLocation)
        
        // Update form data with coordinates
        setFormData(prev => ({
          ...prev,
          latitude: newLocation.lat,
          longitude: newLocation.lng
        }))
        
        // Try to get address for the new location
        tryReverseGeocode(newLocation)
      })
      
      // Add click listener to the map itself
      map.addListener('click', (event) => {
        const clickedLocation = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        }
        
        // Move marker to clicked location
        newMarker.setPosition(clickedLocation)
        
        // Update current location and form data
        setCurrentLocation(clickedLocation)
        setFormData(prev => ({
          ...prev,
          latitude: clickedLocation.lat,
          longitude: clickedLocation.lng
        }))
        
        // Get address for the clicked location
        tryReverseGeocode(clickedLocation)
      })
      
      setMarker(newMarker)
    }
  }, [currentLocation])

  // Initialize search box when maps is loaded
  useEffect(() => {
    if (isLoaded && window.google && window.google.maps && !searchBox) {
      // Set up the search box when Google Maps is loaded
      try {
        const input = document.getElementById('pac-input');
        if (input && window.google.maps.places) {
          const newSearchBox = new window.google.maps.places.Autocomplete(input);
          setSearchBox(newSearchBox);
          
          // Add listener for place selection
          newSearchBox.addListener('place_changed', () => {
            const place = newSearchBox.getPlace();
            
            if (place && place.geometry && place.geometry.location) {
              const newLocation = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              };
              
              // Update map center and marker
              setCurrentLocation(newLocation);
              
              if (marker && map) {
                marker.setPosition(newLocation);
                map.setCenter(newLocation);
              }
              
              // Update form data
              setFormData(prev => ({
                ...prev,
                location: place.formatted_address || input.value,
                latitude: newLocation.lat,
                longitude: newLocation.lng
              }));
              
              setStatusMessage({
                text: "Address selected!",
                error: false
              });
            }
          });
        }
      } catch (err) {
        console.error('Error initializing search box:', err);
      }
    }
  }, [isLoaded, marker, map, searchBox]);

  const onMapUnmount = useCallback(function callback() {
    if (marker) {
      marker.setMap(null)
    }
    setMap(null)
  }, [marker])

  // Get current location
  const getCurrentLocation = () => {
    setStatusMessage({
      text: "Getting your current location...",
      error: false
    })
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setCurrentLocation(location)
          
          // Update form data with coordinates
          setFormData(prev => ({
            ...prev,
            latitude: location.lat,
            longitude: location.lng
          }))
          
          // Update marker position
          if (marker) {
            marker.setPosition(location)
          }
          
          // Try to get the address using geocoding
          tryReverseGeocode(location)
        },
        (error) => {
          console.error('Error getting location:', error)
          setStatusMessage({
            text: `Error getting location: ${error.message}`,
            error: true
          })
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
      setStatusMessage({
        text: "Geolocation is not supported by this browser.",
        error: true
      })
    }
  }

  // Try to get address from coordinates
  const tryReverseGeocode = (location) => {
    setStatusMessage({
      text: "Retrieving address...",
      error: false
    })

    // Try with Google Maps API first
    if (window.google && window.google.maps) {
      try {
        const geocoder = new window.google.maps.Geocoder()
        geocoder.geocode({ location }, (results, status) => {
          if (status === 'OK' && results[0]) {
            setFormData(prev => ({
              ...prev,
              location: results[0].formatted_address
            }))
            setStatusMessage({
              text: "Address found!",
              error: false
            })
          } else {
            console.warn('Google geocoding was not successful:', status)
            // Try OpenStreetMap Nominatim as fallback
            fetchAddressFromNominatim(location);
          }
        })
      } catch (error) {
        console.error('Error during Google geocoding:', error)
        // Try OpenStreetMap Nominatim as fallback
        fetchAddressFromNominatim(location);
      }
    } else {
      // Google Maps API not available, try Nominatim directly
      fetchAddressFromNominatim(location);
    }
  }

  // Use OpenStreetMap's Nominatim for geocoding (doesn't require API key)
  const fetchAddressFromNominatim = async (location) => {
    try {
      setStatusMessage({
        text: "Trying alternative geocoding service...",
        error: false
      })
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'FieldSense Meeting App' // Required by Nominatim's terms
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.display_name) {
        setFormData(prev => ({
          ...prev,
          location: data.display_name
        }));
        setStatusMessage({
          text: "Address found using OpenStreetMap!",
          error: false
        });
      } else {
        throw new Error('No address found');
      }
    } catch (error) {
      console.error('Error with Nominatim geocoding:', error);
      // Final fallback to coordinates
      setFormData(prev => ({
        ...prev,
        location: `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
      }));
      setStatusMessage({
        text: "Could not retrieve address. Using coordinates instead.",
        error: true
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Update the location input directly
  const handleLocationChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: value
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/meetings`, formData)
      navigate('/management')
    } catch (error) {
      console.error('Error creating meeting:', error)
    }
  }

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  return (
    <PageContainer>
      <PageHeader>Create Meeting</PageHeader>
      
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label>Meeting Title</Label>
              <Input 
                type="text" 
                name="meetingTitle" 
                placeholder="Meeting Title" 
                value={formData.meetingTitle} 
                onChange={handleChange} 
                required 
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Meeting Date</Label>
              <Input 
                type="date" 
                name="meetingDate" 
                value={formData.meetingDate} 
                onChange={handleChange} 
                required 
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Meeting Time</Label>
              <Input 
                type="time" 
                name="meetingTime" 
                value={formData.meetingTime} 
                onChange={handleChange} 
                required 
              />
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label>Participants</Label>
              <Input 
                type="text" 
                name="participants" 
                placeholder="Participants" 
                value={formData.participants} 
                onChange={handleChange} 
              />
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <Label>Location</Label>
            <LocationButton type="button" onClick={getCurrentLocation}>
              Get Current Location
            </LocationButton>
            
            {/* {statusMessage && (
              <StatusMessage isError={statusMessage.error}>
                {statusMessage.text}
              </StatusMessage>
            )} */}
            
            {isLoaded && (
              <>
                <MapInstructions>
                  Click anywhere on the map to select a location or search for an address below.
                </MapInstructions>
                
                <AutocompleteContainer>
                  <SearchBoxWrapper>
                    <input
                      id="pac-input"
                      type="text"
                      placeholder="Write your address"
                      value={formData.location}
                      onChange={handleLocationChange}
                    />
                  </SearchBoxWrapper>
                </AutocompleteContainer>
                
                <MapContainer>
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={currentLocation}
                    zoom={14}
                    onLoad={onMapLoad}
                    onUnmount={onMapUnmount}
                  >
                    {/* Marker is created programmatically */}
                  </GoogleMap>
                </MapContainer>
              </>
            )}
            
            {!isLoaded && (
              <MapPlaceholder>
                Loading map...
              </MapPlaceholder>
            )}
          </FormGroup>
          
          <FormRow>
            <FormGroup>
              <Label>Travel Mode</Label>
              <Select 
                name="travelMode" 
                value={formData.travelMode} 
                onChange={handleChange}
              >
                <option value="">Select Travel Mode</option>
                <option value="Car">Car</option>
                <option value="Public Transit">Public Transit</option>
                <option value="Flight">Flight</option>
                <option value="Train">Train</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>Expenses</Label>
              <Select 
                name="expenses" 
                value={formData.expenses} 
                onChange={handleChange}
              >
                <option value="">Select Expenses</option>
                <option value="Transportation">Transportation</option>
                <option value="Meals">Meals</option>
                <option value="Accommodation">Accommodation</option>
                <option value="Other">Other</option>
              </Select>
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <Label>Meeting Agenda</Label>
            <TextArea 
              name="meetingAgenda" 
              placeholder="Meeting Agenda" 
              value={formData.meetingAgenda} 
              onChange={handleChange} 
            />
          </FormGroup>
          
          <Button type="submit">Create Meeting</Button>
        </form>
      </FormContainer>
    </PageContainer>
  )
}

export default CreateMeeting 