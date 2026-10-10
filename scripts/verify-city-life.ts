import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { regionKitFor } from '../src/world/regions/kits.ts'

const main = readFileSync(new URL('../main.ts', import.meta.url), 'utf8')
const lifePage = readFileSync(new URL('../src/features/life/BeninLifePage.vue', import.meta.url), 'utf8')
const phonePage = readFileSync(new URL('../src/features/phone/PhonePage.vue', import.meta.url), 'utf8')
const streetLife = readFileSync(new URL('../src/world/regions/streetLife.ts', import.meta.url), 'utf8')

assert.match(main, /path: '\/map', component: \(\) => import\('\.\/src\/features\/map\/MapPage\.vue'\)/, 'the map route must use the connected live map')
assert.match(main, /path: '\/wallet', redirect: '\/phone\/bank'/, 'wallet must lead to the service-backed bank instead of a local-only balance')
assert.match(lifePage, /from '\.\.\/\.\.\/state\/world\.ts'/, 'City Life must reflect the actual game world')
assert.doesNotMatch(lifePage, /localStorage|workDay\(|newSave\(/, 'City Life must not mint local-only money or a disconnected save')
assert.match(lifePage, /to: '\/work'/, 'City Life links into playable shifts')
assert.match(lifePage, /to: '\/map'/, 'City Life links into the connected map')
assert.match(phonePage, /route: '\/life'/, 'the phone Activities app must open City Life')
assert.match(streetLife, /low: 2, medium: 5, high: 7/, 'street activity grows with the graphics quality tier')

const benin = regionKitFor('NG', 'Benin City')
assert.equal(benin?.id, 'benin-city', 'Benin City gets its own regional dressing')
assert.equal(benin?.profile, 'market', 'Benin City uses the Nigerian market-street profile')
assert.ok((benin?.density ?? 0) > (regionKitFor('NG', 'Unknown Nigerian Area')?.density ?? 1), 'the Benin City kit adds more street detail than the generic fallback')
assert.ok(['danfo', 'keke', 'okada', 'stall-red', 'stall-green', 'pos-kiosk'].every(model => benin?.models.includes(model as never)), 'the city kit keeps local transport and roadside commerce assets')

console.log('PASS connected City Life routes, real-world state, and Benin City street kit')
