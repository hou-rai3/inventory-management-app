import inventoryData from "../../data/inventory.json";
import InventoryBoard, { type InventoryItem } from "./components/InventoryBoard";

export default function Home() {
  const items = inventoryData.items as InventoryItem[];
  return <InventoryBoard initialItems={items} />;
}
