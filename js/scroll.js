const navLinks = document.querySelector(".nav-links");
const menuIcon = document.querySelector(".menu-icon");
const navbar = document.querySelector("nav");
let navbarOffset = navbar.offsetTop;

function isElementInViewport(el) {
  let rect = el.getBoundingClientRect();
  let visible =
    rect.bottom > 0 &&
    rect.top < (window.innerHeight || document.documentElement.clientHeight);
  if (!visible) return false;
  return rect.height / 2 < rect.height + rect.top;
}

var block_updates = false;
function handleClickLink(event) {
  const block = event.target.dataset.block;
  block_updates = true;
  goto(document.getElementById(block).offsetTop);
  setActive(block);
  navLinks.classList.remove("active");
}

document.querySelectorAll(".link").forEach((elem) => {
  elem.addEventListener("click", handleClickLink);
});

var last_update = 0;
window.addEventListener(
  "scroll",
  function () {
    if (block_updates) return;
    if (this.performance.now() - last_update > 200) {
      updateActive();
      last_update = this.performance.now();
    }
  },
  {
    passive: true,
  }
);

window.addEventListener(
  "scrollend",
  function () {
    if (block_updates) {
      block_updates = false;
      return;
    }
    updateActive();
    last_update = this.performance.now();
  },
  {
    passive: true,
  }
);

function updateActive() {
  let targets = [];
  document.querySelectorAll(".link").forEach((link) => {
    let link_target = document.getElementById(link.dataset.block);
    targets.push(link_target);
  });
  for (let target of targets) {
    if (isElementInViewport(target)) {
      setActive(target.id);
      break;
    }
  }
}

function setActive(id) {
  window.history.replaceState(null, null, "#" + id);
  document.querySelectorAll(".link").forEach((link) => {
    if (link.dataset.block == id) {
      if (window.scrollY !== 0) link.classList.add("active-link");
    } else link.classList.remove("active-link");
  });
}

function goto(y) {
  let offset = 0;
  // weird multiplier to get it working on all systems
  if (y > navbar.offsetTop * 1.1) {
    offset = navbar.offsetHeight;
  }
  window.scroll({ top: y - offset, behavior: "smooth" });
}

window.addEventListener("resize", function (event) {
  navbarOffset = navbar.offsetTop;
}, {
  passive: true
});

// prevent automatic scroll restoration
if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
}

// initial scroll
if (window.location.hash) {
  let hash_id = window.location.hash.slice(1);
  let element = document.getElementById(hash_id);
  if (element) {
    goto(element.offsetTop);
    setActive(hash_id);
  }
}

menuIcon.addEventListener("click", function () {
  navLinks.classList.toggle("active");
});
