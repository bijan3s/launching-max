// types.d.ts
import { IUser, TUserDoc } from "src/app/models/user/User";

declare global {
  namespace Express {
    interface Request {
      user: TUserDoc;
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
