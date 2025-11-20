import React from 'react';
import { PlantInfo } from '../types';
import { SunIcon, WaterIcon, SoilIcon, TempIcon, WindIcon } from './Icons';

interface PlantResultsProps {
  plant: PlantInfo;
  imagePreview: string;
}

const Card: React.FC<{ title: string; value: string; icon: React.ElementType; color: string }> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="flex items-start gap-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <h3 className="font-semibold text-slate-700 mb-1">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{value}</p>
      </div>
    </div>
  </div>
);

const PlantResults: React.FC<PlantResultsProps> = ({ plant, imagePreview }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Section: Image & Main Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Image Column */}
        <div className="md:col-span-1">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border-4 border-white ring-1 ring-slate-100">
            <img 
              src={imagePreview} 
              alt="Plant Preview" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-emerald-700 shadow-sm border border-emerald-100 uppercase tracking-wide">
              {plant.difficulty} Care
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{plant.commonName}</h1>
            <p className="text-xl text-emerald-600 italic font-serif">{plant.scientificName}</p>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
            <p className="text-slate-600 leading-relaxed">{plant.description}</p>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 items-start">
            <div className="p-1 bg-amber-100 rounded-full">
                <SunIcon className="w-4 h-4 text-amber-600" />
            </div>
            <div>
                <span className="block text-amber-800 font-semibold text-sm mb-1">Fun Fact</span>
                <p className="text-amber-700 text-sm">{plant.funFact}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Care Cards Grid */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
            Care Instructions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card 
            title="Light" 
            value={plant.care.light} 
            icon={SunIcon} 
            color="bg-amber-500" 
          />
          <Card 
            title="Water" 
            value={plant.care.water} 
            icon={WaterIcon} 
            color="bg-blue-500" 
          />
          <Card 
            title="Soil" 
            value={plant.care.soil} 
            icon={SoilIcon} 
            color="bg-stone-500" 
          />
          <Card 
            title="Humidity" 
            value={plant.care.humidity} 
            icon={WindIcon} 
            color="bg-cyan-500" 
          />
          <Card 
            title="Temperature" 
            value={plant.care.temperature} 
            icon={TempIcon} 
            color="bg-red-500" 
          />
        </div>
      </div>
    </div>
  );
};

export default PlantResults;