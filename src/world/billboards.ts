import * as THREE from 'three'
import type { District, Road } from '../geo/district.ts'
import type { Vec2 } from '../shared/geo.ts'

type Quality = 'low' | 'medium' | 'high'

const BUDGET: Record<Quality, { radius: number; count: number; spacing: number }> = {
  low: { radius: 300, count: 8, spacing: 210 },
  medium: { radius: 650, count: 16, spacing: 175 },
  high: { radius: 1100, count: 28, spacing: 145 },
}

const ADS = [
  { brand: 'BENIN LIFE', line: 'Live the city. Live your story.', mark: 'BL' },
  { brand: 'EDO FRESH', line: 'Taste of home, every day.', mark: 'EF' },
  { brand: 'GUILD MOBILE', line: 'Connect. Play. Move.', mark: 'GM' },
  { brand: 'ROYAL MOTORS', line: 'Your next ride starts here.', mark: 'RM' },
  { brand: 'CITY MALL', line: 'Shop • Eat • Enjoy', mark: 'CM' },
  { brand: 'NAIJA FM', line: 'Music, news & city life.', mark: 'NF' },
  { brand: 'HOMEBASE', line: 'Make your place yours.', mark: 'HB' },
  { brand: 'EKO ENERGY', line: 'Powering everyday life.', mark: 'EE' },
]

function hash(a: number, b: number, c = 0): number {
  let value = Math.imul(Math.round(a * 7.1), 73_856_093) ^ Math.imul(Math.round(b * 7.1), 19_349_663) ^ Math.imul(c + 1, 83_492_791)
  value = Math.imul(value ^ (value >>> 13), 0x5bd1e995)
  return (value ^ (value >>> 15)) >>> 0
}

function unit(seed: number): number {
  let value = seed >>> 0
  value = Math.imul(value ^ (value >>> 16), 0x21f0aaad)
  value = Math.imul(value ^ (value >>> 15), 0x735a2d97)
  return ((value ^ (value >>> 15)) >>> 0) / 4_294_967_296
}

