export interface TransformState {
  scale: number;
  positionX: number;
  positionY: number;
  rotation: number;
}

export interface ImageFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  grayscale: number;
  blur: number;
}

export interface GalleryItem {
  id: string;
  src: string;
  title: string;
}

export interface ProjectFolder {
  id: string;
  name: string;
  images: GalleryItem[];
}

export const DEFAULT_TRANSFORM: TransformState = {
  scale: 1,
  positionX: 0,
  positionY: 0,
  rotation: 0,
};

export const DEFAULT_FILTERS: ImageFilters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  grayscale: 0,
  blur: 0,
};