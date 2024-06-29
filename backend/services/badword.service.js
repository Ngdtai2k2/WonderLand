const badwordModel = require("../models/badword.model");
const Filter = require('bad-words');

const badWordService = {
  initializeFilter: async () => {
    try {
      const badWordsList = await badwordModel.find({}, "word");

      const customBadWords = badWordsList.map((item) => item.word);

      const filter = new Filter({ list: customBadWords });

      return filter;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = badWordService;
