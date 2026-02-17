export type InventoryItem = {
  id: string;
  name: string;
  image: string;
  quantity: number;
  unit: string;
  threshold: number;
  unitPrice: number;
  purchaseUrl: string;
  location: string;
  updatedBy: string;
};

export type InventoryFormState = {
  name: string;
  quantity: string;
  unit: string;
  threshold: string;
  unitPrice: string;
  purchaseUrl: string;
  location: string;
  updatedBy: string;
};
