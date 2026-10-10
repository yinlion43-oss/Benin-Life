import assert from 'node:assert/strict'
import type { Map as MapLibreMap } from 'maplibre-gl'
import { createMapCameraControls } from '../src/features/map/camera-controls.ts'

type EventData = { beninLifeCameraControl?: boolean; originalEvent?: unknown }
type Handler = (event: EventData) => void
type CameraOptions = { zoom?: number; duration?: number; easing?: (t: number) => number }

function fixture(initialZoom = 6.5) {
  const listeners = new Map<string, Set<Handler>>()
  let zoom = initialZoom
  let moving = false
  const calls = { easeTo: [] as CameraOptions[], panBy: [] as Array<[number, number]>, stop: 0 }
  const emit = (type: string, event: EventData = {}) => listeners.get(type)?.forEach(handler => handler(event))
  const fakeMap = {
    getZoom: () => zoom,
    getMinZoom: () => 1.5,
    getMaxZoom: () => 18,
    isMoving: () => moving,
    on: (type: string, handler: Handler) => {
      if (!listeners.has(type)) listeners.set(type, new Set())
      listeners.get(type)!.add(handler)
    },
    off: (type: string, handler: Handler) => listeners.get(type)?.delete(handler),
    easeTo: (options: CameraOptions, eventData: EventData = {}) => {
      calls.easeTo.push(options)
      if (moving) { moving = false; emit('moveend') }
      moving = (options.duration ?? 0) !== 0
      if (!moving && options.zoom !== undefined) zoom = options.zoom
      emit('movestart', eventData)
    },
    panBy: (offset: [number, number]) => { calls.panBy.push(offset); moving = true; emit('movestart', { beninLifeCameraControl: true }) },
    stop: () => { calls.stop++; moving = false; emit('moveend') },
  }
  return { map: fakeMap, calls, setZoom: (next: number) => { zoom = next }, getZoom: () => zoom }
}

{
  const f = fixture()
  let interacted = 0
  const controls = createMapCameraControls(f.map as unknown as MapLibreMap, () => { interacted++ })
  controls.step({ kind: 'zoom', dir: 1 })
  controls.step({ kind: 'zoom', dir: 1 })
  controls.step({ kind: 'zoom', dir: 1 })
  assert.deepEqual(f.calls.easeTo.map(call => call.zoom), [7.5, 8.5, 9.5], 'rapid taps retain their intended zoom increments')
  assert.equal(interacted, 3, 'each user camera step is reported')
  controls.dispose()
  console.log('PASS rapid camera taps preserve zoom intent')
}

{
  const f = fixture(17.6)
  const controls = createMapCameraControls(f.map as unknown as MapLibreMap)
  controls.step({ kind: 'zoom', dir: 1 })
  controls.step({ kind: 'zoom', dir: 1 })
  assert.deepEqual(f.calls.easeTo.map(call => call.zoom), [18], 'zoom is clamped and a clamped animation is not restarted')
  controls.dispose()
  console.log('PASS camera zoom respects map limits')
}

{
  const f = fixture(2)
  const controls = createMapCameraControls(f.map as unknown as MapLibreMap, () => {}, () => true)
  controls.step({ kind: 'zoom', dir: -1 })
  assert.equal(f.getZoom(), 1.5, 'reduced motion applies a single immediate zoom step')
  assert.equal(f.calls.easeTo[0]?.duration, 0, 'reduced-motion transitions have no animation duration')
  controls.step({ kind: 'pan', dx: 1, dy: 0 })
  assert.deepEqual(f.calls.panBy[0], [220, 0], 'pan buttons move a bounded screen-space step')
  controls.dispose()
  console.log('PASS reduced-motion zoom and directional panning')
}
