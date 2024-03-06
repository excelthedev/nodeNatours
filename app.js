const fs = require('fs');
const express = require('express'); // require express and assign it to a varibale
const morgan = require('morgan');

//we create a variable called app and assign it to an instance of express, which will assig a bunch of methods to it
const app = express();

// creating a middleware
app.use(morgan('dev')); // third  party middleware from npm

app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware, 👌');
  next(); //calling the next function
});
app.use((req, res, next) => {
  req.resquestTime = new Date().toISOString();
  next();
});

const port = 8000;

const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/dev-data/data/tours-simple.json`
  )
);

// ROUTE HANDLER FUNCTIONS FOR EACH ROUTE
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'sucesss',
    timeStatus: req.resquestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  console.log(req.params);

  const id = Number(req.params.id);

  // if (id > tours.length)
  //   return res.status(404).json({
  //     status: 'Not Found',
  //     message: 'Invalid ID',
  //   });

  const tour = tours.find((el) => el.id === id);

  if (!tour)
    return res.status(404).json({
      status: 'Not Found',
      message: 'Invalid ID',
    });

  res.status(200).json({
    status: 'sucesss',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign(
    {
      id: newId,
    },
    req.body
  );

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'Sucessfully Created',
        data: {
          tours: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  const id = Number(req.params.id);

  if (id > tours.length)
    return res.status(404).json({
      status: 'Not Found',
      message: 'Invalid ID',
    });

  res.status(200).json({
    status: 'Success',
    data: {
      tour: 'UPDATED TOUR ',
    },
  });
};

const deleteTour = (req, res) => {
  const id = Number(req.params.id);

  if (id > tours.length)
    return res.status(404).json({
      status: 'Not Found',
      message: 'Invalid ID',
    });

  res.status(200).json({
    status: 'Success',
    data: {
      tour: 'DELETED SUCCESFULLY',
    },
  });
};

// USER ROUTE HANDLER
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

//DEFINING ROUTE------ a more better way of writing ROUTES where you can chain the methods of the api route globaly other than one by one
const tourRouter = express.Router();

app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);

// for the id resource
app
  .route('/api/v1/tours/:id')
  .get(getTour)

  .patch(updateTour)
  .delete(deleteTour);

// User route
app
  .route('/api/v1/users')
  .get(getAllUsers)
  .post(createUser);

// for the id resource

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

//START SERVER-  creating the server with the port and a callback function
app.listen(port, () => {
  console.log(`App is up and running on Port:${port}...`);
});

/* FOMER WAY OF DEFINING ROUTE

app.get('/api/v1/tours', getAllTours);
app.get('/api/v1/tours/:id', getTour);
app.post('/api/v1/tours', createTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour);

*/

// defining routes in express, app.the-http-method you want to respond to and a route handler
//we used the .json method to pass in an object
// app.get('/', (req, res) => {
//   res.status(404).json({
//     status: 'sucesss',
//     data: { tours },
//   });
// });

// app.post('/', (req, res) => {
//   res.json({ data: 'You can post to this endpoint' });
// });
