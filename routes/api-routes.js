// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");

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
      password: req.body.password,
    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch((err) => {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Edits to GET route for user data

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's data
      // Sending back a password, even a hashed password, isn't a good idea
      db.User.findOne({
        where: {
          id: req.user.id
        },
        include: [db.BudgetCategory, db.BudgetLineItem],
        attributes: {
          exclude: ["password"]
        }
      }).then((user) => {
        res.json(user);
      });
    }
  });

  // Route for getting all default categories that are not assigned to any users
  app.get("/api/default_categories", (req, res) => {
    if (!req.user) {
      res.json({});
    } else {
      db.BudgetCategory.findAll({
        where: {
          UserId: null // we filter on UserId == null, because these categories are not assigned to a user.
        }
      }).then(defaultCategories => {
        res.json(defaultCategories);
      });
    }
  });

  // Brand new code for posting new category
  app.post("/api/category", (req, res) => {
    if (!req.user) {
      res.json({});
    } else {
      db.BudgetCategory.create({
        desc: req.body.desc,
        UserId: req.user.id
      }).then(budgetCategory => {
        res.json(budgetCategory);
      });
    }
  });

  // Code for PUT, updating a category
  app.put("/api/category", (req, res) => {
    if (!req.user) {
      res.json({});
    } else {
      db.BudgetCategory.update(
        {
          desc: req.body.desc
        },
        {
          where: {
            id: req.body.id,
            UserId: req.user.id // Restrict only user to modify their own custom category
          }
        }
      ).then((budgetCategory) => {
        res.json(budgetCategory);
      });
    }
  });

  // Posting a new line item
  app.post("/api/lineitem", (req, res) => {
    if (!req.user) {
      res.json({});
    } else {
      db.BudgetLineItem.create({
        desc: req.body.desc,
        vendor: req.body.vendor,
        estimated_cost: req.body.estimated_cost,
        actual_cost: req.body.actual_cost,
        BudgetCategoryId: req.body.BudgetCategoryId,
        UserId: req.user.id
      }).then((budgetLineItem) => {
        res.json(budgetLineItem);
      });
    }
  });

  // Code for PUT, updating a line item
  app.put("/api/lineitem", (req, res) => {
    if (!req.user) {
      res.json({});
    } else {
      db.BudgetLineItem.update(
        {
          desc: req.body.desc,
          vendor: req.body.vendor,
          estimated_cost: req.body.estimated_cost,
          actual_cost: req.body.actual_cost
        },
        {
          where: {
            BudgetCategoryId: req.body.BudgetCategoryId,
            UserId: req.user.id // Restrict only user to modify their own budget line item
          }
        }
      ).then((budgetLineItem) => {
        res.json(budgetLineItem);
      });
    }
  });
};
