import type { MoltbotEnv } from "../types";

export function buildEnvVars(env: MoltbotEnv): Record<string, string> {
    const envVars: Record<string, string> = {};

    // 1. AUTOMATIC PASS-THROUGH
    // Iterate through every key in your Cloudflare environment
    for (const [key, value] of Object.entries(env)) {
        // Only pass strings (avoids passing internal objects like Durable Objects/Bindings)
        if (typeof value === "string") {
            envVars[key] = value;
        }
    }

    // 2. LEGACY & SPECIFIC MAPPINGS
    // Cloudflare AI Gateway normalization (Legacy support)
    if (env.AI_GATEWAY_API_KEY && env.AI_GATEWAY_BASE_URL) {
        const normalizedBaseUrl = env.AI_GATEWAY_BASE_URL.replace(/\/+$/, "");
        envVars.AI_GATEWAY_BASE_URL = normalizedBaseUrl;
        envVars.ANTHROPIC_BASE_URL = normalizedBaseUrl;
        envVars.ANTHROPIC_API_KEY = env.AI_GATEWAY_API_KEY;
    }

    // OpenClaw specific variable names
    if (env.MOLTBOT_GATEWAY_TOKEN) {
        envVars.OPENCLAW_GATEWAY_TOKEN = env.MOLTBOT_GATEWAY_TOKEN;
    }

    if (env.DEV_MODE) {
        envVars.OPENCLAW_DEV_MODE = env.DEV_MODE;
    }

    return envVars;
}
