import { PincodeServiceability } from '../types'

/**
 * Intelligent Pincode validation & logistics simulation
 * Simulates real Delhivery / Shiprocket pincode database
 */
export function checkIndianPincode(pincode: string): PincodeServiceability {
  const cleanPin = pincode.trim()

  if (!/^[1-9][0-9]{5}$/.test(cleanPin)) {
    return {
      pincode: cleanPin,
      isServiceable: false,
      isCodAvailable: false,
      estimatedDays: 0,
      courierName: 'None',
      city: 'Invalid PIN',
      state: 'Invalid PIN',
    }
  }

  const prefix2 = cleanPin.substring(0, 2)
  let city = 'Metro Hub'
  let state = 'India'
  let estimatedDays = 4

  // Sample mapping of major Indian postal zones
  switch (prefix2) {
    case '11':
      city = 'New Delhi'
      state = 'Delhi'
      estimatedDays = 2
      break
    case '12':
    case '13':
      city = 'Gurugram / Haryana'
      state = 'Haryana'
      estimatedDays = 2
      break
    case '20':
    case '21':
    case '22':
      city = 'Noida / Lucknow'
      state = 'Uttar Pradesh'
      estimatedDays = 3
      break
    case '40':
    case '41':
    case '42':
      city = 'Mumbai / Pune'
      state = 'Maharashtra'
      estimatedDays = 3
      break
    case '56':
    case '57':
      city = 'Bengaluru'
      state = 'Karnataka'
      estimatedDays = 3
      break
    case '50':
    case '51':
      city = 'Hyderabad'
      state = 'Telangana'
      estimatedDays = 3
      break
    case '60':
    case '61':
    case '62':
      city = 'Chennai'
      state = 'Tamil Nadu'
      estimatedDays = 3
      break
    case '70':
    case '71':
      city = 'Kolkata'
      state = 'West Bengal'
      estimatedDays = 4
      break
    case '38':
    case '39':
      city = 'Ahmedabad / Surat'
      state = 'Gujarat'
      estimatedDays = 3
      break
    case '30':
    case '31':
      city = 'Jaipur'
      state = 'Rajasthan'
      estimatedDays = 3
      break
    case '68':
    case '69':
      city = 'Kochi / Trivandrum'
      state = 'Kerala'
      estimatedDays = 4
      break
    default:
      city = 'Standard Delivery Zone'
      state = 'India'
      estimatedDays = 5
      break
  }

  return {
    pincode: cleanPin,
    isServiceable: true,
    isCodAvailable: true,
    estimatedDays,
    courierName: 'Delhivery Express Surface',
    city,
    state,
  }
}
