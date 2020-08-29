const loader = document.getElementById('loader');
const work_buttons = document.querySelector('.work_menu').children;
const work_button = document.querySelectorAll('.work_btn');
const header = document.querySelector('.header');
const workMenu = document.querySelector('.work_menu');
const navbar = document.getElementById('navbar');
const video = document.getElementById('video');

window.addEventListener('load', () => {
  if (document.body.classList.contains('overflow')) {
    document.body.classList.remove('overflow');
  }

  navbar.classList.add('show');

  loader.classList.add('finished');
});

let currentBtn = work_buttons[0];
[...work_buttons].forEach((btn, index, btns) => {
  btn.addEventListener('click', () => {
    if (currentBtn !== btn) {
      currentBtn.classList.remove('btn_primary');
      currentBtn = btn;
      btn.classList.add('btn_primary');
    }
  });
});

// work_button.forEach((btn) => {
//   btn.addEventListener('click', function () {
//     addClass(this);
//   });
// });

// function addClass(btn) {
//   work_button.forEach((btn) => btn.classList.remove('btn_primary'));
//   btn.classList.add('btn_primary');
// }

window.addEventListener('scroll', () => {
  const windowHeight = window.innerHeight;
  // console.log(document.documentElement.clientHeight); // pareil

  const contactForm = document.querySelector('#form').getBoundingClientRect()
    .top;
  const windowHalfHeight = window.innerHeight / 2;

  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop >= windowHeight / 4) {
    navbar.style.opacity = 0.97;
  } else {
    navbar.style.opacity = 1;
  }

  // if (window.innerHeight + clientHeight > scrollTop - 100) {
  //   video.pause();
  // } else {
  //   video.play();
  // }
  if (windowHalfHeight > contactForm) {
    video.play();
  } else {
    video.pause();
  }
});

// + svg animation
const list = document.getElementById('list');
const leftHand = document.getElementById('left_hand');
const man = document.getElementById('man');

// window.addEventListener('scroll', () => {
//   const listPos = list.getBoundingClientRect().top;
//   const windowHeight = window.innerHeight / 1.6;
//   console.log('Output: windowHeight', windowHeight);
//   console.log(listPos);
//   if (listPos < windowHeight) {
//     list.classList.add('show');
//     leftHand.classList.add('show');
//     man.classList.add('show');
//   }
// });

//+ pareil
let options = {
  threshold: 0.5, // + quand l'element arrive à la moitie de l'ecran
};
let observer = new IntersectionObserver(animateSvg, options);

function animateSvg(entries) {
  entries.forEach((entry) => {
    // console.log(entry);
    if (entry.isIntersecting) {
      // entry.target.style.display = 'none';
      list.classList.add('show');
      leftHand.classList.add('show');
      man.classList.add('show');
    }
  });
}

observer.observe(workMenu);
observer.observe(list);

const controller = new ScrollMagic.Controller();

const exploreScene = new ScrollMagic.Scene({
  triggerElement: '.work_section .heading',
  triggerHook: 0.3,
})
  // .addIndicators({ colorStart: 'blue', colorTrigger: 'black' })
  .setClassToggle('.work_section .heading', 'active')
  .addTo(controller);

const contactBtn = document.getElementById('contact');
const form = document.querySelector('.form_submission');

contactBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  // const formTop = form.getBoundingClientRect().top;

  // document.documentElement.scrollTop = formTop;

  // // const href = e.target.href; // "http://localhost:1234/#form"
  const href = e.target.hash; // "http://localhost:1234/#form"
  const offsetTop = document.querySelector(href).offsetTop;

  console.log({ href, offsetTop });

  scroll({
    top: offsetTop,
    behavior: 'smooth',
  });

  // console.log(formTop);
  // console.dir(e);
});

const upBtn = document.querySelector('.upBtn');

window.addEventListener(
  'wheel',
  throttle((e) => {
    // console.log(e.deltaY);
    if (window.scrollY >= 500) {
      if (e.deltaY < 0) {
        // upBtn.style.display = 'block';
        upBtn.classList.add('show');
      } else {
        upBtn.classList.remove('show');
      }
    } else {
      upBtn.classList.remove('show');
    }
  }, 800)
);
window.addEventListener(
  'touchmove',
  throttle((e) => {
    if (e.deltaY < 0) {
      // upBtn.style.display = 'block';
      upBtn.classList.add('show');
    } else {
      upBtn.classList.remove('show');
    }
  }, 800)
);

function throttle(fn, delay) {
  let inThrottle;
  return (e) => {
    if (!inThrottle) {
      fn(e);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), delay);
    }
  };
}

upBtn.addEventListener('click', (e) => {
  e.preventDefault();
  // this = upBtn

  // document.documentElement.scrollTop = 0;

  scroll({
    top: 0,
    behavior: 'smooth',
  });

  window.removeEventListener('wheel', throttle);
  // window.removeEventListener('touchmove', throttle);
  upBtn.classList.remove('show');
});
