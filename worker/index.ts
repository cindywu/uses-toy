import { DatadogLogger, Server as BaseServer } from "reps-do";
export { worker as default } from "reps-do";
import { mutators, type M } from "../src/datamodel/mutators.js";

export class Server extends BaseServer<M> {
  constructor(state: DurableObjectState, env: Record<string, string>) {
    const logger = env.DATADOG_API_KEY
      ? new DatadogLogger({
          apiKey: env.DATADOG_API_KEY,
          service: "replidraw",
        })
      : undefined;

    super({
      mutators,
      state,
      logger,
    });
  }
}
