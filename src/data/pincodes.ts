import { PincodeServiceability } from '../types'

/**
 * Comprehensive Pan-India Postal Directory
 * Covers all postal zones across India's 28 States and 8 Union Territories
 */
export const INDIAN_POSTAL_DIRECTORY: Record<string, { city: string; state: string; days: number }> = {
  // Northern Region
  '11': { city: 'New Delhi / Central Delhi', state: 'Delhi', days: 2 },
  '12': { city: 'Gurugram / Faridabad', state: 'Haryana', days: 2 },
  '13': { city: 'Ambala / Panipat / Karnal', state: 'Haryana', days: 2 },
  '14': { city: 'Ludhiana / Jalandhar', state: 'Punjab', days: 3 },
  '15': { city: 'Bathinda / Patiala', state: 'Punjab', days: 3 },
  '16': { city: 'Chandigarh', state: 'Chandigarh', days: 2 },
  '17': { city: 'Shimla / Solan / Kangra', state: 'Himachal Pradesh', days: 3 },
  '18': { city: 'Jammu / Udhampur', state: 'Jammu & Kashmir', days: 4 },
  '19': { city: 'Srinagar / Anantnag', state: 'Jammu & Kashmir', days: 4 },

  // Uttar Pradesh & Uttarakhand
  '20': { city: 'Noida / Greater Noida / Ghaziabad', state: 'Uttar Pradesh', days: 2 },
  '21': { city: 'Prayagraj (Allahabad)', state: 'Uttar Pradesh', days: 3 },
  '22': { city: 'Lucknow / Barabanki', state: 'Uttar Pradesh', days: 3 },
  '23': { city: 'Mirzapur / Sonbhadra', state: 'Uttar Pradesh', days: 3 },
  '24': { city: 'Dehradun / Haridwar / Roorkee', state: 'Uttarakhand', days: 2 },
  '25': { city: 'Meerut / Muzaffarnagar', state: 'Uttar Pradesh', days: 2 },
  '26': { city: 'Bareilly / Haldwani', state: 'Uttar Pradesh / Uttarakhand', days: 3 },
  '27': { city: 'Gorakhpur / Basti', state: 'Uttar Pradesh', days: 3 },
  '28': { city: 'Agra / Mathura / Jhansi', state: 'Uttar Pradesh', days: 2 },

  // Rajasthan & Gujarat
  '30': { city: 'Jaipur', state: 'Rajasthan', days: 2 },
  '31': { city: 'Udaipur / Bhilwara', state: 'Rajasthan', days: 3 },
  '32': { city: 'Kota / Bharatpur', state: 'Rajasthan', days: 3 },
  '33': { city: 'Bikaner / Sikar', state: 'Rajasthan', days: 3 },
  '34': { city: 'Jodhpur / Barmer', state: 'Rajasthan', days: 3 },
  '36': { city: 'Rajkot / Jamnagar', state: 'Gujarat', days: 3 },
  '37': { city: 'Kutch / Gandhidham', state: 'Gujarat', days: 3 },
  '38': { city: 'Ahmedabad / Gandhinagar', state: 'Gujarat', days: 2 },
  '39': { city: 'Surat / Vadodara / Vapi', state: 'Gujarat', days: 2 },

  // Maharashtra, Goa, MP, Chhattisgarh
  '40': { city: 'Mumbai / Thane / Navi Mumbai', state: 'Maharashtra', days: 2 },
  '41': { city: 'Pune / Satara / Solapur', state: 'Maharashtra', days: 2 },
  '42': { city: 'Nashik / Jalgaon / Dhule', state: 'Maharashtra', days: 2 },
  '43': { city: 'Chhatrapati Sambhajinagar (Aurangabad)', state: 'Maharashtra', days: 3 },
  '44': { city: 'Nagpur / Amravati', state: 'Maharashtra', days: 3 },
  '45': { city: 'Indore / Ujjain', state: 'Madhya Pradesh', days: 3 },
  '46': { city: 'Bhopal', state: 'Madhya Pradesh', days: 3 },
  '47': { city: 'Gwalior / Morena', state: 'Madhya Pradesh', days: 3 },
  '48': { city: 'Jabalpur / Rewa', state: 'Madhya Pradesh', days: 3 },
  '49': { city: 'Raipur / Bilaspur / Durg', state: 'Chhattisgarh', days: 3 },

  // Andhra Pradesh, Telangana, Karnataka
  '50': { city: 'Hyderabad / Secunderabad', state: 'Telangana', days: 2 },
  '51': { city: 'Tirupati / Kurnool / Kadapa', state: 'Andhra Pradesh', days: 3 },
  '52': { city: 'Vijayawada / Guntur', state: 'Andhra Pradesh', days: 3 },
  '53': { city: 'Visakhapatnam (Vizag)', state: 'Andhra Pradesh', days: 3 },
  '56': { city: 'Bengaluru Urban & Rural', state: 'Karnataka', days: 1 }, // Atelier Hub
  '57': { city: 'Mangaluru / Udupi / Mysuru', state: 'Karnataka', days: 2 },
  '58': { city: 'Hubballi / Belagavi / Dharwad', state: 'Karnataka', days: 2 },
  '59': { city: 'Kalaburagi / Ballari', state: 'Karnataka', days: 3 },

  // Tamil Nadu, Kerala, Puducherry
  '60': { city: 'Chennai / Kanchipuram', state: 'Tamil Nadu', days: 2 },
  '61': { city: 'Thanjavur / Nagapattinam', state: 'Tamil Nadu', days: 3 },
  '62': { city: 'Madurai / Dindigul / Tirunelveli', state: 'Tamil Nadu', days: 3 },
  '63': { city: 'Vellore / Tiruvannamalai / Salem', state: 'Tamil Nadu', days: 3 },
  '64': { city: 'Coimbatore / Tiruppur / Erode', state: 'Tamil Nadu', days: 2 },
  '67': { city: 'Kozhikode / Kannur', state: 'Kerala', days: 3 },
  '68': { city: 'Kochi / Ernakulam / Thrissur', state: 'Kerala', days: 2 },
  '69': { city: 'Thiruvananthapuram / Kollam', state: 'Kerala', days: 3 },

  // Eastern & North Eastern States
  '70': { city: 'Kolkata Metro', state: 'West Bengal', days: 3 },
  '71': { city: 'Howrah / Hooghly', state: 'West Bengal', days: 3 },
  '72': { city: 'Medinipur / Haldia', state: 'West Bengal', days: 3 },
  '73': { city: 'Siliguri / Darjeeling / Jalpaiguri', state: 'West Bengal', days: 4 },
  '74': { city: 'North 24 Parganas / Nadia', state: 'West Bengal', days: 3 },
  '75': { city: 'Bhubaneswar / Cuttack / Puri', state: 'Odisha', days: 3 },
  '76': { city: 'Berhampur / Sambalpur / Rourkela', state: 'Odisha', days: 4 },
  '77': { city: 'Balasore / Baripada', state: 'Odisha', days: 4 },
  '78': { city: 'Guwahati / Kamrup / Jorhat', state: 'Assam', days: 4 },
  '79': { city: 'Shillong / Imphal / Agartala / Aizawl', state: 'North Eastern States', days: 4 },

  // Bihar & Jharkhand
  '80': { city: 'Patna / Nalanda', state: 'Bihar', days: 3 },
  '81': { city: 'Bhagalpur / Munger / Deoghar', state: 'Bihar / Jharkhand', days: 4 },
  '82': { city: 'Gaya / Nawada / Dhanbad', state: 'Bihar / Jharkhand', days: 4 },
  '83': { city: 'Ranchi / Jamshedpur', state: 'Jharkhand', days: 3 },
  '84': { city: 'Muzaffarpur / Darbhanga / Motihari', state: 'Bihar', days: 4 },
  '85': { city: 'Purnia / Saharsa / Katihar', state: 'Bihar', days: 4 },
}

