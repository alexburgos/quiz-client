export const getOptions = {
  method: 'GET',
  credentials: 'same-origin',
  cache: 'no-cache',
  headers: new Headers({
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  })
};

export const postOptions = {
  method: 'POST',
  credentials: 'same-origin',
  cache: 'no-cache',
  headers: new Headers({
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  })
};