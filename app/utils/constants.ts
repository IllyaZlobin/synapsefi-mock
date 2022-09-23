import { nonNull } from "@app/utils/nonNull";

export const API_URL = nonNull(process.env.API_URL, "process.env.API_URL");
