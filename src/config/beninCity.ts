export const BENIN_CITY_WORLD = {
  name: 'Benin City',
  state: 'Edo',
  country: 'Nigeria',
  timezone: 'Africa/Lagos',
  center: { lat: 6.335, lon: 5.6037 },
  districts: [
    'Aduwawa', 'Ikpoba Hill', 'New Benin', 'Upper Mission',
    'Ring Road/City Centre', 'GRA', 'Ogida/Okhoro', 'Sakponba',
    'Ugbowo', 'Uselu', 'Ekenwan', 'Sapele Road', 'Siluko Road',
    'Airport Road', 'Ekae/Sapele Extension',
  ],
  citywidePlaces: [
    'Healthcare',
    'Education',
    'Police',
    'Justice',
    'Transport',
    'Sports',
    'Nightlife',
    'Markets',
  ],
  sports: {
    mainVenue: 'Crescent Sports Center',
    formats: ['5-a-side', '7-a-side', 'small-sided'],
  },
  prison: 'Oko Prison',
} as const
