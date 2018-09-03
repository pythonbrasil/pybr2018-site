import moment from 'moment-timezone';

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
  return moment(time).tz('America/Fortaleza').format('HH[h]mm');
}
