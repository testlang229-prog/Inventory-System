// frontend/src/components/QRScanner.jsx
// Component for scanning QR codes and barcodes using device camera

import { useRef, useState, useEffect } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { processScan } from '../services/api';
import scannerIcon from '../assets/icons/scanner-icon.png';
import cameraIcon from '../assets/icons/camera-icon.png';
import stopIcon from '../assets/icons/stop-icon.png';
import processingIcon from '../assets/icons/processing-icon.png';

const SUPPORTED_SCAN_FORMATS = [
  Html5QrcodeSupportedFormats.QR_CODE,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.CODE_93,
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.ITF,
  Html5QrcodeSupportedFormats.CODABAR,
];

export default function QRScanner({ onScanSuccess, onScanError }) {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [manualScanValue, setManualScanValue] = useState('');
  const scannerInstanceRef = useRef(null);
  const lastScannedTimeRef = useRef(0);

  const playScanBeep = () => {
  try {
    const audioContext = new (
      window.AudioContext ||
      window.webkitAudioContext
    )();

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(
      900,
      audioContext.currentTime
    );

    gainNode.gain.setValueAtTime(
  0.3,
  audioContext.currentTime
);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();

    oscillator.stop(
      audioContext.currentTime + 0.12
    );
  } catch (error) {
    console.error('Beep failed:', error);
  }
};

  /**
   * Process a camera scan or manually entered asset/barcode value.
   */
  const handleScanValue = async (scanValue, shouldResumeScanner = false) => {
    const trimmedValue = scanValue.trim();

    if (!trimmedValue) {
      onScanError('Enter an asset number, serial number, or barcode value');
      return;
    }

    setIsLoading(true);

    try {
      const result = await processScan(
  trimmedValue,
  shouldResumeScanner
    ? 'QR'
    : 'MANUAL'
);
      onScanSuccess(result);
      playScanBeep();
      setManualScanValue('');

      if (result.action === 'NEW_ASSET' && shouldResumeScanner && scannerInstanceRef.current) {
        await stopScanner();
        return;
      }
    } catch (error) {
      onScanError(error.message || 'Failed to process scan');
    } finally {
      if (shouldResumeScanner && scannerInstanceRef.current) {
        setTimeout(() => {
          try {
            const resumeResult = scannerInstanceRef.current?.resume();
            if (resumeResult?.catch) {
              resumeResult.catch(() => {});
            }
          } catch {
            // Scanner may already be stopped or unmounted.
          }
          setIsLoading(false);
        }, 1000);
      } else {
        setIsLoading(false);
      }
    }
  };

  const handleManualSubmit = async (event) => {
    event.preventDefault();
    await handleScanValue(manualScanValue);
  };

  /**
   * Initialize code scanner
   */
  const startScanner = async () => {
    try {
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          'Camera access requires HTTPS or localhost. Open the app using http://localhost, not a network IP address.'
        );
      }

      setIsScanning(true);

      // Ask for camera permission immediately from the user's button click.
      const permissionStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      permissionStream.getTracks().forEach((track) => track.stop());

      const scanner = new Html5Qrcode('qr-scanner', false);
      scannerInstanceRef.current = scanner;

      // Handle successful scan
      const onScanSuccessHandler = async (decodedText) => {
        // Prevent duplicate scans within 2 seconds
        const now = Date.now();
        if (now - lastScannedTimeRef.current < 2000) {
          return;
        }
        lastScannedTimeRef.current = now;

        // Stop scanner while processing
        scanner.pause(true);
        await handleScanValue(decodedText, true);
      };

      // Handle scan error
      const onScanErrorHandler = () => {
        // Ignore errors - scanner will keep trying
      };

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: {
            width: 300,
            height: 180,
          },
          aspectRatio: 1.0,
          disableFlip: false,
          formatsToSupport: SUPPORTED_SCAN_FORMATS,
        },
        onScanSuccessHandler,
        onScanErrorHandler
      );
    } catch (error) {
      scannerInstanceRef.current = null;
      onScanError(
        error.message ||
          'Failed to access camera. Make sure you gave permission.'
      );
      setIsScanning(false);
    }
  };

  /**
   * Stop scanner
   */
  const stopScanner = async () => {
    try {
      if (scannerInstanceRef.current) {
        if (scannerInstanceRef.current.isScanning) {
          await scannerInstanceRef.current.stop();
        }
        scannerInstanceRef.current.clear();
        scannerInstanceRef.current = null;
      }
      setIsScanning(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Error stopping scanner:', error);
    }
  };

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="bg-[#FCFBF7] backdrop-blur-2xl rounded-[28px] md:rounded-[32px] border border-white/50 shadow-[0_12px_40px_rgba(212,160,23,0.08)] p-4 md:p-5">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">

  <img
    src={scannerIcon}
    alt="Scanner"
    className="w-8 h-8"
  />

  <span>Barcode Scanner</span>

</h2>

      {!isScanning ? (
        <>
          <div id="qr-scanner" className="hidden"></div>
          <button
            onClick={startScanner}
            className="w-full px-6 py-4 parchment-button text-slate-800 rounded-2xl hover:scale-[1.01] transition-all duration-300 font-semibold shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
          >
            <div className="flex items-center justify-center gap-2">

  <img
    src={cameraIcon}
    alt="Camera"
    className="w-5 h-5"
  />

  <span>Start Camera</span>

</div>
          </button>
        </>
      ) : (
        <div>
          {/* Scanner Container */}
          <div
  id="qr-scanner"
  className="mb-4 rounded-lg overflow-hidden w-full"
></div>

          {/* Scanner Controls */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={stopScanner}
              className="flex-1 px-6 py-3 bg-gradient-to-br from-red-400 to-rose-500 text-white rounded-2xl hover:scale-[1.01] transition-all duration-300 shadow-[0_8px_24px_rgba(239,68,68,0.15)]"
            >
              <div className="flex items-center justify-center gap-2">

  <img
    src={stopIcon}
    alt="Stop"
    className="w-5 h-5"
  />

  <span>Stop Camera</span>

</div>
            </button>
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2">

  <img
    src={processingIcon}
    alt="Processing"
    className="w-5 h-5 animate-spin"
  />

  <p className="text-blue-700 font-semibold">
    Processing scan...
  </p>

</div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              💡 <strong>Tip:</strong> Point your camera at a QR code or barcode.
              The scanner will automatically detect and process it.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleManualSubmit} className="mt-4 border-t border-gray-200 pt-4">
        <label
          htmlFor="manual-scan-value"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Manual Scan
        </label>
        <div className="flex flex-col lg:flex-row gap-3 items-stretch">
          <input
            id="manual-scan-value"
            type="text"
            value={manualScanValue}
            onChange={(event) => setManualScanValue(event.target.value)}
            placeholder="Enter asset #, serial #, or barcode"
            disabled={isLoading}
            className="w-full lg:flex-1 px-4 py-3 border border-white/60 bg-white/60 backdrop-blur-xl rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:bg-slate-100 shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
          />
          <button
            type="submit"
            disabled={isLoading || manualScanValue.trim().length === 0}
            className="w-full lg:w-auto lg:min-w-[140px] px-5 py-3 parchment-button text-slate-800 rounded-2xl hover:scale-[1.01] disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
          >
            {isLoading ? 'Processing' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}
