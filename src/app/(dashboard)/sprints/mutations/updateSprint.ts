import { resolver } from "@blitzjs/rpc";
import db from "db";
import { UpdateSprintSchema } from "../schemas";

export default resolver.pipe(
  resolver.zod(UpdateSprintSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const sprint = await db.sprint.update({ where: { id }, data });

    return sprint;
  }
);
