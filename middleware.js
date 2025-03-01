export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard",
    "/for_schools",
    "/rewardcs",
    "/supervisor",
    "/tickets",
    "/confirm(.*)",
    "/settings/account",
    "/teacher/events",
  ],
};
