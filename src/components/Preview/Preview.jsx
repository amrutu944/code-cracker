import { useState } from 'react';
import DevicePreview from '../DevicePreview/DevicePreview.jsx';
import { DEVICE_SIZES } from '../../utils/codeRunner.js';
import { RotateCw, Maximize2, Minimize2, Eye } from 'lucide-react';

export default function Preview({ srcDoc, iframeRef, onRefresh, runId }) {
  const [device, setDevice] = useState('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const size = DEVICE_SIZES[device];

  return (
    <div className={`flex h-full min-h-0 flex-col bg-cc-panel ${isFullscreen ? 'fixed inset-0 z-50 p-4 bg-black/90 backdrop-blur-md' : ''}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cc-border bg-cc-panel2 px-3 py-2">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-cc-accent" />
          <span className="text-xs font-bold uppercase tracking-wider text-cc-text">Live Preview</span>
        </div>
        <div className="flex items-center gap-2">
          <DevicePreview device={device} onChange={setDevice} />
          <button
            type="button"
            onClick={onRefresh}
            title="Refresh preview"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-cc-muted hover:bg-cc-border hover:text-cc-text transition"
          >
            <RotateCw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsFullscreen((v) => !v)}
            title={isFullscreen ? 'Exit full preview' : 'Full preview'}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-cc-muted hover:bg-cc-border hover:text-cc-text transition"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-[#05070a] p-3">
        <div
          className="h-full max-h-full w-full overflow-hidden rounded-xl border border-cc-border bg-white shadow-2xl transition-all"
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
