//PSEUDOCODE
/* GET - All Video Games
1. Start a GET route to '/api/video-games'
2. Call the function getAllVideoGames in router
3. Send the result (list of all video games) as the response
4. Define getAllVideoGames function
5. Write a database query to select all records from the videoGames table
6. Return the result
*/

/*GET - A Video Game by ID
1. Start a GET route to '/api/video-games/:id'
2. Extract the ID from the request parameters in the router
3. Call the function getVideoGameById with the ID
4. If a video game is found, send it as the response
5. If no video game is found, send a 404 response
6. Define getVideoGameById function:
7. Write a database query to select a record from the videoGames table by ID
8. Return the result
*/

/*POST - Create A Video Game
1. Start a POST route to '/api/video-games'
2. Extract the video game data from the request body in the router
3. Call the function createVideoGame with the video game data
4. Send the newly created video game as the response
5. Define createVideoGame function:
6. Write a database query to insert a new record into the videoGames table with the provided data
7. Return the newly created record
*/

/*PUT - Update A Video Game
1. Start a PUT route to '/api/video-games/:id'
2. Extract the ID from the request parameters
3. Extract the updated data from the request body
4. Call the function updateVideoGame with the ID and updated data
5. Send the updated video game as the response
6. Define updateVideoGame function:
7. Write a database query to update the record in the videoGames table by ID with the new data
8. Return the updated record
*/ 

/*DELETE - Delete A Video Game by ID
1. Start a DELETE route to '/api/video-games/:id'
2. Extract the ID from the request parameters
3. Call the function deleteVideoGame with the ID
4. Send a success response indicating the video game was deleted
5. Define deleteVideoGame function:
6. Write a database query to delete the record from the videoGames table by ID
7. Return confirmation of deletion
*/
const client = require("./client");
const util = require("util");


// GET - /api/video-games - get all video games
async function getAllVideoGames() {
    try {
        const {rows: videoGames} = await client.query(`
        SELECT * FROM videoGames`);
        return videoGames;
    } catch (error) {
        throw new Error("error");
    }
}

// GET - /api/video-games/:id - get a single video game by id
async function getVideoGameById(id) {
    try {
        const {
            rows: [videoGame],
        } = await client.query(
            `
            SELECT * FROM videoGames
            WHERE id = $1;
        `,
            [id]
        );
        return videoGame;
    } catch (error) {
        throw error;
    }
}

// POST - /api/video-games - create a new video game
async function createVideoGame(body) {
    try {
        const {name, description, price} = body;

        const {
            rows: [newVideoGame],
        } = await client.query(
            `
            INSERT INTO videoGames (name, description, price)
            VALUES ($1, $2, $3)
            RETURNING *;
        `,
            [name, description, price]
        );

        return newVideoGame;
    } catch (err) {
        console.error(err);
    }
}

// PUT - /api/video-games/:id - update a single video game by id
async function updateVideoGame(id, fields = {}) {
    const setString = Object.keys(fields)
        .map((key, index) => `"${key}"=$${index + 1}`)
        .join(", ");

    if (setString.length === 0) {
        return;
    }

    try {
        const {
            rows: [videoGame],
        } = await client.query(
            `
                UPDATE videoGames
                SET ${setString}
                WHERE id=$${Object.keys(fields).length + 1}
                RETURNING *;
            `,
            [...Object.values(fields), id]
        );

        return videoGame;
    } catch (error) {
        throw error;
    }
}


// DELETE - /api/video-games/:id - delete a single video game by id
async function deleteVideoGame(id) {
    try {
        const { rows: [videoGame] } = await client.query(`
            DELETE FROM videoGames
            WHERE id=$1
            RETURNING *;
        `, [id]);
        return videoGame;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllVideoGames,
    getVideoGameById,
    createVideoGame,
    updateVideoGame,
    deleteVideoGame,
};
