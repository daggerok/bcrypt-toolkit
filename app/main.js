'use strict';
////https://google.github.io/material-design-icons/ - too heavy..
// import 'material-design-icons/iconfont/material-icons.css';
import 'material-icons/iconfont/material-icons.scss';
import 'materialize-css/dist/css/materialize.css';
import './styles.css';

import 'jquery';
import 'materialize-css';
// window.$ = window.jQuery = require('jquery');
// require('materialize-css');

const bcrypt = require('bcryptjs');

// const encode = password => bcrypt.hashSync(`${password}/\/`);

/**
 * Generate BCrypt hash from password
 */

document.getElementById('password-to-hash').addEventListener('keypress', ({ keyCode, target }) => {
  if (13 !== keyCode) return;
  bcrypt.hash(target.value, 10, function (err, hash) {
    if (err) {
      console.error(err);
      return;
    }
    document.getElementById('password-to-hash-result').textContent = hash;
  });
  target.value = '';
}, false);

/**
 * Copy to clipboard.
 */
document.getElementById('copy-hash').addEventListener('click', () => {

  const result = document.getElementById('password-to-hash-result');
  const tmp = document.createElement('input');
  const id = Date.now().toString();

  tmp.setAttribute('id', id);
  tmp.value = result.textContent;
  document.body.appendChild(tmp);

  tmp.select();
  document.execCommand('Copy');
  result.textContent = 'Copied!';
  document.body.removeChild(tmp);

}, false);

// const correct = password => bcrypt.compareSync(`${password}/\/`);

/**
 * verify if password and hash are valid
 */

const verify = ({ keyCode }) => {
  if (13 !== keyCode) return;
  const hash = document.getElementById('a-hash').value;
  const password = document.getElementById('a-password').value;
  bcrypt.compare(password, hash, (err, res) => {
    if (err) {
      console.error(err);
    }
    document.getElementById('verify-hash-with-password-result').innerHTML = `
        <i class="material-icons" style="color: ${res ? 'green' : 'red'};">${res ? 'done' : 'close'}</i>
    `;
  });
};

document
  .getElementById('a-hash')
  .addEventListener('keypress', verify, false);

document
  .getElementById('a-password')
  .addEventListener('keypress', verify, false);

document
  .querySelector('#verify')
  .addEventListener('click', verify, false);

/**
 * cleanup fields
 */

const registerReviewOnClick = id => {

  const input = document.getElementById(id);
  const div = input.parentNode;
  const parentDiv = div.parentNode;

  parentDiv.querySelector('i').addEventListener('click', () => {
    input.value = '';
    if (id.indexOf('password') !== -1) password = '';
    if (id.indexOf('hash') !== -1) hash = '';
  }, false);
};

registerReviewOnClick('a-hash');
registerReviewOnClick('a-password');
