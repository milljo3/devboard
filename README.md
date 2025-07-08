# DevBoard

DevBoard is a web app designed to help users track and manage their job applications with ease. It features a clean UI, status updates, and persistent user accounts powered by secure authentication and database storage.

This project marks my **first time working with**:

* **Next.js**
* **TailwindCSS**
* **shadcn/ui**
* **React Query**
* **better-auth** with email verification
* **OAuth (Google & GitHub)**
* **Vercel** for deployment

It also builds on my prior experience with:

* **TypeScript**
* **Zod** (schema validation)
* **React**
* **PostgreSQL**
* **Prisma ORM**
* **REST APIs**

🔗 **Live Demo**: [devboard-neon.vercel.app](https://devboard-neon.vercel.app/)

---

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Folder Structure](#folder-structure)
* [Challenges Faced](#challenges-faced)
* [Future Improvements](#future-improvements)

---

## Features

* **User Authentication**

  * Email + Password login
  * OAuth via Google & GitHub
  * Email verification with **Nodemailer**
* **Application Tracking**

  * Add, edit, delete job applications
  * Update application status inline
* **Pagination & Sorting**

  * Paginated results with sorting on column headers
* **Form Validation**

  * Robust schema validation using Zod (frontend and backend)
* **Responsive UI**

  * Built with TailwindCSS and shadcn/ui components
* **Secure & Persistent**

  * Session-based auth with Prisma/Postgres as persistent storage
* **Deployed on Vercel**

---

## Tech Stack

| Area             | Tech                                               |
| ---------------- | -------------------------------------------------- |
| **Frontend**     | Next.js, React, TypeScript, TailwindCSS, shadcn/ui |
| **State & Data** | React Query, Zod, React Hook Form                  |
| **Backend**      | API Routes (Next.js), Prisma ORM, PostgreSQL       |
| **Auth**         | better-auth (NextAuth), Nodemailer, OAuth          |
| **Deployment**   | Vercel                                             |


## Folder Structure

```
/app                # Next.js app directory
/components         # Shared React components
/app/api            # API routes for authentication and data
/lib                # Reusable server-side logic (auth, db)
/prisma             # Prisma schema and migrations
/types              # TypeScript types
```

---

## Challenges Faced

* **Zod on both client and server** for type-safe validation — helped catch lots of edge cases.
* **React Query** — learning the right way to cache, refetch, and handle errors optimistically.
* **Better-auth** integration with NextAuth + email verification — handling tokens, callbacks, and custom verification emails took trial and error.
* **OAuth and Nodemailer** setup — especially juggling credentials and callback URLs between local and deployed environments.

---

## Future Improvements

* Role-based permissions (admin vs user)
* Expandable application cards for more information
* Mobile UI refinements
* Site styling improvements (very bland at the moment)
* Add unit/integration tests with Jest & Testing Library

---

## Conclusion

This project helped me in improving my fullstack web development. From deploying with Vercel to setting up OAuth and handling advanced client-server validation, it’s been a deep learning experience.
