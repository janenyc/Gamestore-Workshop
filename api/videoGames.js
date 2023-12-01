const express = require("express");
const router = express.Router();

const REPLACE_ME = "HELP REPLACE ME!!!!";

const {
    getAllVideoGames,
    getVideoGameById,
    createVideoGame,
    updateVideoGame,
    deleteVideoGame,
} = require("../db/videoGames");

// GET - /api/video-games - get all video games
router.get("/", async (req, res, next) => {
    try {
        const videoGames = await getAllVideoGames();
        res.send(videoGames);
    } catch (error) {
        next(error);
    }
});

// GET - /api/video-games/:id - get a single video game by id
router.get("/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const videoGame = await getVideoGameById(id);
        if (videoGame) {
            res.send(videoGame);
        } else {
            res.status(404).send("Video game not found");
        }
    } catch (error) {
        next(error);
    }
});

// POST - /api/video-games - create a new video game
router.post("/", async (req, res, next) => {
    try {
        const newVideoGame = await createVideoGame(req.body);
        res.send(newVideoGame);
    } catch (error) {
        next(error);
    }
});

// PUT - /api/video-games/:id - update a single video game by id
router.put("/:id", async (req, res, next) => {
    const id = req.params.id;
    const body = req.body
    try {
        const changedVideoGame = await updateVideoGame(id, body);
        res.send(changedVideoGame);
    } catch (error) {
        next(error);
    }
});

// DELETE - /api/video-games/:id - delete a single video game by id
router.delete("/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const deletedGame = await deleteVideoGame(id);
        if (deletedGame) {
            res.send(deletedGame);
        } else {
            res.status(404).send("Video game not found");
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
