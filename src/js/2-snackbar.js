import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#promise-form');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', e => {
  e.preventDefault();
  const fd = new FormData(form);
  const delay = Number(fd.get('delay'));
  const state = fd.get('state');

  if (!Number.isFinite(delay) || delay < 0) {
    iziToast.error({
      title: 'Помилка',
      message: 'Delay має бути числом ≥ 0',
      position: 'topRight',
    });
    return;
  }

  submitBtn.disabled = true;

  new Promise((resolve, reject) => {
    setTimeout(() => {
      state === 'fulfilled' ? resolve(delay) : reject(delay);
    }, delay);
  })
    .then(d => {
      iziToast.success({
        message: `✅ Fulfilled promise in ${d}ms`,
        position: 'topRight',
        timeout: 2500,
      });
    })
    .catch(d => {
      iziToast.error({
        message: `❌ Rejected promise in ${d}ms`,
        position: 'topRight',
        timeout: 2500,
      });
    })
    .finally(() => {
      submitBtn.disabled = false;
    });
});
