(function() {
  /**
   * Create a unique ID for every todo item
   * @returns {String} uuid todo item ID
   */
  window.uuid = function () {
    var i, random;
    var uuid = '';

    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
    }

    return uuid;
  };

  var trapFocusHandler = {};

  window.trapFocus = function(container, elementToFocus) {
    var focusableElements = Array.from(container.querySelectorAll('button:not([hidden]):not([disabled]), [href]:not([hidden]), input:not([hidden]):not([type="hidden"]):not([disabled]), select:not([hidden]):not([disabled]), textarea:not([hidden]):not([disabled]), [tabindex="0"]:not([hidden]):not([disabled]), summary:not([hidden]), [contenteditable]:not([hidden]), audio[controls]:not([hidden]), video[controls]:not([hidden])'));
    var first = focusableElements[0];
    var last = focusableElements[focusableElements.length - 1];

    if (elementToFocus) {
      elementToFocus.focus();
    } else {
      first.focus();
    }

    trapFocusHandler.keydown = function(event) {
      if (event.key !== 'Tab') {
        return;
      }

      // On the last focusable element and tab forward, focus the first element.
      if (event.target === last && !event.shiftKey) {
        event.preventDefault();
        first.focus();
      }

      // On the first focusable element and tab backward, focus the last element.
      if (event.target === first && event.shiftKey) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener('keydown', trapFocusHandler.keydown);
  };

  window.removeTrapFocus = function() {
    document.removeEventListener('keydown', trapFocusHandler.keydown);
  };
})();