const REGIONAL_STATE_DEFAULTS: Record<string, { state: string; days: number }> = {
  '1': { state: 'Delhi / NCR / North Zone', days: 2 },
  '2': { state: 'Uttar Pradesh / Uttarakhand', days: 3 },
  '3': { state: 'Rajasthan / Gujarat', days: 3 },
  '4': { state: 'Maharashtra / MP / Goa', days: 3 },
  '5': { state: 'Karnataka / South Zone', days: 2 },
  '6': { state: 'Tamil Nadu / Kerala', days: 3 },
  '7': { state: 'Eastern & North Eastern India', days: 4 },
  '8': { state: 'Bihar / Jharkhand', days: 4 },
}

/**
 * Synchronously checks and resolves any Indian Postal PIN code
 */
export function checkIndianPincode(pincode: string): PincodeServiceability {
  const cleanPin = pincode.replace(/\D/g, '').slice(0, 6)

  // Must be 6 digits and start with 1-8
  if (cleanPin.length !== 6 || !/^[1-8][0-9]{5}$/.test(cleanPin)) {
    return {
      pincode: cleanPin,
      isServiceable: false,
      isCodAvailable: false,
      estimatedDays: 0,
      courierName: 'None',
      city: 'Invalid PIN Code',
      state: 'India',
    }
  }

  // Goa special prefix 403xxx
  if (cleanPin.startsWith('403')) {
    return {
      pincode: cleanPin,
      isServiceable: true,
      isCodAvailable: true,
      estimatedDays: 3,
      courierName: 'Delhivery Surface Express',
      city: 'Panaji / Margao',
      state: 'Goa',
    }
  }

  const prefix2 = cleanPin.substring(0, 2)
  const firstDigit = cleanPin.charAt(0)

  const match = INDIAN_POSTAL_DIRECTORY[prefix2]
  const zone = REGIONAL_STATE_DEFAULTS[firstDigit] || { state: 'India', days: 4 }

  const city = match ? match.city : 'District Delivery Hub'
  const state = match ? match.state : zone.state
  const estimatedDays = match ? match.days : zone.days

  return {
    pincode: cleanPin,
    isServiceable: true,
    isCodAvailable: true,
    estimatedDays,
    courierName: cleanPin.startsWith('56') ? 'Delhivery Local Atelier Express' : 'Delhivery Surface Express',
    city,
    state,
  }
}

/**
 * Asynchronously refines City & State using live Indian Postal API
 */
export async function lookupPincode(pincode: string): Promise<PincodeServiceability> {
  const base = checkIndianPincode(pincode)
  if (!base.isServiceable) return base

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${base.pincode}`)
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0].PostOffice?.[0]) {
        const po = data[0].PostOffice[0]
        return {
          ...base,
          city: po.District || po.Name || base.city,
          state: po.State || base.state,
        }
      }
    }
  } catch {
    // Graceful offline fallback
  }

  return base
}
