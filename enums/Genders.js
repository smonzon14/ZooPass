const options = {Other: 0, Male: 1, Female: 2};
const Genders = {
  ...options,
  valueToKey: (val) => {
    return Object.keys(options)[val];
  },
};

export default Genders;
