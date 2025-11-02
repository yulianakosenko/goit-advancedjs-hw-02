import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  input: document.querySelector('#datetime-picker'),
  btnStart: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let userSelectedDate = null;
let timerId = null;

setDisabled(refs.btnStart, true);

flatpickr(refs.input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const picked = selectedDates[0];
    if (!picked) return;

    if (picked.getTime() <= Date.now()) {
      userSelectedDate = null;
      setDisabled(refs.btnStart, true);
      iziToast.error({
        title: 'Увага',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      return;
    }
    userSelectedDate = picked;
    setDisabled(refs.btnStart, false);
  },
});

refs.btnStart.addEventListener('click', () => {
  if (!userSelectedDate) return;

  setDisabled(refs.btnStart, true);
  setDisabled(refs.input, true);
  updateTick();
  timerId = setInterval(updateTick, 1000);
});

function updateTick() {
  const ms = userSelectedDate.getTime() - Date.now();
  if (ms <= 0) {
    clearInterval(timerId);
    timerId = null;
    paint({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    setDisabled(refs.input, false);
    iziToast.success({
      title: 'Готово',
      message: 'Відлік завершено!',
      position: 'topRight',
    });
    return;
  }
  paint(convertMs(ms));
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  return { days, hours, minutes, seconds };
}

function pad(v) {
  return String(v).padStart(2, '0');
}

function paint({ days, hours, minutes, seconds }) {
  refs.days.textContent = pad(days);
  refs.hours.textContent = pad(hours);
  refs.minutes.textContent = pad(minutes);
  refs.seconds.textContent = pad(seconds);
}

function setDisabled(el, val) {
  val ? el.setAttribute('disabled', 'true') : el.removeAttribute('disabled');
}
