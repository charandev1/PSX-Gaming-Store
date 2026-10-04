const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const formatTimestamp = (timestamp: number) => {
  const event = new Date(timestamp);
  return `${days[event.getDay()]} ${months[event.getMonth()]} ${
    event.getDate() < 10 ? '0' + event.getDate() : event.getDate()
  } ${event.getFullYear()}`;
};
