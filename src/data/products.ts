export type Material = "Polyethylene" | "Stainless Steel" | "Fiberglass";
export type UseCase = "Rumah Tangga" | "Industri" | "Komersial";

export type Dimensions = {
  diameterCm: number;
  heightCm: number;
};

export type Product = {
  slug: string;
  name: string;
  capacityLiters: number;
  material: Material;
  priceIDR: number;
  warrantyYears: number;
  useCase: UseCase;
  imageUrl: string;
  highlight?: string;
  dimensions: Dimensions;
  description: string;
  features: string[];
  certifications: string[];
};
