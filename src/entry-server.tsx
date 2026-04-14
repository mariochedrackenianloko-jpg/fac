import { createStartHandler } from "@tanstack/react-start/server";
import { router } from "./router";

export default createStartHandler({
  router,
});