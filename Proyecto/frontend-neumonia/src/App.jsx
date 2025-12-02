import React, { useState } from 'react';
import { Upload, Activity, AlertCircle, CheckCircle, FileText } from 'lucide-react';

const App = () => {

  // CAMBIAR AQUÍ TU URL DE NGROK
  const API_URL = "https://practic-thomasine-waggishly.ngrok-free.dev/predict";

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handlePredict = async () => {
    if (!image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);

    try {
      const res = await fetch(API_URL, { method: "POST", body: formData });
      const data = await res.json();

      if (data.error) throw new Error(data.error);
      setResult(data);

    } catch (err) {
      alert("Error conectando con la API. Revisa la URL NGROK.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Activity size={32} />
            <h1 className="text-2xl font-bold">MediScan AI | Neumonía</h1>
          </div>
          <span className="text-xs bg-blue-500 px-3 py-1 rounded-lg border border-blue-300">
            Proyecto Final
          </span>
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-8">

          {/* SUBIR IMAGEN */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Upload size={20} className="text-blue-500" /> Subir Radiografía
            </h2>

            <div className="border-2 border-dashed p-8 rounded-xl text-center relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />

              {preview ? (
                <img src={preview} className="max-h-64 mx-auto rounded-lg shadow" />
              ) : (
                <div className="text-gray-400">
                  <FileText size={48} className="mx-auto opacity-40 mb-2" />
                  <p>Haz clic para subir</p>
                </div>
              )}
            </div>

            <button
              disabled={!image || loading}
              onClick={handlePredict}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold"
            >
              {loading ? "Analizando..." : "Analizar Imagen"}
            </button>
          </div>

          {/* RESULTADOS */}
          <div className="p-6 bg-slate-50 border rounded-xl">

            {result ? (
              <div className="text-center">
                <div className="mb-4 p-4 rounded-full bg-white shadow inline-block">
                  {result.diagnosis === "PNEUMONIA" ?
                    <AlertCircle size={48} className="text-red-500" /> :
                    <CheckCircle size={48} className="text-green-500" />
                  }
                </div>

                <h3 className="text-sm text-gray-400 uppercase">Diagnóstico</h3>
                <h2 className={`text-3xl font-extrabold my-2 ${
                  result.diagnosis === "PNEUMONIA" ? "text-red-600" : "text-green-600"
                }`}>
                  {result.diagnosis === "PNEUMONIA" ? "NEUMONÍA" : "NORMAL"}
                </h2>

                <p className="mt-3 text-gray-700 font-semibold">
                  Confianza: {result.confidence}
                </p>

              </div>

            ) : (
              <div className="text-center text-gray-400">
                <Activity size={48} className="mx-auto mb-2 opacity-30" />
                <p>Sin resultados aún...</p>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default App;
