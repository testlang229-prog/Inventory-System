let lastUpdated = Date.now();

const updateLastUpdated = () => {
  lastUpdated = Date.now();
};

const getLastUpdated = () => {
  return lastUpdated;
};

module.exports = {
  updateLastUpdated,
  getLastUpdated,
};