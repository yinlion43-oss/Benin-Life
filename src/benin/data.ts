export type BeninCategory = 'hotel' | 'restaurant' | 'nightlife' | 'shopping' | 'bank' | 'hospital' | 'school' | 'government' | 'market' | 'landmark' | 'transport' | 'estate'
export interface BeninArea { id:string; name:string; lat:number; lon:number; type:'area'|'corridor' }
export interface BeninRoad { id:string; name:string; points:[number,number][]; major?:boolean }
export interface BeninLocation { id:string; name:string; category:BeninCategory; area:string; road?:string; lat:number; lon:number; rating?:number; playable?:boolean }
export const BENIN_CITY = { name:'Benin City', state:'Edo', country:'Nigeria', center:{lat:6.335,lon:5.6037}, bounds:{south:6.25,west:5.50,north:6.42,east:5.72} } as const
export const BENIN_AREAS: BeninArea[] = [
  ['ring-road','Ring Road / Kings Square',6.335,5.6037,'area'],['new-benin','New Benin',6.329,5.626,'area'],['gra','GRA',6.338,5.615,'area'],['ugbowo','Ugbowo',6.371,5.608,'area'],['uselu','Uselu',6.356,5.593,'area'],
  ['sapele-road','Sapele Road',6.337,5.575,'corridor'],['airport-road','Airport Road',6.335,5.650,'corridor'],['ikpoba-hill','Ikpoba Hill',6.345,5.666,'area'],['upper-mission','Upper Mission',6.360,5.635,'area'],['aduwawa','Aduwawa',6.377,5.676,'area'],
  ['ogida','Ogida',6.349,5.587,'area'],['okhoro','Okhoro',6.365,5.568,'area'],['sakponba','Sakponba',6.326,5.655,'corridor'],['ekenhuan','Ekenhuan',6.307,5.575,'corridor'],['siluko','Siluko',6.304,5.548,'corridor'],
  ['ugbor','Ugbor',6.318,5.602,'area'],['ekae','Ekae',6.354,5.548,'area'],['upper-eweka','Upper Eweka',6.345,5.640,'area'],['oregbini','Oregbeni',6.349,5.675,'area'],['ogbeson','Ogbeson',6.361,5.666,'area']
].map(([id,name,lat,lon,type])=>({id,name,lat,lon,type}))
export const BENIN_ROADS: BeninRoad[] = [
  ['ring','Ring Road / Kings Square',[[6.335,5.604],[6.348,5.625],[6.355,5.647],[6.348,5.670],[6.330,5.679],[6.310,5.665],[6.300,5.640],[6.302,5.610],[6.315,5.585],[6.335,5.604]],true],
  ['akpakpava','Akpakpava Road',[[6.335,5.604],[6.333,5.618],[6.331,5.635]],true],['airport','Airport Road / Murtala Muhammed Way',[[6.335,5.604],[6.337,5.625],[6.338,5.650],[6.340,5.675]],true],
  ['sapele','Benin-Sapele Road',[[6.335,5.604],[6.333,5.585],[6.331,5.565],[6.327,5.540]],true],['ugbowo','Ugbowo / Lagos Road',[[6.335,5.604],[6.350,5.610],[6.365,5.610],[6.382,5.608]],true],
  ['ekenhuan','Ekenhuan Road',[[6.335,5.604],[6.322,5.590],[6.307,5.575],[6.292,5.560]],true],['siluko','Siluko Road',[[6.335,5.604],[6.320,5.575],[6.304,5.548],[6.285,5.525]],true],
  ['sakponba','Sakponba Road',[[6.335,5.604],[6.330,5.625],[6.326,5.655],[6.320,5.680]],true],['upper-mission','Upper Mission Road',[[6.335,5.604],[6.350,5.620],[6.365,5.638],[6.382,5.655]],true],
  ['boundary','Boundary Road',[[6.348,5.625],[6.365,5.625],[6.382,5.625]],true],['ihama','Ihama Road',[[6.335,5.604],[6.338,5.615],[6.341,5.628]]],['ugbor','Ugbor Road',[[6.335,5.604],[6.324,5.600],[6.314,5.598]]],
  ['first-circular','First Circular Road',[[6.335,5.604],[6.345,5.615],[6.350,5.625]]],['second-circular','Second Circular Road',[[6.335,5.604],[6.350,5.635],[6.360,5.650]]],['third-circular','Third Circular Road',[[6.335,5.604],[6.360,5.660],[6.375,5.675]]]
].map(([id,name,points,major])=>({id,name,points,major}))
export const BENIN_LOCATIONS: BeninLocation[] = [
 {id:'first-bank-kings-square',name:"First Bank - Benin King's Square Branch",category:'bank',area:'ring-road',road:'Ring Road / Kings Square',lat:6.3349,lon:5.6039,rating:4.2,playable:true},
 {id:'shoprite-benin-mall',name:'Shoprite - Benin City Mall',category:'shopping',area:'sapele-road',road:'Benin-Sapele Road',lat:6.333,lon:5.578,rating:4.4,playable:true},
 {id:'market-square-oka',name:'Market Square',category:'shopping',area:'sapele-road',road:'Benin-Sapele Road',lat:6.3338,lon:5.5788,rating:4.3,playable:true},
 {id:'edo-specialist-hospital',name:'Edo Specialist Hospital',category:'hospital',area:'sapele-road',road:'Benin-Sapele Road',lat:6.3342,lon:5.5798,rating:4.5,playable:true},
 {id:'ubth',name:'University of Benin Teaching Hospital',category:'hospital',area:'uselu',road:'Benin-Lagos Express Road',lat:6.3538,lon:5.592,rating:4.2,playable:true},
 {id:'uniben',name:'University of Benin',category:'school',area:'ugbowo',road:'Benin-Ore Road',lat:6.397,lon:5.615,rating:4.6,playable:true},
 {id:'proteahotel',name:'Protea Hotel Benin City Select Emotan',category:'hotel',area:'sapele-road',road:'Benin-Sapele Road',lat:6.3335,lon:5.577,rating:4.4,playable:true},
 {id:'grandview',name:'Grandview Hotel & Apartment',category:'hotel',area:'sapele-road',road:'Benin-Sapele Road',lat:6.337,lon:5.5755,rating:4.1,playable:true},
 {id:'vertus',name:'VERTUS HOTEL AND SUITES',category:'hotel',area:'gra',road:'Ihama Road',lat:6.3378,lon:5.615,rating:4.3,playable:true},
 {id:'morzi',name:'Morzi Hotels & Suites',category:'hotel',area:'ugbor',road:'Ugbor Road',lat:6.3185,lon:5.602,rating:4.2,playable:true},
 {id:'club-vibes',name:'CLUB VIBES',category:'nightlife',area:'gra',road:'Ihama Road',lat:6.339,lon:5.616,rating:4,playable:true},
 {id:'cube-nightlife',name:'CUBE NIGHTLIFE',category:'nightlife',area:'gra',road:'Ihama Road',lat:6.34,lon:5.617,rating:4.1,playable:true},
 {id:'seven-restaurant',name:'Seven Restaurant Benin',category:'restaurant',area:'ugbor',road:'First Ugbor Road',lat:6.318,lon:5.603,rating:4.4,playable:true},
 {id:'home-away',name:'Home & Away Restaurant Ikpokpan',category:'restaurant',area:'gra',road:'Ikpokpan Road',lat:6.3275,lon:5.6165,rating:4.3,playable:true},
 {id:'edo-college',name:'Edo College',category:'school',area:'new-benin',road:'Murtala Muhammed Way',lat:6.329,lon:5.625,rating:4.4,playable:true},
 {id:'our-lady-hope',name:'Our Lady of Hope Montessori Schools',category:'school',area:'new-benin',road:'Second East Circular Road',lat:6.3295,lon:5.628,rating:4.2,playable:true},
 {id:'kings-square',name:"Kings Square / Oba's Palace axis",category:'landmark',area:'ring-road',road:'Ring Road / Kings Square',lat:6.335,lon:5.6037,rating:4.8,playable:true}
]
export const categoryLabel=(category:BeninCategory):string=>({hotel:'Hotels',restaurant:'Restaurants',nightlife:'Nightlife',shopping:'Shopping',bank:'Banks',hospital:'Healthcare',school:'Schools',government:'Government',market:'Markets',landmark:'Landmarks',transport:'Transport',estate:'Estates'}[category])