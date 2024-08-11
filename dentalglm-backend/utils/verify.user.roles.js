import { verifyToken } from "./verify.user.js";
import { verifyRoles } from "./verify.roles.js";

export const verifyTokenAndRole = (roles) => {
    return [verifyToken, verifyRoles(roles)];
};