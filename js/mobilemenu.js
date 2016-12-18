var navMain = document.querySelector('.main-navigation');
var navOpen = document.querySelector('.open-btn');
var navClose = document.querySelector('.close-btn');

navMain.classList.remove('main-navigation--nojs');
navOpen.classList.remove('button--nojs');
navClose.classList.remove('button--nojs');

navOpen.addEventListener('click', function() {
  navMain.classList.remove('main-navigation--closed');
  navMain.classList.add('main-navigation--opened');
});
navClose.addEventListener('click', function() {
  navMain.classList.remove('main-navigation--opened');
  navMain.classList.add('main-navigation--closed');
});
