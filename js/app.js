const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
var navLinks = document.querySelectorAll(".nav-link");


navToggle.addEventListener("click", function () {
  var menuIsOpen = navMenu.classList.toggle("active");
  navToggle.classList.toggle("active");
  navToggle.setAttribute("aria-expanded", menuIsOpen);
});

navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    navMenu.classList.remove("active");
    navToggle.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Light / dark mode switch (the starting theme is set in the <head> of index.html)
var themeToggle = document.getElementById("theme-toggle");

function updateThemeButton() {
  var isLight = document.documentElement.getAttribute("data-theme") === "light";
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
}

themeToggle.addEventListener("click", function () {
  var isLight = document.documentElement.getAttribute("data-theme") === "light";
  var newTheme = isLight ? "dark" : "light";

  document.documentElement.setAttribute("data-theme", newTheme);
  try { localStorage.setItem("theme", newTheme); } catch (e) {}
  updateThemeButton();
});

updateThemeButton();

// Tell the CSS that JavaScript is running (used by the reveal animation)
document.documentElement.classList.add("js");

// Add a shadow to the header after scrolling down a little
var header = document.getElementById("header");

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 20);
}

window.addEventListener("scroll", updateHeader);
updateHeader();

// Highlight the menu link of the section currently on screen
var sections = document.querySelectorAll("main section[id]");
var menuLinks = document.querySelectorAll(".nav-menu .nav-link");

var sectionObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;

    menuLinks.forEach(function (link) {
      var isCurrent = link.getAttribute("href") === "#" + entry.target.id;
      link.classList.toggle("active", isCurrent);
    });
  });
}, { rootMargin: "-45% 0px -50% 0px" });

sections.forEach(function (section) {
  sectionObserver.observe(section);
});

// Fade elements in when they scroll into view
var revealItems = document.querySelectorAll(".reveal");

var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealItems.forEach(function (item) {
  revealObserver.observe(item);
});

// Projects carousel: arrows and dots move the track one card at a time
var track = document.getElementById("carousel-track");
var prevBtn = document.getElementById("carousel-prev");
var nextBtn = document.getElementById("carousel-next");
var dotsBox = document.getElementById("carousel-dots");
var cards = track.querySelectorAll(".project-card");

// Distance from the start of one card to the start of the next
function getStep() {
  return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
}

// How many positions the carousel can stop at (e.g. 6 cards, 3 visible = 4 positions)
function getPositionCount() {
  var maxScroll = track.scrollWidth - track.clientWidth;
  return Math.round(maxScroll / getStep()) + 1;
}

function getCurrentPosition() {
  return Math.round(track.scrollLeft / getStep());
}

function goTo(position) {
  track.scrollLeft = position * getStep();
}

function buildDots() {
  dotsBox.innerHTML = "";
  var count = getPositionCount();

  for (var i = 0; i < count; i++) {
    var dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", "Go to project " + (i + 1));
    dot.addEventListener("click", goTo.bind(null, i));
    dotsBox.appendChild(dot);
  }

  updateCarousel();
}

function updateCarousel() {
  var current = getCurrentPosition();
  var dots = dotsBox.querySelectorAll(".carousel-dot");

  dots.forEach(function (dot, i) {
    dot.classList.toggle("active", i === current);
  });

  prevBtn.disabled = current <= 0;
  nextBtn.disabled = current >= dots.length - 1;
}

prevBtn.addEventListener("click", function () {
  goTo(getCurrentPosition() - 1);
});

nextBtn.addEventListener("click", function () {
  goTo(getCurrentPosition() + 1);
});

// Left / right arrow keys when the carousel is focused
track.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    goTo(getCurrentPosition() - 1);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    goTo(getCurrentPosition() + 1);
  }
});

track.addEventListener("scroll", updateCarousel);
window.addEventListener("resize", buildDots);
buildDots();

// Current year in the footer
document.getElementById("year").textContent = new Date().getFullYear();

// Contact form: opens the visitor's email app with the message filled in
var contactForm = document.getElementById("contact-form");
var formStatus = document.getElementById("form-status");

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  var name = contactForm.name.value.trim();
  var email = contactForm.email.value.trim();
  var message = contactForm.message.value.trim();

  var subject = encodeURIComponent("Portfolio message from " + name);
  var body = encodeURIComponent(message + "\n\nFrom: " + name + " (" + email + ")");

  window.location.href = "mailto:yoonmemephyo.dev@gmail.com?subject=" + subject + "&body=" + body;

  formStatus.textContent = "Thanks, " + name + "! Your email app should open now.";
  contactForm.reset();
});