import { Hono } from "hono";
import device from "./routes/device";

const app = new Hono().basePath("/api");

app.route("/device", device);

export default app;
