import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Google Calendar API Setup
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/calendar']
  });

  const calendar = google.calendar({ version: 'v3', auth });
  const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

  // API Routes
  app.get("/api/calendar/slots", async (req, res) => {
    try {
      const { timeMin, timeMax } = req.query;
      
      if (!timeMin || !timeMax) {
        return res.status(400).json({ error: "timeMin and timeMax are required" });
      }

      const response = await calendar.freebusy.query({
        requestBody: {
          timeMin: timeMin as string,
          timeMax: timeMax as string,
          items: [{ id: calendarId }],
        },
      });

      res.json(response.data.calendars?.[calendarId] || { busy: [] });
    } catch (error: any) {
      console.error("Error fetching slots:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/calendar/book", async (req, res) => {
    try {
      const { summary, description, start, end, attendeeEmail, attendeeName } = req.body;

      const event = {
        summary: `Consulta: ${attendeeName} (${summary})`,
        description: `${description}\n\nEmail: ${attendeeEmail}`,
        start: { dateTime: start },
        end: { dateTime: end },
        attendees: [{ email: attendeeEmail, displayName: attendeeName }],
      };

      const response = await calendar.events.insert({
        calendarId,
        requestBody: event,
      });

      res.json(response.data);
    } catch (error: any) {
      console.error("Error booking event:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
