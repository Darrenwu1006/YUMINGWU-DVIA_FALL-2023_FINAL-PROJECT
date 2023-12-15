//scroll button animation
document.addEventListener('DOMContentLoaded', function () {
  const scrollButton = document.getElementById('scrollButton');
  const scrollBackButton = document.getElementById('scrollBackButton');

  // Add click event listener to the scroll button
  scrollButton.addEventListener('click', function () {
    // Scroll to the top of page2 after the fade-out effect
    document.getElementById('page1').classList.add('fade-out');
    setTimeout(function () {
      document.getElementById('page2').scrollIntoView({
        behavior: 'smooth', // Disable smooth scrolling
        block: 'center',
        inline: 'center',
      });
    }, 0); // Adjust the delay (in milliseconds) based on your fade-out transition duration
  });

  // Add click event listener to the scroll back button
  scrollBackButton.addEventListener('click', function () {
    // Scroll to the top of page1
    document.getElementById('page1').classList.remove('fade-out');
    setTimeout(function () {
      document.getElementById('page1').scrollIntoView({
        behavior: 'smooth', // Disable smooth scrolling
      });
    },); // Adjust the delay (in milliseconds) based on your fade-out transition duration
  });
});



