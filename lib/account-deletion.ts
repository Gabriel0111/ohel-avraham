// Shared signal coordinating account self-deletion across components.
//
// During deletion there's a window where the `users` row is already gone but
// the Better Auth session still exists. In that window `AuthSync` would see
// "authenticated session, no user record" and helpfully *recreate* the user —
// resurrecting the account we're trying to delete. This flag lets `AuthSync`
// skip that recreation while a deletion is in flight.
//
// A plain module variable (not React state) is intentional: we only need to
// read it imperatively inside an effect, never to trigger a re-render.

let deleting = false;

export const setDeletingAccount = (value: boolean) => {
  deleting = value;
};

export const isDeletingAccount = () => deleting;
