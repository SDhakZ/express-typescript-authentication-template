import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";

const PORT = Number(process.env.PORT ?? 4000);
const app = express();

app.use(cors());
app.use(express.json());

// typed health route
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ ok: true, time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
