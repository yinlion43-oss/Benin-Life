export interface BeninJob { id:string; title:string; employer:string; area:string; salary:number; hours:string; skill?:string }
export interface BeninSave { version:1; updatedAt:string; player:{name:string; username:string; age:number}; wallet:{balance:number; transactions:{id:string;label:string;amount:number;at:string}[]}; job:{id:string|null; title:string|null}; home:{tier:string; area:string} }
export const STARTING_NAIRA=25000
export const BENIN_JOBS:BeninJob[]=[
{id:'shop-assistant',title:'Shop Assistant',employer:'Benin Retail',area:'New Benin',salary:18000,hours:'09:00–17:00'},
{id:'waiter',title:'Waiter',employer:'Benin Hospitality',area:'GRA',salary:22000,hours:'12:00–20:00'},
{id:'security',title:'Security Officer',employer:'Private Estate',area:'Upper Mission',salary:30000,hours:'07:00–19:00'},
{id:'driver',title:'Driver',employer:'City Transport',area:'Ring Road',salary:45000,hours:'08:00–18:00',skill:'Driving'},
{id:'receptionist',title:'Receptionist',employer:'Benin Hotel Group',area:'GRA',salary:38000,hours:'08:00–16:00'},
{id:'teacher',title:'Teacher',employer:'Edo Private School',area:'Ugbowo',salary:65000,hours:'07:30–15:30',skill:'Education'}
]
export const newSave=(name='New Citizen',username='newcitizen'):BeninSave=>({version:1,updatedAt:new Date().toISOString(),player:{name,username,age:18},wallet:{balance:STARTING_NAIRA,transactions:[{id:'welcome',label:'Starter cash',amount:STARTING_NAIRA,at:new Date().toISOString()}]},job:{id:null,title:null},home:{tier:'Room',area:'Ring Road / Kings Square'}})
export function loadBeninSave():BeninSave|null{try{const raw=localStorage.getItem('benin-life-save');return raw?JSON.parse(raw) as BeninSave:null}catch{return null}}
export function saveBeninGame(save:BeninSave):void{save.updatedAt=new Date().toISOString();localStorage.setItem('benin-life-save',JSON.stringify(save))}
export function money(amount:number):string{return `₦${Math.round(amount).toLocaleString('en-NG')}`}
export function workDay(save:BeninSave,job:BeninJob):BeninSave{const next=structuredClone(save) as BeninSave;next.job={id:job.id,title:job.title};next.wallet.balance+=job.salary;next.wallet.transactions.unshift({id:`shift-${Date.now()}`,label:`Worked: ${job.title}`,amount:job.salary,at:new Date().toISOString()});saveBeninGame(next);return next}