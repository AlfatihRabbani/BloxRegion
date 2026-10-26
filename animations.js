/*
 * BloxRegion — animations for the ViewPort's 3D avatar
 *
 * The idle one always plays; clicking the avatar waves, double-clicking dances until the
 * next click. To add one, give it a name in ANIMATIONS and hook it up in viewport.js
 * (see play()).
 *
 * An animation is a list of keyframes. Each keyframe has a time `t` (seconds from the
 * start) and the turn of any joints it moves, in degrees, as [x, y, z]:
 *   x  swings forward (+) or back (-): an arm lifts in front of the body, a knee bends
 *      with -, the head looks up with + (and down with -)
 *   y  twists: the head and waist turn toward the avatar's left with +; a limb rolls
 *   z  lifts sideways: an arm or leg goes out to the side with +; the head tilts
 * Joints: neck, waist, root (the whole avatar, about the hips), rightShoulder,
 * rightElbow, rightWrist, rightHip, rightKnee, rightAnkle, and the same on the left.
 * "Right" is the avatar's own right (on your left as it faces you). Left joints are
 * mirrored, so the same numbers make the mirror-image pose.
 * `move: [x, y, z]` shifts the whole avatar, in studs (y is up): a bounce, a hop.
 *
 * Between keyframes each joint eases from one turn to the next. A joint holds its first
 * turn before its first keyframe and its last turn after its last one, and joints an
 * animation never mentions stay at rest (0, 0, 0). `loop: true` repeats it every `length`
 * seconds; otherwise it plays once and the avatar eases back to idle.
 */
