const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

let today = new Date();
let dateString = `${DAYS[today.getDay()]} ${MONTHS[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

module.exports = {
  today,
  dateString
};
