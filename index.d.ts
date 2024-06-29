// types.d.ts
import { IUser } from "src/app/models/user/User";

interface UserWithId extends IUser {
  id: number;
}

declare module "socket.io" {
  interface Socket {
    user?: { id: number; wallet?: { trial: number; main: number } };
  }
}

declare global {
  namespace Express {
    interface Request {
      user: UserWithId;
    }
    interface Response {
      success: (data?: any) => Response;
      created: (data?: any) => Response;
      updated: (message?: any) => Response;
      noContent: () => Response;
      badRequest: (message?: any) => Response;
      unauthorized: (message?: string) => Response;
      forbidden: (message?: string) => Response;
      notFound: (message?: string) => Response;
      conflict: (message?: string) => Response;
      internalError: (message?: string) => Response;
      validationError: (data?: { [key: string]: string[] }) => Response;
    }
  }
}