(() => {
	'use strict';

	if (window.top !== window || window.__brAnimations) return;

	const ANIMATIONS = {
		// Barely there: the arms drift a little as the avatar breathes.
		idle: {
			length: 4,
			loop: true,
			keys: [
				{ t: 0, rightShoulder: [0, 0, 2], leftShoulder: [0, 0, 2], rightElbow: [4, 0, 0], leftElbow: [4, 0, 0] },
				{ t: 2, rightShoulder: [3, 0, 5], leftShoulder: [3, 0, 5], rightElbow: [8, 0, 0], leftElbow: [8, 0, 0] },
				{ t: 4, rightShoulder: [0, 0, 2], leftShoulder: [0, 0, 2], rightElbow: [4, 0, 0], leftElbow: [4, 0, 0] }
			]
		},

		// The right arm goes out to the side, forearm up, and waves from the elbow.
		wave: {
			length: 2.4,
			keys: [
				{ t: 0, rightShoulder: [0, 0, 0], rightElbow: [0, 0, 0], neck: [0, 0, 0] },
				{ t: 0.35, rightShoulder: [10, 0, 100], rightElbow: [0, 0, 70], neck: [0, 0, -6] },
				{ t: 0.6, rightElbow: [0, 0, 45] },
				{ t: 0.85, rightElbow: [0, 0, 95] },
				{ t: 1.1, rightElbow: [0, 0, 45] },
				{ t: 1.35, rightElbow: [0, 0, 95] },
				{ t: 1.6, rightElbow: [0, 0, 45] },
				{ t: 1.85, rightShoulder: [10, 0, 100], rightElbow: [0, 0, 70], neck: [0, 0, -6] },
				{ t: 2.3, rightShoulder: [0, 0, 0], rightElbow: [0, 0, 0], neck: [0, 0, 0] }
			]
		},

		// Four beats: bounce and swing the arms, the other way, then a disco point.
		dance: {
			length: 1.6,
			loop: true,
			keys: [
				{
					t: 0, move: [0, -0.12, 0], waist: [0, 12, 0], neck: [-8, 0, 6],
					rightShoulder: [35, 0, 20], rightElbow: [80, 0, 0], leftShoulder: [-15, 0, 20], leftElbow: [50, 0, 0],
					rightHip: [20, 0, 0], rightKnee: [-35, 0, 0], rightAnkle: [15, 0, 0],
					leftHip: [20, 0, 0], leftKnee: [-35, 0, 0], leftAnkle: [15, 0, 0]
				},
				{
					t: 0.4, move: [0, 0, 0], waist: [0, 0, 0], neck: [4, 0, 0],
					rightShoulder: [10, 0, 25], rightElbow: [60, 0, 0], leftShoulder: [10, 0, 25], leftElbow: [60, 0, 0],
					rightHip: [0, 0, 0], rightKnee: [0, 0, 0], rightAnkle: [0, 0, 0],
					leftHip: [0, 0, 0], leftKnee: [0, 0, 0], leftAnkle: [0, 0, 0]
				},
				{
					t: 0.8, move: [0, -0.12, 0], waist: [0, -12, 0], neck: [-8, 0, -6],
					rightShoulder: [-15, 0, 20], rightElbow: [50, 0, 0], leftShoulder: [35, 0, 20], leftElbow: [80, 0, 0],
					rightHip: [20, 0, 0], rightKnee: [-35, 0, 0], rightAnkle: [15, 0, 0],
					leftHip: [20, 0, 0], leftKnee: [-35, 0, 0], leftAnkle: [15, 0, 0]
				},
				{
					t: 1.2, move: [0, 0.04, 0], waist: [0, 8, 0], neck: [10, 0, -8],
					rightShoulder: [0, 0, 155], rightElbow: [0, 0, 0], leftShoulder: [0, 0, 35], leftElbow: [95, 0, 0],
					rightHip: [0, 0, 0], rightKnee: [0, 0, 0], rightAnkle: [0, 0, 0],
					leftHip: [0, 0, 8], leftKnee: [0, 0, 0], leftAnkle: [0, 0, 0]
				},
				{
					t: 1.6, move: [0, -0.12, 0], waist: [0, 12, 0], neck: [-8, 0, 6],
					rightShoulder: [35, 0, 20], rightElbow: [80, 0, 0], leftShoulder: [-15, 0, 20], leftElbow: [50, 0, 0],
					rightHip: [20, 0, 0], rightKnee: [-35, 0, 0], rightAnkle: [15, 0, 0],
					leftHip: [20, 0, 0], leftKnee: [-35, 0, 0], leftAnkle: [15, 0, 0]
				}
			]
		}
	};

	// ---------------------------------------------------------------------------
	// Playback
	// ---------------------------------------------------------------------------

	const ease = k => k * k * (3 - 2 * k);

	// Each animation as one track per joint: [time, [x, y, z]] pairs in order.
	const tracks = {};
	for (const [name, anim] of Object.entries(ANIMATIONS)) {
		const byJoint = {};
		for (const key of [...anim.keys].sort((a, b) => a.t - b.t)) {
			for (const [joint, turn] of Object.entries(key)) {
				if (joint !== 't' && Array.isArray(turn)) (byJoint[joint] = byJoint[joint] || []).push([key.t, turn]);
			}
		}
		tracks[name] = byJoint;
	}

	// The pose `seconds` into an animation: { joint: [x, y, z], move: [x, y, z] }.
	function sample(name, seconds) {
		const anim = ANIMATIONS[name];
		if (!anim) return {};
		const t = anim.loop ? ((seconds % anim.length) + anim.length) % anim.length : Math.min(seconds, anim.length);
		const pose = {};
		for (const [joint, track] of Object.entries(tracks[name])) {
			let i = 0;
			while (i < track.length - 1 && track[i + 1][0] <= t) i++;
			const [t0, a] = track[i];
			const next = track[i + 1];
			if (!next || t <= t0) {
				pose[joint] = a.slice();
				continue;
			}
			const k = ease((t - t0) / (next[0] - t0));
			pose[joint] = a.map((v, j) => v + (next[1][j] - v) * k);
		}
		return pose;
	}

	// Part of the way from one pose to another (0 = a, 1 = b).
	function blend(a, b, k) {
		const pose = {};
		for (const joint of new Set([...Object.keys(a), ...Object.keys(b)])) {
			const from = a[joint] || [0, 0, 0], to = b[joint] || [0, 0, 0];
			pose[joint] = from.map((v, j) => v + (to[j] - v) * k);
		}
		return pose;
	}

	window.__brAnimations = {
		has: name => !!ANIMATIONS[name],
		length: name => (ANIMATIONS[name] ? ANIMATIONS[name].length : 0),
		loops: name => !!(ANIMATIONS[name] && ANIMATIONS[name].loop),
		sample,
		blend
	};
})();
