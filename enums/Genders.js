const GendersEnum = {Other: 0, Male: 1, Female: 2};
const Genders = {
  ...GendersEnum,
  valueToKey: (val) => {
    return Object.keys(GendersEnum)[val];
  },
};

export {GendersEnum};
export default Genders;
