'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

import inventoryData from "../../../../data/inventory.json";
import { loadInventory, saveInventory } from "@/lib/inventory-client";
import type { InventoryFormState, InventoryItem } from "@/lib/inventory-types";

const defaultImage = "/images/marbling-title.png";

const emptyForm: InventoryFormState = {
  name: "",
  quantity: "",
  unit: "",
  threshold: "",
  unitPrice: "",
  purchaseUrl: "",
  location: "",
  updatedBy: "",
};

const parseNumber = (value: string, label: string) => {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    throw new Error(`${label}を数値で入力してください`);
  }
  return num;
};

const normalizeString = (value: string, label: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${label}を入力してください`);
  }
  return trimmed;
};

const buildItemPayload = (form: InventoryFormState) => {
  return {
    name: normalizeString(form.name, "物品名"),
    quantity: parseNumber(form.quantity, "在庫"),
    unit: normalizeString(form.unit, "単位"),
    threshold: parseNumber(form.threshold, "閾値"),
    unitPrice: parseNumber(form.unitPrice, "単価"),
    purchaseUrl: normalizeString(form.purchaseUrl, "購入URL"),
    location: normalizeString(form.location, "保管場所"),
    updatedBy: normalizeString(form.updatedBy, "最終更新者"),
  };
};

const createNextId = (items: InventoryItem[]) => {
  const maxId = items.reduce((max, item) => {
    const match = item.id.match(/(\d+)/);
    if (!match) return max;
    const num = Number(match[1]);
    return Number.isFinite(num) && num > max ? num : max;
  }, 0);
  return `part-${String(maxId + 1).padStart(3, "0")}`;
};

export default function AddItemPage() {
  const router = useRouter();
  const [form, setForm] = useState<InventoryFormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const initialItems = inventoryData.items as InventoryItem[];

  const handleChange = (field: keyof InventoryFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    try {
      const payload = buildItemPayload(form);
      const items = loadInventory(initialItems);
      const nextId = createNextId(items);
      const nextItems = [
        ...items,
        {
          id: nextId,
          image: defaultImage,
          ...payload,
        },
      ];
      saveInventory(nextItems);
      router.push("/#inventory");
    } catch (err) {
      setError(err instanceof Error ? err.message : "入力内容を確認してください");
    }
  };

  return (
    <div className="inventory-page">
      <section className="inventory-form">
        <div className="inventory-form-header">
          <div>
            <p className="section-eyebrow">Add Item</p>
            <h2>物品を追加</h2>
          </div>
          <div className="btn-row">
            <button className="btn secondary" type="button" onClick={() => router.push("/#inventory")}>
              一覧へ戻る
            </button>
            <button className="btn" type="button" onClick={handleAdd}>
              追加する
            </button>
          </div>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>物品名</label>
            <input
              type="text"
              placeholder="物品名"
              value={form.name}
              onChange={(event) => handleChange("name", event.target.value)}
            />
          </div>
          <div className="form-group">
            <label>在庫</label>
            <input
              type="number"
              step="0.01"
              placeholder="数"
              value={form.quantity}
              onChange={(event) => handleChange("quantity", event.target.value)}
            />
          </div>
          <div className="form-group">
            <label>単位</label>
            <input
              type="text"
              placeholder="単位"
              value={form.unit}
              onChange={(event) => handleChange("unit", event.target.value)}
            />
          </div>
          <div className="form-group">
            <label>閾値（要補充の基準）</label>
            <input
              type="number"
              step="0.01"
              placeholder="閾値"
              value={form.threshold}
              onChange={(event) => handleChange("threshold", event.target.value)}
            />
          </div>
          <div className="form-group">
            <label>単価（円）</label>
            <input
              type="number"
              step="1"
              placeholder="単価"
              value={form.unitPrice}
              onChange={(event) => handleChange("unitPrice", event.target.value)}
            />
          </div>
          <div className="form-group">
            <label>購入URL</label>
            <input
              type="url"
              placeholder="購入URL"
              value={form.purchaseUrl}
              onChange={(event) => handleChange("purchaseUrl", event.target.value)}
            />
          </div>
          <div className="form-group">
            <label>保管場所</label>
            <input
              type="text"
              placeholder="保管場所"
              value={form.location}
              onChange={(event) => handleChange("location", event.target.value)}
            />
          </div>
          <div className="form-group">
            <label>最終更新者</label>
            <input
              type="text"
              placeholder="最終更新者"
              value={form.updatedBy}
              onChange={(event) => handleChange("updatedBy", event.target.value)}
            />
          </div>
        </div>
        {error && <p className="form-error">{error}</p>}
      </section>
    </div>
  );
}
