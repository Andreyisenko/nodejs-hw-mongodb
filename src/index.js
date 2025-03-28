import express from 'express';
const PORT = 3000;

const app = express();
// const sum = 10;
// const message = 'Hello BoB Sinkler';
// console.log(message);
// console.log(sum);
app.get('/', (req, res) => {
    res.json({
      message: 'Hello BoB Sinkler',
    });
  });

app.listen(PORT, () => {
  console.log(`Servers running on port ${PORT}`);
});
