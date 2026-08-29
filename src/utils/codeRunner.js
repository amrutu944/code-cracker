// codeRunner.js
// Builds the sandboxed document that the Preview iframe executes, and the
// small in-iframe runtime script that forwards console output and runtime
// errors back to the parent application via postMessage.

// This script is injected into the iframe document. It runs inside the
// sandboxed iframe only — never in the parent application — and its sole
// job is to relay console activity and uncaught errors to the parent.
const CONSOLE_BRIDGE_SCRIPT = `
(function () {
  var send = function (payload) {
    try {
      window.parent.postMessage({ source: 'code-cracker-preview', ...payload }, '*');
    } catch (e) {
      /* ignore postMessage failures */
    }
  };

  function safeStringify(value) {
    if (typeof value === 'string') return value;
    if (value instanceof Error) return value.message || String(value);
    try {
      return JSON.stringify(value, null, 2);
    } catch (e) {
      try {
        return String(value);
      } catch (e2) {
        return '[Unserializable value]';
      }
    }
  }

  var methods = ['log', 'warn', 'error', 'info'];
  methods.forEach(function (method) {
    var original = console[method];
    console[method] = function () {
      var args = Array.prototype.slice.call(arguments);
      send({
        type: 'console',
        level: method,
        message: args.map(safeStringify).join(' '),
      });
      if (original) original.apply(console, args);
    };
  });

  window.addEventListener('error', function (event) {
    send({
      type: 'error',
      message: event.message || 'Script error',
      lineNumber: event.lineno || null,
      errorName: event.error && event.error.name ? event.error.name : 'Error',
    });
  });

  window.addEventListener('unhandledrejection', function (event) {
    var reason = event.reason;
    send({
      type: 'error',
      message: 'Unhandled promise rejection: ' + safeStringify(reason),
      lineNumber: null,
      errorName: reason && reason.name ? reason.name : 'Error',
    });
  });

  send({ type: 'ready' });
})();
`;

/**
 * Builds a complete, self-contained HTML document from the student's
 * HTML, CSS and JavaScript so it can be loaded into a sandboxed iframe.
 */
export function buildPreviewDocument({ html = '', css = '', javascript = '' }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<style>
  body { margin: 0; }
</style>
<style>
${css}
</style>
</head>
<body>
${html}
<script>${CONSOLE_BRIDGE_SCRIPT}</script>
<script>
try {
${javascript}
} catch (err) {
  window.parent.postMessage({
    source: 'code-cracker-preview',
    type: 'error',
    message: err && err.message ? err.message : String(err),
    errorName: err && err.name ? err.name : 'Error',
    lineNumber: null,
  }, '*');
}
</script>
</body>
</html>`;
}

export const DEVICE_SIZES = {
  desktop: { width: '100%', height: '100%', label: 'Desktop' },
  tablet: { width: '768px', height: '1024px', label: 'Tablet' },
  mobile: { width: '375px', height: '667px', label: 'Mobile' },
};
