// Shared signal coordinating the post-registration success screen.
//
// When a guest/host profile is created, the user's role flips from "user" to
// "guest"/"host". `AuthSync` watches the role and bounces completed users off
// `/complete-registration` to `/` — which would kill the celebratory success
// screen before it's ever seen. This flag lets `AuthSync` skip that redirect
// while the success screen is playing; the screen handles its own navigation
// to `/dashboard` and clears the flag on unmount.
//
// A plain module variable (not React state) is intentional: we only read it
// imperatively inside an effect, never to trigger a re-render.

let justRegistered = false;

export const setJustRegistered = (value: boolean) => {
  justRegistered = value;
};

export const isJustRegistered = () => justRegistered;
