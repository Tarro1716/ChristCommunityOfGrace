// Highlight active nav link based on current page
document.addEventListener('DOMContentLoaded', function () {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav .nav-link').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });
});