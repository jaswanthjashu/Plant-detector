import React, { useState, useCallback } from 'react';
import { AppState, PlantInfo } from './types';
import Header from './components/Header';
import HeroUpload from './components/HeroUpload';
import PlantResults from './components/PlantResults';
import ChatBot from './components/ChatBot';
import { identifyPlant } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>('home');
  const [plantData, setPlantData] = useState<PlantInfo | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const resetApp = () => {
    setView('home');
    setPlantData(null);
    setImagePreview(null);
    setIsProcessing(false);
  };

  const handleImageSelect = useCallback(async (file: File) => {
    // 1. Create preview
    const reader = new FileReader();
    
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setIsProcessing(true);
      
      // 2. Extract pure base64 for API (remove data:image/xyz;base64, prefix)
      const base64Data = base64String.split(',')[1];

      try {
        const data = await identifyPlant(base64Data);
        setPlantData(data);
        setView('result');
      } catch (error) {
        console.error("Failed to analyze", error);
        alert("Could not identify the plant. Please try a different image.");
        setView('home');
        setImagePreview(null);
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsDataURL(file);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header resetApp={resetApp} />

      <main className="flex-1 relative">
        {view === 'home' && (
          <HeroUpload 
            onImageSelected={handleImageSelect} 
            isProcessing={isProcessing} 
          />
        )}

        {/* We keep the Hero mounted but maybe hidden or overlayed if we wanted fancy transitions, 
            but for simplicity, we just switch components. However, if isProcessing is true while in home, 
            HeroUpload handles the loading state visualization.
        */}

        {view === 'result' && plantData && imagePreview && (
          <div className="pb-24">
             <PlantResults plant={plantData} imagePreview={imagePreview} />
             <ChatBot plant={plantData} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;