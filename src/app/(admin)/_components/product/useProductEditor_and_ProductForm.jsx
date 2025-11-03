"use client";

import React, { useEffect, useState } from "react";
import slugify from "slugify";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

/*
  This single file exports:
   - useProductEditor(options)  -> hook containing all data + actions
   - ProductForm(props)         -> presentational component (UI) that receives state+actions
   - AddProductPage             -> compact wrapper for /add page
   - EditProductPage            -> compact wrapper for /edit/[slug] page

  Usage:
   - If you keep file under e.g. components/product/ you can import the hook & form.
   - For route files, simply `export { AddProductPage as default } from '@/components/product/useProductEditor_and_ProductForm'`

  The hook keeps productCategories as an array of primitive ids and normalizes server shapes.
*/

// ---------------------- Helpers ----------------------
function normalizeImagesFromServer(raw) {
  let arr = raw;
  if (typeof arr === "string") {
    try {
      arr = JSON.parse(arr);
    } catch (e) {
      arr = [];
    }
  }
  if (!Array.isArray(arr)) arr = [];
  return arr
    .map((it) => {
      if (typeof it === "string") return it;
      return it?.url ?? it?.filePath ?? it?.fileUrl ?? "";
    })
    .filter(Boolean);
}

const SAMPLE_PRODUCT = {
  id: null,
  name: "",
  slug: "",
  short_description: "",
  description: "",
  price: 0,
  mrp: 0,
  sku: "",
  stock: 0,
  status: "active",
  images: [],
  variations: [],
  categories: [],
};

const idEq = (a, b) => String(a) === String(b);

