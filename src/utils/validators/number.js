export default (value, onSuccess, onError, maxValue, minValue, isInteger) => {
  let error = null;
  const reg = /^[0-9.]+$/g;
  const int = /^[0-9]+$/g;
  if (reg.test(value)) {
    if (Number(value) > minValue || minValue === undefined) {
      if (maxValue && Number(value) > maxValue) {
        error = `Max value is ${maxValue}`;
      } else {
        if (isInteger) {
          if (int.test(value)) {
            onSuccess && onSuccess();
            return Promise.resolve();
          } else {
            error = "Value must be an integer";
          }
        } else {
          onSuccess && onSuccess();
          return Promise.resolve();
        }
      }
    } else {
      error = `Min value is ${minValue}`;
    }
  } else {
    error = "This field is not valid";
  }
  onError && onError();
  return Promise.reject(error);
};
