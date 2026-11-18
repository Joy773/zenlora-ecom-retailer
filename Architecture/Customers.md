# Customer accounts

The navbar account icon opens the login and sign-up modal. The forms submit to server functions that validate the input, create customer accounts, and establish customer sessions.

## Files and responsibilities

| File | Change | Purpose |
| --- | --- | --- |
| `components/common/navbar.tsx` | Reuse | Opens the account modal. |
| `components/common/login&signup-modal.tsx` | Reuse | Sends the selected form to the server and shows validation or login errors. |
| `lib/mongoose.ts` | Reuse | Provides `connectMongoose()`, the existing connection to MongoDB. |
| `models/Customer.ts` | Reuse | Defines the Mongoose schema and model for the `customers` collection. It includes a unique email index and keeps `passwordHash` out of ordinary queries. |
| `lib/customer-auth.ts` | Reuse | Holds the server functions for registration and login. The file starts with `"use server"` so the modal can call these functions while database access and password checks run on the server. |
| `auth.ts` | Update | Verifies customer passwords and writes the customer role into the Auth.js JWT session. |

The customer model defines what gets stored. The functions in `lib/customer-auth.ts` decide when to create or look up a record. These functions live directly in the existing `lib` folder.

## Sign-up flow

1. The shopper opens the navbar account icon, chooses **Sign up**, and enters their full name, email, password, and password confirmation.
2. The modal sends the form to the registration function. The server validates the fields, checks that the passwords match, and trims and lowercases the email. If validation fails, it returns a message to the modal before saving anything.
3. The server uses `bcryptjs` to hash the password with a salt. It connects through `connectMongoose()` and calls `Customer.create()` to save three account fields: `fullName` for display, `email` for lookup, and `passwordHash` for login. The password confirmation is used only for validation.
4. A unique index on the normalized email ensures that even two simultaneous sign-ups can create only one account for that address. The modal reports duplicate emails and other validation errors. After a successful sign-up, it signs the shopper in, redirects to the storefront, and shows a success toast.

## Login flow

1. The returning shopper chooses **Log in** and enters their email and password.
2. The login function normalizes the email the same way as registration, connects through Mongoose, and looks up the customer with `Customer.findOne({ email })`.
3. If a record exists, the server calls `bcrypt.compare(enteredPassword, customer.passwordHash)`. This checks the entered password against the stored hash without recovering the original password.
4. If no account exists for the email, the modal shows a toast asking the shopper to create an account. An incorrect password shows a generic login-error toast. If the check succeeds, Auth.js establishes a JWT-backed customer session, redirects to the storefront, and shows a login success toast.

## Later visits

On a later request that needs the customer's identity, the browser sends the session cookie. The server verifies the session and uses its customer ID to identify the shopper. A valid session keeps the shopper signed in without another password check. A missing or expired session prompts them to log in again.

## Logout flow

When an authenticated shopper clicks the logout icon in the storefront navbar, the navbar submits the customer logout server function. It calls Auth.js `signOut()` and redirects to the storefront. Auth.js removes the session cookie, the storefront shows a logout success toast, and the next session check shows the account icon again.

Customer accounts belong in the `customers` collection. The existing admin login reads from the `users` collection. Customer sessions carry the `customer` role and admin sessions carry the `admin` role. The proxy, admin layout, product API, and admin password action require the `admin` role, so a storefront customer session cannot grant admin access.
