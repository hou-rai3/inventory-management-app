import inventoryData from "../../data/inventory.json";
import InventoryBoard from "./components/InventoryBoard";
import type { InventoryItem } from "@/lib/inventory-types";

export default function Home() {
  const items = inventoryData.items as InventoryItem[];
  return <InventoryBoard initialItems={items} />;
}