// ---------------------- Hook ----------------------
export function useProductEditor({ initial = SAMPLE_PRODUCT, slug: routeSlug = null } = {}) {
  const router = useRouter();

  const isEdit = !!routeSlug;
  const [product, setProduct] = useState({ ...initial });
  const [images, setImages] = useState((initial.images || []).map((u, i) => ({ name: `remote-${i}`, url: u })));
  const [categories, setCategories] = useState([]);
  const [productCategories, setProductCategories] = useState(initial.categories || []); // always ids
  const [searchText, setSearchText] = useState("");

  const [name, setName] = useState(product.name || "");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [slugLoading, setSlugLoading] = useState(false);
  const [realSlug, setRealSlug] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  // remote images drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [remoteImages, setRemoteImages] = useState([]);
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [remoteError, setRemoteError] = useState(null);
  const [selectedRemote, setSelectedRemote] = useState(new Set());
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  // keep UI images in sync with product.images
  useEffect(() => {
    const urls = normalizeImagesFromServer(product.images);
    setImages(urls.map((u, i) => ({ name: `remote-${i}`, url: u })));
  }, [product.images]);

  useEffect(() => {
    fetchCategories();
    if (isEdit) fetchProductData(routeSlug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeSlug]);

  async function fetchCategories() {
    try {
      const res = await fetch(`/api/categories`, { cache: "no-store" });
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("fetchCategories error:", err);
      setCategories([]);
    }
  }

  async function fetchProductData(slug) {
    if (!slug) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${slug}`, { cache: "no-store" });
      const data = await res.json();

      // normalize images
      const normalizedImages = normalizeImagesFromServer(data.images);
      data.images = normalizedImages;

      // normalize categories into ids
      let normalizedCatIds = [];
      if (Array.isArray(data.categories)) {
        if (data.categories.length > 0 && typeof data.categories[0] === "object") {
          normalizedCatIds = data.categories.map((c) => (c && c.id != null ? c.id : null)).filter(Boolean);
        } else {
          normalizedCatIds = data.categories.filter((c) => c != null);
        }
      } else if (typeof data.categories === "string") {
        try {
          const parsed = JSON.parse(data.categories);
          if (Array.isArray(parsed)) normalizedCatIds = parsed.filter((c) => c != null);
        } catch (e) {
          normalizedCatIds = [];
        }
      }

      setProductCategories(normalizedCatIds);
      setProduct({ ...SAMPLE_PRODUCT, ...data });
      setName(data.name || "");
    } catch (err) {
      console.error("fetchProductData error:", err);
    } finally {
      setLoading(false);
    }
  }

  function updateField(path, value) {
    setProduct((p) => ({ ...p, [path]: value }));
  }

  function updateVariation(id, field, value) {
    setProduct((p) => ({ ...p, variations: (p.variations || []).map((v) => (idEq(v.id, id) ? { ...v, [field]: value } : v)) }));
  }

  function handleAddVariant(variantDraft) {
    if (!variantDraft || !variantDraft.variation_name) return;
    const newVar = {
      id: `v_${Date.now()}`,
      product_id: product.id || null,
      variation_name: variantDraft.variation_name,
      variation_sku: variantDraft.variation_sku || "",
      variation_price: String(Number(variantDraft.variation_price || 0).toFixed(2)),
      variation_mrp: String(Number(variantDraft.variation_mrp || 0).toFixed(2)),
    };
    setProduct((p) => ({ ...p, variations: [...(p.variations || []), newVar] }));
  }

  function handleRemoveVariant(id) {
    setProduct((p) => ({ ...p, variations: (p.variations || []).filter((v) => !idEq(v.id, id)) }));
  }

  function handleRemoveImage(url) {
    setImages((cur) => cur.filter((i) => i.url !== url));
    setProduct((p) => ({ ...p, images: (p.images || []).filter((u) => u !== url) }));
  }

  async function fetchRemoteImages({ pageIndex = 0, limitCount = 20 } = {}) {
    setRemoteLoading(true);
    setRemoteError(null);
    try {
      const res = await fetch(`/api/admin/images/list?page=${pageIndex}&limit=${limitCount}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      const total = Number(data.total_count ?? data.total ?? 0);
      setTotalCount(Number.isFinite(total) ? total : 0);
      const items = data.items || data.files || data || [];
      const normalized = (items || [])
        .map((it, i) => {
          if (typeof it === "string") return { name: `img-${i}`, url: it };
          const name = it.name || it.fileName || it.filePath || it.title || `img-${i}`;
          const url = it.url || it.filePath || it.fileUrl || it.thumbnailUrl || it.thumbnail || "";
          return { name, url };
        })
        .filter((x) => !!x.url);
      setRemoteImages(normalized);
    } catch (err) {
      console.error("fetchRemoteImages error:", err);
      setRemoteError("Failed to load images");
    } finally {
      setRemoteLoading(false);
    }
  }

  function openDrawer() {
    setPage(0);
    setLimit(20);
    setSelectedRemote(new Set());
    setDrawerOpen(true);
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!name.trim()) return;
      const newSlug = slugify(name, { lower: true, strict: true });
      updateField("slug", newSlug);
      validateSlug(newSlug);
    }, 500);
    return () => clearTimeout(handler);
  }, [name]);

  useEffect(() => {
    if (!drawerOpen) return;
    fetchRemoteImages({ pageIndex: page, limitCount: limit });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen, page, limit]);

  function toggleSelectRemote(url) {
    setSelectedRemote((s) => {
      const copy = new Set(s);
      if (copy.has(url)) copy.delete(url);
      else copy.add(url);
      return copy;
    });
  }

  function confirmSelectRemote() {
    const selectedArray = Array.from(selectedRemote);
    const newImages = selectedArray.map((url, idx) => ({ name: `remote-${Date.now()}-${idx}`, url }));
    const existing = new Set(images.map((i) => i.url));
    const merged = [...images, ...newImages.filter((n) => !existing.has(n.url))];
    setImages(merged);
    setProduct((p) => ({ ...p, images: merged.map((i) => i.url) }));
    setDrawerOpen(false);
    setRemoteImages([]);
    setSelectedRemote(new Set());
  }

  function cancelSelectRemote() {
    setDrawerOpen(false);
    setRemoteImages([]);
    setSelectedRemote(new Set());
  }

  async function validateSlug(newSlug) {
    if (!newSlug || newSlug === realSlug) return;
    setSlugLoading(true);
    try {
      const res = await fetch(`/api/admin/products/verify/${newSlug}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      if (!data.availability) updateField("slug", data.available);
    } catch (err) {
      console.warn("validateSlug error:", err);
    } finally {
      setSlugLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const url = `/api/admin/products/save`;
      const method = isEdit ? "PUT" : "POST";
      const productCopy = { ...product };
      productCopy.categories = productCategories;
      productCopy.images = images.map((img) => img.url);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: productCopy }),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(true);
        setSuccess(false);
        throw new Error(result?.error || `API ${res.status}`);
      }

      if (result?.product) {
        const returned = result.product;
        setProduct({ ...productCopy, ...returned });
        if (Array.isArray(returned.categories)) {
          const normalized = Array.isArray(returned.categories) && typeof returned.categories[0] === "object"
            ? returned.categories.map((c) => c.id).filter(Boolean)
            : returned.categories.filter(Boolean);
          setProductCategories(normalized);
        }
      }

      setError(false);
      setSuccess(true);

      // navigate to edit after create
      const gotoSlug = result?.product?.slug ?? product.slug;
      if (!isEdit && gotoSlug) {
        window.history.pushState({}, "", `/admin/products/edit/${gotoSlug}`);
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert("Save failed: " + (err.message || err));
    } finally {
      setSaving(false);
    }
  }

  // category helpers
  function addCategoryId(catId) {
    setProductCategories((prev) => {
      if (prev.some((id) => idEq(id, catId))) return prev;
      return [...prev, catId];
    });
  }
  function removeCategoryId(catId) {
    setProductCategories((prev) => prev.filter((id) => !idEq(id, catId)));
  }

  const totalPages = Math.max(1, Math.ceil((totalCount || 0) / limit));

  return {
    // state
    product,
    setProduct,
    images,
    setImages,
    categories,
    productCategories,
    searchText,
    name,
    saving,
    loading,
    slugLoading,
    success,
    error,
    drawerOpen,
    remoteImages,
    remoteLoading,
    remoteError,
    selectedRemote,
    page,
    limit,
    totalPages,

    // computed
    filteredCategories: Array.isArray(categories)
      ? categories.filter((cat) => cat.name.toLowerCase().includes((searchText || "").toLowerCase()))
      : [],

    // actions
    setSearchText,
    setName,
    updateField,
    updateVariation,
    handleAddVariant,
    handleRemoveVariant,
    handleRemoveImage,
    openDrawer,
    toggleSelectRemote,
    confirmSelectRemote,
    cancelSelectRemote,
    validateSlug,
    handleSave,
    addCategoryId,
    removeCategoryId,
    setDrawerOpen,
    setPage,
    setLimit,
  };
}

// ---------------------- Presentational component ----------------------
export function ProductForm({ controller }) {
  // controller is the object returned by useProductEditor
  const c = controller;
  if (!c) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{c.product?.id ? "Edit product" : "Add product"}</h1>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => c.updateField("status", c.product.status === "active" ? "draft" : "active")}
            className="px-3 py-2 border rounded"
          >
            {c.product.status || "active"}
          </button>

          <button onClick={c.handleSave} disabled={c.saving} className="px-3 py-2 bg-slate-800 text-white rounded">
            {c.saving ? "Saving..." : !c.success && !c.error ? "Save" : c.success && !c.error ? "Saved" : "Error"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block">Title</label>
              <input value={c.product.name || ""} onChange={(e) => { c.setName(e.target.value); c.updateField("name", e.target.value); }} className="w-full border rounded px-2 py-2" />
            </div>

            <div>
              <label className="mb-2 block">Handle (slug)</label>
              <input disabled value={c.product.slug || ""} onChange={(e) => c.updateField("slug", slugify(e.target.value, { lower: true, strict: true }))} className="w-full border rounded px-2 py-2" />
            </div>

            <div>
              <label className="mb-2 block">Short Description</label>
              <textarea value={c.product.short_description || ""} onChange={(e) => c.updateField("short_description", e.target.value)} className="w-full border rounded px-2 py-2" rows={3} />
            </div>

            <div>
              <label className="mb-2 block">Description</label>
              <textarea value={c.product.description || ""} onChange={(e) => c.updateField("description", e.target.value)} className="w-full border rounded px-2 py-2" rows={4} />
            </div>

          </div>
        </div>

        <div className="col-span-4">
          <div className="mb-6">
            <label className="block mb-2">Images</label>
            <div className="flex gap-2 mb-3">
              <button onClick={() => c.openDrawer()} className="px-3 py-2 border rounded">Select Image</button>
              <button onClick={() => { c.setImages([]); c.setProduct((p) => ({ ...p, images: [] })); }} className="px-3 py-2 border rounded">Clear</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(c.images || []).map((img, idx) => (
                <div key={idx} className="relative border rounded overflow-hidden">
                  <img src={img.url} alt={img.name} className="object-cover w-full h-28" />
                  <div className="absolute top-2 right-2">
                    <button onClick={() => c.handleRemoveImage(img.url)} className="px-2 py-1 bg-red-600 text-white rounded text-xs">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2">Categories</label>
            <input placeholder="Search categories..." value={c.searchText} onChange={(e) => c.setSearchText(e.target.value)} className="w-full border rounded px-2 py-2 mb-2" />
            {c.searchText && c.categories.length === 0 && <div className="text-sm">Loading categories...</div>}
            {c.searchText && c.categories.length > 0 && c.filteredCategories.length === 0 && <div className="text-sm">No matches</div>}
            {c.searchText && c.filteredCategories.length > 0 && (
              <ul className="border rounded p-1 max-h-40 overflow-auto bg-white">
                {c.filteredCategories.map((cat) => (
                  <li key={cat.id} className="p-1 cursor-pointer hover:bg-slate-100" onClick={() => { c.addCategoryId(cat.id); c.setSearchText(""); }}>{cat.name}</li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              {(c.productCategories || []).map((catId) => {
                const category = (c.categories || []).find((x) => idEq(x.id, catId));
                return (
                  <button key={String(catId)} onClick={() => c.removeCategoryId(catId)} className="px-2 py-1 border rounded text-sm">{category?.name ?? catId} ✕</button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block mb-2">Preview</label>
            <div className="border rounded p-3">
              <div className="flex gap-3">
                <div className="w-20 h-20 bg-slate-100 rounded overflow-hidden flex items-center justify-center">
                  {c.images[0] ? <img src={c.images[0].url} alt="cover" className="w-full h-full object-cover" /> : <div className="text-sm">No image</div>}
                </div>
                <div>
                  <div className="font-semibold">{c.product.name}</div>
                  <div className="text-sm text-slate-500">{c.product.short_description}</div>
                  <div className="mt-2 font-medium">${c.product.price}</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Drawer simple rendering for remote images */}
      {c.drawerOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => c.cancelSelectRemote()} />
          <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/3 bg-white p-4 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Select images</h3>
              <div>
                <button onClick={() => c.cancelSelectRemote()} className="px-3 py-1 mr-2">Cancel</button>
                <button onClick={() => c.confirmSelectRemote()} className="px-3 py-1 bg-blue-600 text-white rounded">Add</button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {c.remoteImages.map((ri) => {
                const isSelected = c.selectedRemote.has(ri.url);
                return (
                  <button key={ri.url} type="button" onClick={() => c.toggleSelectRemote(ri.url)} className={`relative border rounded overflow-hidden ${isSelected ? "ring-2 ring-indigo-500" : ""}`}>
                    <img src={ri.url} alt={ri.name} className="object-cover w-full h-28" />
                    {isSelected && <div className="absolute top-1 left-1 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded">Selected</div>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------- Compact wrappers ----------------------
// Use these in your route files. They simply connect the hook to the form.

export function AddProductPage() {
  const controller = useProductEditor({ initial: SAMPLE_PRODUCT, slug: null });
  return <ProductForm controller={controller} />;
}

export function EditProductPageWrapper() {
  const params = useParams();
  const { slug } = params ?? {};
  const controller = useProductEditor({ initial: SAMPLE_PRODUCT, slug });
  return <ProductForm controller={controller} />;
}
