declare namespace Express {
  export interface Request {
    user?: import("../src/entity/User").User;
  }
}