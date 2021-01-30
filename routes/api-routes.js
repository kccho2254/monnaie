// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const user = require("../models/user");
const BudgetLineItem = require("../models/budget_line_item");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  // Routes for interacting with budget information

  app.get("/api/budget_data", (req, res) => {
    // Otherwise send back budget data
    res.json({
      desc: req.body.desc,
      vendor: req.body.vendor,
      estimated_cost: req.body.estimated_cost,
      actual_cost: req.body.actual_cost,
      createdAt: req.body.createdAt,
      updatedAt: req.body.updatedAt
    });
  });
  app.get("/api/budget_categories", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back budget data
      //     res.json({
      //       desc: req.body.desc,
      //       vendor: req.body.vendor,
      //       estimated_cost: req.body.estimated_cost,
      //       actual_cost: req.body.actual_cost
      //     });
      //   }
      // });
      db.User.findOne({
        where: { id: req.user.id },
        include: [db.BudgetCategory],
        attributes: { exclude: ["password"] }
      }).then(user => {
        res.json(user);
      });
    }
  });
  app.post("/api/category", (req, res) => {
    if (!req.user) {
      res.json({});
    } else {
      db.BudgetCategory.create({
        desc: req.body.desc,
        UserId: req.user.id
      }).then(BudgetCategory => {
        res.json(BudgetCategory);
      });
    }
  });
  app.post("/api/budget_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      db.User.create({
        desc: req.body.desc,
        vendor: req.body.vendor,
        estimated_cost: req.body.estimated_cost,
        actual_cost: req.body.actual_cost
      });
    }
  });
  // app.put("/api/budget_data", (req, res) =>{
  //   if (!req.user) {
  //     // The user is not logged in, send back an empty object
  //     res.json({});

  // });
  app.delete("/api/budget_data/:id", (req, res) => {
    const condition = "id = " + req.params.id;

    user.delete(condition, result => {
      if (result.affectedRows === 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      }
      res.status(200).end();
    });
  });
  //   db.User.destroy({
  //     where: {
  //       id: req.params.id
  //     }
  //   }).then(dbUser => {
  //     res.json(dbUser);
  //   });
  // });
};
