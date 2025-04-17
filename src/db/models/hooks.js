export const handleSaveError = (error, doc, next) => {
  const { name, code } = error;
  console.log(error.name);
  console.log(error.code);

  // console.log(error);
  error.status = code === 11000 && name === 'MongoServerError' ? 409 : 400;
  next();
};

export const setUpdateSettings = function (next) {
  (this.options.new = true), (this.options.runValidators = true), next();
};
