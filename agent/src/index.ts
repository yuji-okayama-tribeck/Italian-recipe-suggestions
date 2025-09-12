import "dotenv/config";
import { VoltAgent } from "@voltagent/core";
import { honoServer } from "@voltagent/server-hono";
import { createPinoLogger } from "@voltagent/logger";

import { BuonoKun } from "./agents/main";

const logger = createPinoLogger({
	name: "italian-recipe-agent",
	level: "info",
});

new VoltAgent({
	agents: {
		"buono-kun": BuonoKun,
	},
	server: honoServer(),
	logger,
});
