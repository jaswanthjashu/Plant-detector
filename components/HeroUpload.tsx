import React, { useCallback, useState } from 'react';
import { UploadIcon, ImageIconSVG, LoaderIcon } from './Icons';

interface HeroUploadProps {
  onImageSelected: (file: File) => void;
  isProcessing: boolean;
}

const HeroUpload: React.FC<HeroUploadProps> = ({ onImageSelected, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelected(e.dataTransfer.files[0]);
    }
  }, [onImageSelected]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  }, [onImageSelected]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12 text-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50 via-slate-50 to-slate-100">
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
            Your Personal <br/>
            <span className="text-emerald-600">Plant Expert</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-lg mx-auto">
            Identify plants instantly and get detailed care tips powered by AI. Just snap a photo or upload an image to get started.
          </p>
        </div>

        <div 
          className={`relative group cursor-pointer transition-all duration-300 ease-in-out transform 
            ${dragActive ? 'scale-[1.02] border-emerald-500 bg-emerald-50/50' : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-xl'}
            border-2 border-dashed rounded-3xl p-10 md:p-16 w-full max-w-xl mx-auto shadow-sm`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <input 
            id="file-upload"
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleChange}
            disabled={isProcessing}
          />
          
          <div className="flex flex-col items-center gap-4">
            {isProcessing ? (
              <>
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-75"></div>
                  <div className="relative bg-white p-4 rounded-full shadow-md border border-emerald-100">
                    <LoaderIcon className="w-10 h-10 text-emerald-600 animate-spin" />
                  </div>
                </div>
                <p className="text-lg font-medium text-slate-700 animate-pulse">Analyzing your plant...</p>
              </>
            ) : (
              <>
                <div className="bg-emerald-100 p-5 rounded-full group-hover:bg-emerald-200 transition-colors duration-300">
                  <UploadIcon className="w-10 h-10 text-emerald-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-semibold text-slate-800">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-sm text-slate-500">
                    SVG, PNG, JPG or GIF (max. 5MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-8 text-sm text-slate-400 pt-8">
           <div className="flex items-center gap-2">
             <ImageIconSVG className="w-4 h-4" />
             <span>High Accuracy</span>
           </div>
           <div className="flex items-center gap-2">
             <UploadIcon className="w-4 h-4" />
             <span>Instant Results</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HeroUpload;