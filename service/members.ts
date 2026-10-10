export function publicMember(world: World, viewer: MemberId, target: MemberId): PublicMember {
  if (isBlockedEitherWay(world, viewer, target)) throw new WorldError('not_found', 'That member was not found.')
  const { profile } = record(world, target)
  const rel = relation(world, viewer, target)
  const area = freshArea(world, target)
  // Public surfaces used by the arena and other social features need a minimal identity even when a
  // member has not completed the Benin Life onboarding flow yet. `beninLifeReady` is still enforced
  // for service-to-service transfers and other capabilities that require the full character setup.
  const accepted = areFriends(world, viewer, target)
  const mayShowArea = rel === 'self' || accepted || profile.preferences.discoverable
  const tag = accepted ? null : friendTag(world, viewer, target)
  return {
    id: profile.id, displayName: profile.displayName, bio: profile.bio, look: lookFor(world, viewer, target),
    areaLabel: area && mayShowArea ? area.label : null, relation: rel, online: world.isOnline(target),
    ...(tag ? { automatic: tag } : {}),
    ...(state(world).creator === target ? { verified: 'creator' as const } : {}),
  }
}

/** Same as publicMember, but returns null instead of throwing when the pair is blocked. */
export function tryPublicMember(world: World, viewer: MemberId, target: MemberId): PublicMember | null {
  if (!exists(world, target) || isBlockedEitherWay(world, viewer, target)) return null
  return publicMember(world, viewer, target)
}