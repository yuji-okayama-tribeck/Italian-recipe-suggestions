import "dotenv/config";
import { VoltAgent, VoltOpsClient } from "@voltagent/core";
import { createPinoLogger } from "@voltagent/logger";

import { buonoKun } from "./agents/main";

const logger = createPinoLogger({
	name: "italian-recipe-agent",
	level: "info",
});

new VoltAgent({
	agents: {
		"buono-kun": buonoKun,
	},
	logger,
	voltOpsClient: new VoltOpsClient({
		publicKey: process.env.VOLTAGENT_PUBLIC_KEY || "",
		secretKey: process.env.VOLTAGENT_SECRET_KEY || "",
	}),
});
