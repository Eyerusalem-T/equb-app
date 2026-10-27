# Data

| Query | Runs on | Key / cache | Refresh rule | Why |
|---|---|---|---|---|
| My circles list | Server component | per request (dynamic, cookie) | `revalidatePath("/groups")` after each write | Private; needs the session |
| One circle + members + payments | Server component | per request | revalidated after each action | Private; ownership check must run on the server |
| Public circle page `/g/[slug]` | Server, ISR | cached | `revalidate = 60` plus revalidate on write | Read-heavy, no session needed, fast |
| Pay toggle | Client (`useOptimistic`) → Server Action | n/a | UI flips instantly, server confirms | Feels instant on slow connections |
| Contribution calculator | Client only | none | none | No data, instant feedback |

Rule: if it needs a secret or ownership, it runs on the server. Only interaction-heavy islands are client components.
Store: `lib/db.ts` JSON file (`.data/db.json`). Replace with Postgres for production.
