import { useState } from 'react';
import DevicePreview from '../DevicePreview/DevicePreview.jsx';
import { DEVICE_SIZES } from '../../utils/codeRunner.js';

export default function Preview({ srcDoc, iframeRef, onRefresh, runId }) {
  const [device, setDevice] = useState('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const size = DEVICE_SIZES[device];

  return (
    <div className={`flex h-full min-h-0 flex-col bg-cc-panel ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cc-border bg-cc-panel2 px-3 py-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-cc-muted">Live Preview</span>
        <div className="flex items-center gap-2">
          <DevicePreview device={device} onChange={setDevice} />
          <button
            type="button"
            onClick={onRefresh}
            title="Refresh preview"
            className="flex h-8 w-8 items-center justify-center rounded-md text-cc-muted hover:bg-cc-bg hover:text-cc-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cc-accent2"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 4v5h5M20 20v-5h-5M4.5 15a8 8 0 0014.9 2.5M19.5 9A8 8 0 004.6 6.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="sr-only">Refresh preview</span>
          </button>
          <button
            type="button"
            onClick={() => setIsFullscreen((v) => !v)}
            title={isFullscreen ? 'Exit full preview' : 'Full preview'}
            className="flex h-8 w-8 items-center justify-center rounded-md text-cc-muted hover:bg-cc-bg hover:text-cc-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cc-accent2"
          >
            {isFullscreen ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 4v4H5M15 4v4h4M9 20v-4H5M15 20v-4h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 9V5h4M20 9V5h-4M4 15v4h4M20 15v4h-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            <span className="sr-only">Toggle full preview</span>
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-[#05070a] p-3">
        <div
          className="h-full max-h-full w-full overflow-hidden rounded-cc border border-cc-border bg-white shadow-xl transition-all"
          style={{ width: size.width, height: device === 'desktop' ? '100%' : size.height, maxWidth: '100%', maxHeight: '100%' }}
        >
          <iframe
            key={runId}
            ref={iframeRef}
            title="Code Cracker live preview"
            srcDoc={srcDoc}
            sandbox="allow-scripts"
            className="h-full w-full border-0 bg-white"
          />
        </div>
      </div>
    </div>
  );
}
