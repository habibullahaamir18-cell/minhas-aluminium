export interface Project {
  _id?: string;
  id?: number | string;
  title: string;
  category: string;
  location: string;
  images: string[];
  description: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  details: string;
  features: string[];
  qualitySpecs: string;
  images: string[];
}

export interface Stat {
  id: number;
  label: string;
  value: number;
  suffix: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
}