import express from "express";
import { searchEvents, searchFollowedArtists } from "./services/eventsService.js";
import { trackedArtists } from "./data/artists.js";
import cors from "cors";


const app = express();

app.use(cors());

const PORT = 3000;

app.get("/events", async (req, res) => {
  try {
    const events = await searchFollowedArtists(trackedArtists);

    res.json(events);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error obteniendo eventos"
    });
  }
});

app.get("/events/:artist", async (req, res) => {
  try {
    const events = await searchEvents(req.params.artist);
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error obteniendo eventos"
    });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});