function makeTexture(ad: typeof ADS[number], seed: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  const hue = Math.floor(unit(seed) * 360)
  ctx.fillStyle = `hsl(${hue} 72% 38%)`
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'rgba(255,255,255,0.11)'
  ctx.fillRect(0, 0, canvas.width, 96)
  ctx.fillStyle = '#ffffff'
  ctx.font = '800 82px system-ui, sans-serif'
  ctx.fillText(ad.brand, 58, 118)
  ctx.font = '500 40px system-ui, sans-serif'
  ctx.fillText(ad.line, 60, 188)
  ctx.fillStyle = 'rgba(255,255,255,0.18)'
  ctx.beginPath()
  ctx.arc(860, 300, 145, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.font = '900 92px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(ad.mark, 860, 300)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = 'rgba(255,255,255,0.78)'
  ctx.font = '600 26px system-ui, sans-serif'
  ctx.fillText('BENIN CITY • NIGERIA', 60, 450)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

interface Billboard {
  group: THREE.Group
  material: THREE.MeshStandardMaterial
  texture: THREE.CanvasTexture
  point: Vec2
  roadAngle: number
}

export interface BillboardSystem {
  group: THREE.Group
  setNight(amount: number): void
  setQuality(quality: Quality): void
  update(position: Vec2): void
  dispose(): void
}

function billboardRoads(roads: Road[]): Road[] {
  return roads.filter(road =>
    !road.tunnel &&
    (road.kind === 'major' || road.kind === 'street' || road.kind === 'motorway') &&
    road.points.length > 1
  )
}

export function createBillboardSystem(
  district: District,
  initialPosition: Vec2,
  initialQuality: Quality,
): BillboardSystem {
  const root = new THREE.Group()
  root.name = 'roadside advertising billboards'
  const boards: Billboard[] = []
  let quality = initialQuality
  let position = { ...initialPosition }
  let night = 0

  const build = (): void => {
    boards.splice(0).forEach(board => {
      board.group.traverse(child => {
        const mesh = child as THREE.Mesh
        if (mesh.isMesh) {
          mesh.geometry.dispose()
          const material = mesh.material
          ;(Array.isArray(material) ? material : [material]).forEach(item => item.dispose())
        }
      })
      board.texture.dispose()
    })
    root.clear()

    const settings = BUDGET[quality]
    const candidates: { point: Vec2; angle: number; seed: number }[] = []
    for (let roadIndex = 0; roadIndex < district.roads.length && candidates.length < settings.count * 3; roadIndex++) {
      const road = district.roads[roadIndex]!
      if (!billboardRoads([road]).length) continue
      for (let i = 0; i < road.points.length - 1 && candidates.length < settings.count * 3; i++) {
        const a = road.points[i]!, b = road.points[i + 1]!
        const dx = b.x - a.x, dz = b.z - a.z
        const length = Math.hypot(dx, dz)
        if (length < 35) continue
        const ux = dx / length, uz = dz / length
        const seed = hash(a.x, a.z, roadIndex * 97 + i)
        for (let along = 36 + unit(seed) * 42; along < length - 30; along += settings.spacing) {
          const side = unit(seed + Math.floor(along / settings.spacing)) < 0.5 ? -1 : 1
          const offset = road.width / 2 + 5.5
          candidates.push({
            point: { x: a.x + ux * along - uz * offset * side, z: a.z + uz * along + ux * offset * side },
            angle: Math.atan2(ux, uz) + (side < 0 ? Math.PI : 0),
            seed: seed + Math.floor(along),
          })
        }
      }
    }

    candidates.sort((a, b) =>
      Math.hypot(a.point.x - position.x, a.point.z - position.z) -
      Math.hypot(b.point.x - position.x, b.point.z - position.z)
    )

    const used: Vec2[] = []
    for (const candidate of candidates) {
      if (boards.length >= settings.count) break
      if (Math.hypot(candidate.point.x - position.x, candidate.point.z - position.z) > settings.radius) continue
      if (used.some(point => Math.hypot(point.x - candidate.point.x, point.z - candidate.point.z) < 80)) continue
      const ad = ADS[Math.floor(unit(candidate.seed) * ADS.length)]!
      const texture = makeTexture(ad, candidate.seed)
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.72,
        metalness: 0.08,
        emissive: '#ffffff',
        emissiveIntensity: night * 0.8,
        side: THREE.DoubleSide,
      })
      const group = new THREE.Group()
      group.position.set(candidate.point.x, 0, candidate.point.z)
      group.rotation.y = candidate.angle

      const post = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 7.2, 0.24),
        new THREE.MeshStandardMaterial({ color: '#3d4146', roughness: 0.82, metalness: 0.35 }),
      )
      post.position.y = 3.6
      post.castShadow = true

      const crossbar = new THREE.Mesh(
        new THREE.BoxGeometry(11.8, 0.18, 0.28),
        post.material,
      )
      crossbar.position.y = 5.8

      const board = new THREE.Mesh(new THREE.PlaneGeometry(12, 6), material)
      board.position.y = 8.8
      board.castShadow = true
      board.receiveShadow = true

      group.add(post, crossbar, board)
      root.add(group)
      boards.push({ group, material, texture, point: candidate.point, roadAngle: candidate.angle })
      used.push(candidate.point)
    }
  }

  const update = (next: Vec2): void => {
    const settings = BUDGET[quality]
    if (Math.hypot(next.x - position.x, next.z - position.z) < Math.max(70, settings.spacing * 0.35) && boards.length) return
    position = { ...next }
    build()
  }

  return {
    group: root,
    setNight(amount) {
      night = THREE.MathUtils.clamp(amount, 0, 1)
      for (const board of boards) board.material.emissiveIntensity = night * 0.8
    },
    setQuality(next) {
      if (quality === next) return
      quality = next
      build()
    },
    update,
    dispose() {
      boards.forEach(board => {
        board.texture.dispose()
        board.group.traverse(child => {
          const mesh = child as THREE.Mesh
          if (mesh.isMesh) {
            mesh.geometry.dispose()
            const material = mesh.material
            ;(Array.isArray(material) ? material : [material]).forEach(item => item.dispose())
          }
        })
      })
      boards.length = 0
      root.removeFromParent()
    },
  }
}
