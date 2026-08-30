// codeRunner.js

/*
 * Creates the HTML document used by the preview iframe.
 *
 * The iframe sends console messages and runtime errors
 * back to the React application using postMessage.
 */

function escapeScriptContent(value = '') {
  return String(value).replace(/<\/script/gi, '<\\/script');
}

const CONSOLE_BRIDGE_SCRIPT = `
(function () {
  'use strict';

  function send(type, level, message, lineNumber, errorName) {
    try {
      window.parent.postMessage(
        {
          source: 'code-cracker-preview',
          type: type,
          level: level || null,
          message: message || '',
          lineNumber: lineNumber || null,
          errorName: errorName || null
        },
        '*'
      );
    } catch (e) {
      // Ignore communication errors.
    }
  }

  function stringify(value) {
    if (typeof value === 'string') {
      return value;
    }

    if (value instanceof Error) {
      return value.message || String(value);
    }

    try {
      var result = JSON.stringify(value, null, 2);

      if (result === undefined) {
        return String(value);
      }

      return result;
    } catch (e) {
      return String(value);
    }
  }

  var consoleMethods = [
    'log',
    'info',
    'warn',
    'error'
  ];

  consoleMethods.forEach(function (method) {
    var original = console[method];

    console[method] = function () {
      var args = Array.prototype.slice.call(arguments);

      var message = args
        .map(function (item) {
          return stringify(item);
        })
        .join(' ');

      send(
        'console',
        method,
        message,
        null,
        null
      );

      if (original) {
        original.apply(console, args);
      }
    };
  });

  window.addEventListener(
    'error',
    function (event) {
      send(
        'error',
        'error',
        event.message || 'Script error',
        event.lineno || null,
        event.error && event.error.name
          ? event.error.name
          : 'Error'
      );
    }
  );

  window.addEventListener(
    'unhandledrejection',
    function (event) {
      var reason = event.reason;

      send(
        'error',
        'error',
        'Unhandled promise rejection: ' +
          stringify(reason),
        null,
        reason && reason.name
          ? reason.name
          : 'Error'
      );
    }
  );

  send(
    'ready',
    'info',
    'Preview ready',
    null,
    null
  );
})();
`;

/**
 * Builds the complete preview document.
 */
export function buildPreviewDocument({
  html = '',
  css = '',
  javascript = '',
}) {
  const safeHtml = String(html);

  const safeCss = escapeScriptContent(css);

  const safeJavascript =
    escapeScriptContent(javascript);

  const safeBridge =
    escapeScriptContent(
      CONSOLE_BRIDGE_SCRIPT
    );

  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',

    '<style>',
    'html, body {',
    '  margin: 0;',
    '  padding: 0;',
    '  min-height: 100%;',
    '}',
    '',
    'body {',
    '  box-sizing: border-box;',
    '}',
    '',
    '*, *::before, *::after {',
    '  box-sizing: inherit;',
    '}',
    '</style>',

    '<style>',
    safeCss,
    '</style>',

    '</head>',

    '<body>',
    safeHtml,

    '<script>',
    safeBridge,
    '</script>',

    '<script>',
    '(function () {',
    '  try {',
    safeJavascript,
    '  } catch (error) {',
    '    window.parent.postMessage(',
    '      {',
    "        source: 'code-cracker-preview',",
    "        type: 'error',",
    "        level: 'error',",
    "        message: error && error.message ? error.message : String(error),",
    "        errorName: error && error.name ? error.name : 'Error',",
    '        lineNumber: null',
    '      },',
    "      '*'",
    '    );',
    '  }',
    '})();',
    '</script>',

    '</body>',
    '</html>',
  ].join('\n');
}

export const DEVICE_SIZES = {
  desktop: {
    width: '100%',
    height: '100%',
    label: 'Desktop',
  },

  tablet: {
    width: '768px',
    height: '1024px',
    label: 'Tablet',
  },

  mobile: {
    width: '375px',
    height: '667px',
    label: 'Mobile',
  },
};