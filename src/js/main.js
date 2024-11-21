// Main JavaScript entry point

function initializeApp() {
  const testButton = document.getElementById('testButton');
  const testResult = document.getElementById('testResult');

  if (testButton && testResult) {
    testButton.addEventListener('click', () => {
      testResult.textContent = 'JavaScript is working! 🎉';
      testResult.className = 'mt-2 text-sm text-primary font-bold';
    });
  }
}

document.addEventListener('DOMContentLoaded', initializeApp);
