'use client';

import Image from "next/image";
import { useMemo, useState } from "react";

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

type InventoryFormState = {
  name: string;
  quantity: string;
  unit: string;
  threshold: string;
  unitPrice: string;
  purchaseUrl: string;
  location: string;
  updatedBy: string;
};

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

const quantityFormatter = new Intl.NumberFormat("ja-JP", {
  maximumFractionDigits: 2,
});

const priceFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

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

type Props = {
  initialItems: InventoryItem[];
};

export default function InventoryBoard({ initialItems }: Props) {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [addForm, setAddForm] = useState<InventoryFormState>(emptyForm);
  const [addError, setAddError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<InventoryFormState | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const lowStockCount = useMemo(
    () => items.filter((item) => item.quantity < item.threshold).length,
    [items]
  );

  const handleAddChange = (field: keyof InventoryFormState, value: string) => {
    setAddForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditChange = (field: keyof InventoryFormState, value: string) => {
    setEditForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleAdd = () => {
    try {
      const payload = buildItemPayload(addForm);
      const id = createNextId(items);
      setItems((prev) => [
        ...prev,
        {
          id,
          image: defaultImage,
          ...payload,
        },
      ]);
      setAddForm(emptyForm);
      setAddError(null);
    } catch (error) {
      setAddError(error instanceof Error ? error.message : "入力内容を確認してください");
    }
  };

  const handleEditStart = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditForm({
      name: item.name,
      quantity: `${item.quantity}`,
      unit: item.unit,
      threshold: `${item.threshold}`,
      unitPrice: `${item.unitPrice}`,
      purchaseUrl: item.purchaseUrl,
      location: item.location,
      updatedBy: item.updatedBy,
    });
    setEditError(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm(null);
    setEditError(null);
  };

  const handleEditSave = () => {
    if (!editingId || !editForm) return;
    try {
      const payload = buildItemPayload(editForm);
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...payload,
                image: defaultImage,
              }
            : item
        )
      );
      handleEditCancel();
    } catch (error) {
      setEditError(error instanceof Error ? error.message : "入力内容を確認してください");
    }
  };

  return (
    <div className="inventory-page">
      <section className="inventory-hero">
        <div className="hero-copy">
          <p className="hero-eyebrow">誰でも見られる在庫ボード</p>
          <h1>物品管理ダッシュボード</h1>
          <p className="hero-lead">
            何が・何個（何m）・どこにあるかを即座に確認。閾値を下回った物品は自動でハイライトされ、
            単価と購入URLもその場で確認できます。
          </p>
          <div className="hero-stats">
            <div>
              <span className="stat-label">登録アイテム数</span>
              <span className="stat-value">{items.length}</span>
            </div>
            <div>
              <span className="stat-label">要補充</span>
              <span className="stat-value accent">{lowStockCount}</span>
            </div>
            <div>
              <span className="stat-label">最終更新</span>
              <span className="stat-value">2026/02/17</span>
            </div>
          </div>
        </div>
        <div className="hero-card">
          <h2>閲覧ルール</h2>
          <ul>
            <li>在庫チェックは誰でもOK</li>
            <li>補充が必要なら担当に連絡</li>
            <li>購入URLは参考。最終判断は管理者</li>
          </ul>
        </div>
      </section>

      <section className="inventory-forms">
        <div className="inventory-form">
          <div className="inventory-form-header">
            <div>
              <p className="section-eyebrow">Add Item</p>
              <h2>物品を追加</h2>
            </div>
            <button className="btn" type="button" onClick={handleAdd}>
              追加する
            </button>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>物品名</label>
              <input
                type="text"
                value={addForm.name}
                onChange={(event) => handleAddChange("name", event.target.value)}
              />
            </div>
            <div className="form-group">
              <label>在庫</label>
              <input
                type="number"
                step="0.01"
                value={addForm.quantity}
                onChange={(event) => handleAddChange("quantity", event.target.value)}
              />
            </div>
            <div className="form-group">
              <label>単位</label>
              <input
                type="text"
                value={addForm.unit}
                onChange={(event) => handleAddChange("unit", event.target.value)}
              />
            </div>
            <div className="form-group">
              <label>閾値（要補充の基準）</label>
              <input
                type="number"
                step="0.01"
                value={addForm.threshold}
                onChange={(event) => handleAddChange("threshold", event.target.value)}
              />
            </div>
            <div className="form-group">
              <label>単価（円）</label>
              <input
                type="number"
                step="1"
                value={addForm.unitPrice}
                onChange={(event) => handleAddChange("unitPrice", event.target.value)}
              />
            </div>
            <div className="form-group">
              <label>購入URL</label>
              <input
                type="url"
                value={addForm.purchaseUrl}
                onChange={(event) => handleAddChange("purchaseUrl", event.target.value)}
              />
            </div>
            <div className="form-group">
              <label>保管場所</label>
              <input
                type="text"
                value={addForm.location}
                onChange={(event) => handleAddChange("location", event.target.value)}
              />
            </div>
            <div className="form-group">
              <label>最終更新者</label>
              <input
                type="text"
                value={addForm.updatedBy}
                onChange={(event) => handleAddChange("updatedBy", event.target.value)}
              />
            </div>
          </div>
          {addError && <p className="form-error">{addError}</p>}
        </div>

        {editingId && editForm && (
          <div className="inventory-form">
            <div className="inventory-form-header">
              <div>
                <p className="section-eyebrow">Edit Item</p>
                <h2>物品を編集</h2>
              </div>
              <div className="btn-row">
                <button className="btn secondary" type="button" onClick={handleEditCancel}>
                  キャンセル
                </button>
                <button className="btn" type="button" onClick={handleEditSave}>
                  更新する
                </button>
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>物品名</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(event) => handleEditChange("name", event.target.value)}
                />
              </div>
              <div className="form-group">
                <label>在庫</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.quantity}
                  onChange={(event) => handleEditChange("quantity", event.target.value)}
                />
              </div>
              <div className="form-group">
                <label>単位</label>
                <input
                  type="text"
                  value={editForm.unit}
                  onChange={(event) => handleEditChange("unit", event.target.value)}
                />
              </div>
              <div className="form-group">
                <label>閾値（要補充の基準）</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.threshold}
                  onChange={(event) => handleEditChange("threshold", event.target.value)}
                />
              </div>
              <div className="form-group">
                <label>単価（円）</label>
                <input
                  type="number"
                  step="1"
                  value={editForm.unitPrice}
                  onChange={(event) => handleEditChange("unitPrice", event.target.value)}
                />
              </div>
              <div className="form-group">
                <label>購入URL</label>
                <input
                  type="url"
                  value={editForm.purchaseUrl}
                  onChange={(event) => handleEditChange("purchaseUrl", event.target.value)}
                />
              </div>
              <div className="form-group">
                <label>保管場所</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(event) => handleEditChange("location", event.target.value)}
                />
              </div>
              <div className="form-group">
                <label>最終更新者</label>
                <input
                  type="text"
                  value={editForm.updatedBy}
                  onChange={(event) => handleEditChange("updatedBy", event.target.value)}
                />
              </div>
            </div>
            {editError && <p className="form-error">{editError}</p>}
          </div>
        )}
      </section>

      <section id="inventory" className="inventory-section">
        <div className="section-header">
          <div>
            <p className="section-eyebrow">Inventory</p>
            <h2>在庫一覧</h2>
          </div>
          <p className="section-note">閾値を下回ると淡い赤で表示されます。</p>
        </div>

        <div className="inventory-grid">
          {items.map((item) => {
            const isLow = item.quantity < item.threshold;
            return (
              <article key={item.id} className={`item-card${isLow ? " low" : ""}`}>
                <div className="item-header">
                  <div>
                    <p className="item-location">保管: {item.location}</p>
                    <h3>{item.name}</h3>
                  </div>
                  {isLow && <span className="low-badge">要補充</span>}
                </div>
                <div className="item-body">
                  <div className="item-photo">
                    <Image
                      src={item.image}
                      alt={`${item.name}の写真`}
                      width={320}
                      height={200}
                    />
                  </div>
                  <div className="item-stats">
                    <div>
                      <span className="stat-label">在庫</span>
                      <span className="stat-value">
                        {quantityFormatter.format(item.quantity)}
                        {item.unit}
                      </span>
                    </div>
                    <div>
                      <span className="stat-label">単価</span>
                      <span className="stat-value">{priceFormatter.format(item.unitPrice)}</span>
                    </div>
                    <div>
                      <span className="stat-label">最終更新者</span>
                      <span className="stat-value">{item.updatedBy}</span>
                    </div>
                  </div>
                </div>
                <div className="item-actions">
                  <a
                    className="btn"
                    href={item.purchaseUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    購入URL
                  </a>
                  <button
                    className="btn secondary"
                    type="button"
                    onClick={() => handleEditStart(item)}
                  >
                    編集
                  </button>
                  <span className="item-hint">必要個数は管理者に相談</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="policy" className="policy-section">
        <div className="policy-card">
          <h2>補充ルール</h2>
          <p>
            閾値を下回ったら赤く表示されます。基本は「次の2週間の使用量」を見積もって補充します。
            迷ったら担当の在庫管理者に相談してください。
          </p>
          <div className="policy-grid">
            <div>
              <h3>日常消耗品</h3>
              <p>毎週金曜に補充。数量が半分を切ったら購入申請。</p>
            </div>
            <div>
              <h3>大型部材</h3>
              <p>試作計画が決まった段階でまとめて手配。</p>
            </div>
            <div>
              <h3>特殊パーツ</h3>
              <p>納期を優先し、見積もり取得後に購入。</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="contact-card">
          <div>
            <h2>連絡先</h2>
            <p>補充や購入の相談は「#parts-inventory」チャンネルへ。</p>
          </div>
          <div className="contact-meta">
            <span className="stat-label">担当</span>
            <span className="stat-value">備品管理チーム</span>
          </div>
          <div className="contact-meta">
            <span className="stat-label">更新日</span>
            <span className="stat-value">2026/02/17</span>
          </div>
        </div>
      </section>
    </div>
  );
}
