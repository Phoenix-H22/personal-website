export type ProductDeckVisualType = "city-guide" | "vending" | "messaging";

export type ProductDeckItem = {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  accent: string;
  logo?: string | null;
  visualType: ProductDeckVisualType;
  status?: string;
};
