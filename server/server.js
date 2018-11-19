const express = require("express");
const expressGraphql = require("express-graphql");
const { buildSchema } = require("graphql");
const cors = require("cors");

// ----------------------- GraphQL Schema -----------------------

const schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
    }
    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
    }
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
`);

const courses = [
  {
    id: 1,
    title: "NodeJs for Dummies",
    author: "Todd Smyth",
    description: "A very entry level course for NodeJs",
    topic: "NodeJs",
    url: "www.nodejs.org"
  },
  {
    id: 2,
    title: "ExpressJs for Dummies",
    author: "Todd Smyth",
    description: "A very entry level course for Express using NodeJs",
    topic: "NodeJs",
    url: "www.express-js.org"
  },
  {
    id: 3,
    title: "GraphQL for Dummies",
    author: "John Smith",
    description: "A very entry level course for GraphQL",
    topic: "GraphQL",
    url: "www.graphql.com"
  }
];

const getCourse = function(args) {
  // this could very much be improved but just an example
  const id = args.id;
  return courses.filter(c => c.id === parseInt(id))[0];
};

const getCourses = function(args) {
  if (!!args && !!args.topic) {
    const topic = args.topic;
    return courses.filter(c => c.topic === topic);
  } else {
    return courses;
  }
};

const updateCourseTopic = function({ id, topic }) {
  courses.map(course => {
    if (course.id === parseInt(id)) {
      course.topic = topic;
      return course;
    }
  });
  return courses.filter(c => c.id === parseInt(id))[0];
};

// resolver for graphQL
const root = {
  course: getCourse,
  courses: getCourses,
  updateCourseTopic: updateCourseTopic
};

// ----------------------- Express Server and GraphQL endpoint -----------------------
const app = express();
app.use(cors());
app.use(
  "/graphql",
  expressGraphql({
    schema: schema,
    rootValue: root,
    graphiql: true // tool running in browser that shows user interface showing graphql (sandbox)
  })
);

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
