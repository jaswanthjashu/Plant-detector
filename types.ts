export interface PlantCare {
  light: string;
  water: string;
  soil: string;
  humidity: string;
  temperature: string;
}

export interface PlantInfo {
  commonName: string;
  scientificName: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  care: PlantCare;
  funFact: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type AppState = 'home' | 'analyzing' | 'result';