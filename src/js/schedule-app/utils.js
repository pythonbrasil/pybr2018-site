export function getDayLabel(day){
  switch(day){
    case '17':
    case '18':
      return 'Tutoriais';
    case '19':
    case '20':
    case '21':
      return 'Palestras'
    default:
      return 'Sprints'
  }
}

export function getFormattedTime(time) {
  const hours = time.getHours();
  const minutes = time.getMinutes();

  return `${hours < 10 ? '0' + hours : hours}h${minutes < 10 ? '0' + minutes : minutes}`;
}
