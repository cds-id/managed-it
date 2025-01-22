import { resolver } from "@blitzjs/rpc";
import db from "db";
import { DeleteClientSchema } from "../schemas";

export default resolver.pipe(
  resolver.zod(DeleteClientSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const client = await db.client.deleteMany({ where: { id } });

    return client;
  }
);
