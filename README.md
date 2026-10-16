# Identity Lifecycle Lab

Reconcile joiners, transfers, and departures into an inspectable provisioning plan.

**Field:** Identity & access management  
**Relevant roles:** IAM Engineer I · Identity Security Analyst  
**Status:** working prototype, published on GitHub and Vercel.

[**Open the live interactive lab**](https://identity-lifecycle-lab.vercel.app/)

The hosted lab runs synthetic exercises in your browser. See the scope below for local integration exercises and limitations.

## Run

Requires Node.js 22 or newer. The core prototype has no npm dependencies.

```sh
npm test
npm run build
npm start
```

Open `http://127.0.0.1:8767`. Use `PORT=8770 npm start` for another port.
To run analysis without a browser:

```sh
npm run analyze
node run.mjs input.json
```

## Explore

1. Transfer Alice to Finance. The plan removes Sales and legacy-admin access, adds Finance access, and revokes existing sessions.
2. Change the event to offboard and verify that every group and session is removed.
3. Try a privileged assignment as employee, then manager. Inspect the independent-approval decision.

## What is implemented

- A project-specific analysis engine shared by the browser and CLI.
- Guided controls plus editable/importable JSON input (maximum 1 MB).
- Computed decisions, supporting records, explicit empty/error states, and
  downloadable evidence containing the input and limitations.
- Individual visual identity: Botanical systems register, with self-hosted Rubik and Manrope, a custom masthead, readable type, visible keyboard focus, and responsive data views.
- Independent boundary and regression tests in `tests/`.

## Scope and limitations

The browser reconciles a fictional directory. A separate local SCIM exercise applies the plan to a mock provider; no real directory is connected.

All bundled identities, documents, logs, and advisories are fictional. Browser
inputs are visitor-controlled; this public demo is not a trusted security
boundary. Do not use it with private production data. Local enforcement or
provider runners, where provided, have their own documented setup and limits.
Do not report fixture outcomes as production results or live-model findings.

## Publish independently

This directory is a complete, separate GitHub/Vercel project. After creating a
repository, push this directory as its root. Import that repository in Vercel:
framework **Other**, build command **npm run build**, output **public**.
There are no required secrets for the public demo. Do not include `public/`,
`.env`, provider credentials, or actual investigation evidence in Git.

## Structure

- `web/engine.js`: domain-specific analysis and validation
- `web/runtime.js`: input validation, canonicalization, and hashing utilities
- `web/app.js`: accessible controls, result views, imports, and exports
- `tests/`: independently asserted security and behavior tests
- `docs/THREAT-MODEL.md`: trust boundaries and claims
- `scripts/`: optional local integrations, if applicable

## Validation

Run `npm test` for current results. Browser viewport checks and performance
metrics must be measured separately; passing engine tests does not establish
visual accessibility or production readiness.

Font notices are included in `web/fonts/`. Source code is MIT licensed.

## SCIM protocol exercise

`node scripts/scim-exercise.cjs` starts an authenticated loopback mock provider,
applies the actual lifecycle plan over HTTP, verifies the resulting directory,
and shuts down. Pass `input.json` to exercise another supported lifecycle event.
The mock implements only the Users creation, Users PATCH, and Groups membership
PATCH operations needed by these scenarios. It is not a full RFC 7644 server.
Session revocation uses an explicitly non-SCIM `/lab/sessions/` extension.
No real identity provider is connected. The bearer token is generated in memory
and is never written to a file or printed.

Reference: https://www.rfc-editor.org/rfc/rfc7644

## Visual identity

See [DESIGN.md](DESIGN.md) for this project’s typography, palette, header, and composition.
