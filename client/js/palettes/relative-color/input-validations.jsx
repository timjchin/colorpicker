module.exports = {
  floatOnly: function (num) { 
    num = num.replace(/[^\d\.]+/g, '');
    num = num.match(/^\d+(\.\d{0,50})?/);
    if (num) num = num[0];
    return num;
  },
};
