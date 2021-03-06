const app = require('../app');
const db = require('../models');

const PORT = process.env.PORT || 3000;

db.sequelize
  .authenticate()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Database connection successful. PORT: ${PORT}`);
    });
  })
  .catch(err => {
    console.log(`Server not run. Error: ${err.message}`);
    process.exit(1);
  });
