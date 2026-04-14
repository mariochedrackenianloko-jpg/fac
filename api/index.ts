import { createStartHandler } from "@tanstack/react-start/server";
import { router } from "../src/router";

const handler = createStartHandler({
  router,
});

export default handler;
export const config = {
  runtime: "nodejs22.x",
};
