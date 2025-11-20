import React, { useEffect, useRef, useState } from "react";
import Quagga from "quagga";
import { XMarkIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

const BarcodeScanner = ({ isOpen, onClose, onScan }) => {
  const scannerRef = useRef(null);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("");

  useEffect(() => {
    // Ambil daftar kamera
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoDevices = devices.filter((device) => device.kind === "videoinput");
        setCameras(videoDevices);
        if (videoDevices.length > 0) {
          // Otomatis pilih kamera pertama (bisa jadi DroidCam kalau default)
          setSelectedCamera(videoDevices[0].deviceId);
        }
      })
      .catch((err) => {
        console.error("Gagal mendapatkan daftar kamera:", err);
      });
  }, []);

  useEffect(() => {
    let isQuaggaInitialized = false;
    const handleDetection = (result) => {
      Quagga.offDetected(handleDetection);
      onScan(result.codeResult.code);
      Quagga.stop();
      isQuaggaInitialized = false;
      onClose();
    };

    if (isOpen && selectedCamera) {
      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: scannerRef.current,
            constraints: {
              width: 480,
              height: 320,
              deviceId: selectedCamera, // Kamera yang dipilih (bisa DroidCam)
            },
          },
          decoder: {
            readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader", "code_39_vin_reader", "codabar_reader", "upc_reader", "upc_e_reader", "i2of5_reader"],
          },
          locate: true,
        },
        (err) => {
          if (err) {
            console.error(err);
            // console.error("Gagal menginisialisasi Quagga:", err);
            toast.error("Gagal mengakses kamera. Pastikan izin telah diberikan dan tidak ada aplikasi lain yang menggunakan kamera.");
            return;
          }
          Quagga.start();
          Quagga.onDetected(handleDetection);
        }
      );
    }

    return () => {
      if (isQuaggaInitialized) {
        Quagga.stop();
        isQuaggaInitialized = false;
      }
    };
  }, [isOpen, selectedCamera, onClose, onScan]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-[60]">
      <div className="bg-white rounded-lg shadow-xl p-4 w-full max-w-md relative">
        <h3 className="text-lg font-bold text-center mb-2">Arahkan Kamera ke Barcode</h3>

        <button onClick={onClose} className="absolute top-2 right-2 p-1 bg-white rounded-full hover:bg-gray-200 z-10">
          <XMarkIcon className="h-6 w-6 text-gray-700" />
        </button>

        {/* Pilihan kamera */}
        {cameras.length > 0 && (
          <select className="border p-2 rounded w-full mb-3" value={selectedCamera} onChange={(e) => setSelectedCamera(e.target.value)}>
            {cameras.map((cam, idx) => (
              <option key={cam.deviceId} value={cam.deviceId}>
                {cam.label || `Kamera ${idx + 1}`}
              </option>
            ))}
          </select>
        )}

        <div ref={scannerRef} className="w-full h-auto min-h-[240px]"></div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
