import express from 'express';
import exphbs from 'express-handlebars';

const app = express();

// Configure the app
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Define routes
app.get('/', (req, res) => {
  res.render('home');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});