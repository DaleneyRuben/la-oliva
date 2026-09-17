# Public Client Intake Testing Guide

This guide covers the public `/registro` intake, the Draft client lifecycle, and staff review.

## Current verification status

Completed locally:

- The intake migration is applied locally.
- A real public-intake API submission created a Draft client with a phone number shared by active Clients.
- Database checks confirmed the Draft state, absent delivery, preferred start date, and health data.
- A real Super Admin review API request activated the Draft and created a paid subscription, payment, and history entry.
- The test client was soft-deleted after verification.
- Backend test suite, frontend type check, and backend type check passed.
- `/registro` was opened in a browser to verify the rendered public form and fields.

Still required:

- Browser-driven submission, review, and deletion.
- Browser and API permission checks for every relevant role.
- Runtime verification that Drafts are absent from every operational surface.

## Test data

Use a clearly identifiable test client, for example `Prueba Registro E2E`, and a phone number already assigned to an active Client. Do not alter existing Clients used by staff.

After each complete test, soft-delete only the test client. Verify that the original Clients sharing the phone number remain active and unchanged.

## 1. Public registration

Run on a mobile viewport and a desktop viewport.

1. Open `/registro` without authenticating.
2. Confirm that the page is outside the staff layout and does not contain a delivery selector.
3. Complete all required identity, contact, address, zone, preferred-start-date, weight, and height fields.
4. Add restrictions, underlying diseases, operations, and medications.
5. Select `Otro` under underlying diseases. Confirm that the detail field appears and cannot be left empty.
6. Submit using a phone number held by another active Client. The submission must be accepted.
7. Confirm the success page shows only: `Recibimos tu solicitud. Nos comunicaremos contigo pronto.`

Validation cases:

- Date of birth cannot be in the future.
- Preferred start date must be after today.
- Preferred start date must be Monday through Friday.
- Weight and height are required and positive.
- Honeypot submissions are rejected without creating a client.

## 2. Draft persistence and operational exclusion

After public submission, verify through the API or database:

- `isDraft` is `true`.
- `delivery` is `null`.
- Preferred start date and health data match the submitted values.
- No subscription, payment, client-history entry, appointment, or notification exists.

Then verify that the Draft does not appear in:

- Delivery routes and delivery groups.
- Production and kitchen data.
- Finance data.
- Reports.
- Birthday data.
- Client type-ahead search.

## 3. Permissions

| Role                            | Draft list/profile                             | Review      | Delete      |
| ------------------------------- | ---------------------------------------------- | ----------- | ----------- |
| Super Admin                     | Allowed                                        | Allowed     | Allowed     |
| Admin                           | Allowed                                        | Allowed     | Allowed     |
| Audit                           | Hidden; direct access returns not found        | Not allowed | Not allowed |
| Nutritionist, Kitchen, Delivery | Not exposed through their operational surfaces | Not allowed | Not allowed |

For Admin and Super Admin, assert that Drafts appear ahead of normal clients, ordered oldest first, with the `Borrador / Pendiente de revisión` state.

## 4. Staff review workflow

Use the browser while authenticated as an Admin or Super Admin.

1. Open the Draft profile from the client table.
2. Confirm that only the summary, `Revisar`, and `Eliminar` actions are available for the Draft.
3. Click `Revisar`.
4. Confirm that the existing client wizard is prefilled with all submitted data, including health data, custom disease detail, and preferred start date.
5. Assign delivery and select a plan.
6. Confirm the client.

After confirmation, verify:

- `isDraft` becomes `false`.
- A paid subscription is created atomically.
- The subscription start date defaults to the preferred start date but can be edited before confirmation.
- Payment and `plan_assigned` history exist.
- The client leaves Draft state and appears in normal operations.

## 5. Atomicity and shared phone numbers

API-level tests should cover the following:

- Submit a review with an invalid or unavailable plan. The client remains a Draft and no subscription, payment, or history row is created.
- Create two direct clients with the same phone number. Both succeed.
- Update a client phone number to one used by another Client. The update succeeds.
- Submit a public intake with a shared phone number. It succeeds.
- Convert an appointment with a shared phone number. It succeeds.

## 6. Draft deletion

1. Create a new public Draft.
2. In the browser, use `Eliminar` and confirm the modal.
3. Confirm the client is soft-deleted and no longer appears in the client table or operational surfaces.
4. Confirm other Clients with the same phone number are unchanged.

## 7. Regression checks

Before release:

```bash
yarn workspace catering-manager-frontend test --runInBand
yarn workspace catering-manager-backend test --runInBand
yarn workspace catering-manager-frontend typecheck
yarn workspace catering-manager-backend typecheck
yarn workspace catering-manager-backend exec sequelize-cli db:migrate:status
```

Capture desktop and mobile evidence for `/registro`, the Draft profile, and the completed review state. Convert the browser cases above into a repeatable E2E suite before treating the workflow as fully browser-verified.
