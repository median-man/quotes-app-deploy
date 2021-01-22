const exphbs = require("express-handlebars");
const express = require("express");
const mysql = require("mysql");

const app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
const PORT = process.env.PORT || 8080;

// Use the express.static middleware to serve static content for the app from
// the "public" directory in the application directory.
app.use(express.static("public"));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "quotes_db"
});

connection.connect((err) => {
  if (err) {
    console.error(`error connecting: ${err.stack}`);
    return;
  }
  console.log(`connected as id ${connection.threadId}`);
});

// Serve index.handlebars to the root route, populated with all quote data.
app.get("/", (req, res) => {
  connection.query("SELECT * FROM quotes", (err, data) => {
    if (err) {
      return res.status(500).end();
    }

    res.render("index", { quotes: data });
  });
});

// Serve single-quote.handlebars, populated with data that corresponds to the ID
// in the route URL.
app.get("/:id", (req, res) => {
  connection.query(
    "SELECT * FROM quotes WHERE id = ?",
    req.params.id,
    (err, data) => {
      if (err) {
        return res.status(500).end();
      }

      res.render("single-quote", data[0]);
    }
  );
});

// Create a new quote using the data posted from the front-end.
app.post("/api/quotes", (req, res) => {
  connection.query(
    "INSERT INTO quotes (author, quote) VALUES (?, ?)",
    [req.body.author, req.body.quote],
    (err, result) => {
      if (err) {
        // If an error occurred, send a generic server failure
        return res.status(500).end();
      }

      // Send back the ID of the new quote
      res.json({ id: result.insertId });
    }
  );
});

// Delete a quote based off of the ID in the route URL.
app.delete("/api/quotes/:id", (req, res) => {
  connection.query(
    "DELETE FROM quotes WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        // If an error occurred, send a generic server failure
        return res.status(500).end();
      } else if (result.affectedRows === 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      }
      res.status(200).end();
    }
  );
});

// Update a quote.
app.put("/api/quotes/:id", (req, res) => {
  connection.query(
    "UPDATE quotes SET ? WHERE id = ?",
    [req.body, req.params.id],
    (err, result) => {
      res.end();
    }
  );
});

// Start our server so that it can begin listening to client requests.
app.listen(PORT, () => {
  // Log (server-side) when our server has started
  console.log(`Server listening on: http://localhost:${PORT}`);
});
