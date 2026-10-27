# Authentication

Sessions are signed JWTs (HS256, 7 days) in an `httpOnly`, `sameSite=lax`, `secure` (production) cookie. Passwords use scrypt with a per-user salt and constant-time compare.

## Private routes
| Route | Layer 1 (`middleware.ts`) | Layer 2 (`app/(app)/layout.tsx` + page) | Layer 3 |
|---|---|---|---|
| `/groups` | valid signed cookie | user still exists in store | page calls `requireUser()` |
| `/groups/[id]` | same | same | `group.userId === user.id` else `notFound()` |

Layer 1 proves a validly signed session exists. Layer 2 proves the user still exists. Layer 3 proves ownership.

## Protected actions (`app/(app)/actions.ts`)
Every action starts with `owned(id)`: `requireUser()` (check 1, signed in) then `group.userId === user.id` (check 2, owns it). `createGroup` uses `requireUser()` only because nothing exists yet to own.

## The three attacks
1. **Signed out write:** calling any action without a cookie hits `requireUser()` in `lib/auth.ts` and redirects to `/signin`.
2. **Signed in as someone else:** `owned()` throws "Not found" when `group.userId !== user.id`.
3. **Crafted return link** `/signin?next=https://example.com`: `safeNext()` in `lib/auth.ts` accepts only a single-slash relative path, otherwise `/groups`.

Also: changing an id in `/groups/<id>` returns the not-found page, not someone else's data. Unknown handle and wrong password share one error message.
