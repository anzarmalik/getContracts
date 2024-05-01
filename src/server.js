require('dotenv').config();
const app = require('./config');

init();

async function init() {
  try {
    app.listen(process.env.PORT || 8000, () => {
      console.log('Express App Listening on Port 8000');
    });
  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}
