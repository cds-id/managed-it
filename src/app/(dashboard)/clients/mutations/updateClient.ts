import { resolver } from "@blitzjs/rpc";
import db from "db";
import { UpdateClientSchema } from "../schemas";

export default resolver.pipe(
  resolver.zod(UpdateClientSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const client = await db.client.update({ where: { id }, data });

    return client;
  }
);
