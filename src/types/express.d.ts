import type { auth } from "../lib/auth";

type SessionUser = typeof auth.$Infer.Session.user;

declare global {
  namespace Express {
    interface Response {
      user?: SessionUser;
    }
  }
}

export {};
