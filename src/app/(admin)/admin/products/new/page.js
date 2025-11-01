"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Spinner as PageSpinner } from "@/app/(admin)/_components/Spinner";
import slugify from "slugify";
import { Spinner } from "@/components/ui/spinner";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge"

// Mock product shape (fallback)
const SAMPLE_PRODUCT = {
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
};

// helper: ensure images come through as an array of url strings
function normalizeImagesFromServer(raw) {
  // raw could be: array, string (json), null, or something else
  let arr = raw;

  if (typeof arr === "string") {
    try {
      arr = JSON.parse(arr);
    } catch (e) {
      console.warn("Failed to parse images JSON from server:", e);
      arr = [];
    }
  }

  if (!Array.isArray(arr)) arr = [];

  // Normalize each item to a URL string (or drop invalid)
  const normalized = arr
    .map((it) => {
      if (typeof it === "string") return it;
      return it?.url ?? it?.filePath ?? it?.fileUrl ?? "";
    })
    .filter(Boolean);

  return normalized; // array of url strings
}

export default function ProductEditor({ initial = SAMPLE_PRODUCT }) {
  const [product, setProduct] = useState(initial);
  const [images, setImages] = useState(initial.images || []);

  const [categories, setCategories] = useState([]); // fetched
  const [productCategories, setProductCategories] = useState([]); // selected IDs
  const [searchText, setSearchText] = useState("");

  const filteredCategories = Array.isArray(categories)
    ? categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchText.toLowerCase())
    )
    : [];

  const [variantDraft, setVariantDraft] = useState({
    variation_name: "",
    variation_sku: "",
    variation_price: 0,
    variation_mrp: 0,
  });
  const [name, setName] = useState(product.name || "");
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slugLoading, setSlugLoading] = useState(false);
  const [realSlug, setRealSlug] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  // Drawer + pagination state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [remoteImages, setRemoteImages] = useState([]); // normalized { name, url }
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [remoteError, setRemoteError] = useState(null);
  const [selectedRemote, setSelectedRemote] = useState(new Set());

  const [page, setPage] = useState(0); // zero-based page index
  const [limit, setLimit] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  // sync product.images to UI images
  useEffect(() => {
    const urls = normalizeImagesFromServer(product.images);
    setImages(urls.map((u, i) => ({ name: `remote-${i}`, url: u })));
  }, [product.images]);

  const idEq = (a, b) => String(a) === String(b);

  function updateField(path, value) {
    setProduct((p) => ({ ...p, [path]: value }));
  }

  function updateVariation(id, field, value) {
    setProduct((p) => ({
      ...p,
      variations: (p.variations || []).map((v) =>
        idEq(v.id, id) ? { ...v, [field]: value } : v
      ),
    }));
  }

  function handleAddVariant() {
    if (
      !variantDraft.variation_name ||
      variantDraft.variation_name.trim() === ""
    )
      return;

    const newVar = {
      id: `v_${Date.now()}`,
      product_id: product.id || null,
      variation_name: variantDraft.variation_name,
      variation_sku: variantDraft.variation_sku || "",
      variation_price: String(
        Number(variantDraft.variation_price || 0).toFixed(2)
      ),
      variation_mrp: String(
        Number(variantDraft.variation_mrp || 0).toFixed(2)
      ),
    };

    setProduct((p) => ({
      ...p,
      variations: [...(p.variations || []), newVar],
    }));
    setVariantDraft({
      variation_name: "",
      variation_sku: "",
      variation_price: "",
      variation_mrp: "",
    });
  }

  function handleRemoveVariant(id) {
    setProduct((p) => ({
      ...p,
      variations: (p.variations || []).filter((v) => !idEq(v.id, id)),
    }));
  }

  function handleRemoveImage(url) {
    setImages((cur) => cur.filter((i) => i.url !== url));
    setProduct((p) => ({
      ...p,
      images: (p.images || []).filter((u) => u !== url),
    }));
  }

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchCategories() {
    const res = await fetch(`/api/categories`, {
      cache: "no-store",
    });

    const data = await res.json();
    setCategories(data.categories);
  }

  async function validateSlug(newSlug) {
    if (!newSlug || newSlug === realSlug) return;
    setSlugLoading(true);
    const res = await fetch(`/api/admin/products/verify/${newSlug}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const data = await res.json();
    if (!data.availability) {
      updateField("slug", data.available);
    }
    setSlugLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const url = `/api/admin/products/save`; // keep as you have it
      product.categories = productCategories;
      const productCopy = { ...product };
      // images state uses {name,url}, product.images should be array of url strings
      productCopy.images = images.map((img) => img.url);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: productCopy }),
      });

      const result = await res.json();
      if (!res.ok) {
        // server can return { error: "..." } — surface it
        throw new Error(result?.error || `API ${res.status}`);
      }

      window.history.pushState({}, "", `/admin/products/edit/${product.slug}`);
    } catch (err) {
      console.error(err);
      alert("Save failed: " + (err.message || err));
    } finally {
      setSaving(false);
    }
  }

  /* -------------------------
     Pagination-aware Remote fetch
     ------------------------- */

  // central fetcher for remote images (page is zero-based)
  async function fetchRemoteImages({ pageIndex = 0, limitCount = 20 } = {}) {
    setRemoteLoading(true);
    setRemoteError(null);
    try {
      const res = await fetch(
        `/api/admin/images/list?page=${pageIndex}&limit=${limitCount}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      // expected shape: { total_count, items: [...] }
      const total = Number(data.total_count ?? data.total ?? 0);
      setTotalCount(Number.isFinite(total) ? total : 0);

      const items = data.items || data.files || data || [];
      // Normalize items into { name, url }
      const normalized = (items || [])
        .map((it, i) => {
          if (typeof it === "string")
            return { name: `img-${i}`, url: it };
          const name =
            it.name ||
            it.fileName ||
            it.filePath ||
            it.title ||
            `img-${i}`;
          // prefer direct url fields if present
          const url =
            it.url ||
            it.filePath ||
            it.fileUrl ||
            it.thumbnailUrl ||
            it.thumbnail ||
            "";
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

  // open drawer resets pagination and triggers fetch
  function openDrawer() {
    setPage(0);
    setLimit(20);
    setSelectedRemote(new Set());
    setDrawerOpen(true);
    // fetchRemoteImages will run in useEffect below when drawerOpen/page/limit change
  }

  useEffect(() => {
    // debounce effect: run only if name changes and user stopped for 500ms
    const handler = setTimeout(() => {
      if (!name.trim()) return;
      const newSlug = slugify(name, { lower: true, strict: true });
      updateField("slug", newSlug);
      validateSlug(newSlug);
    }, 500);

    // cleanup: cancel previous timer if user keeps typing
    return () => clearTimeout(handler);
  }, [name]);

  // when drawer opens OR page/limit changes while open -> fetch
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
    const newImages = selectedArray.map((url, idx) => ({
      name: `remote-${Date.now()}-${idx}`,
      url,
    }));
    const existing = new Set(images.map((i) => i.url));
    const merged = [
      ...images,
      ...newImages.filter((n) => !existing.has(n.url)),
    ];
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

  const totalPages = Math.max(1, Math.ceil((totalCount || 0) / limit));

  return (
    <>
      {!loading ? (
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Product editor</h1>
            <div className="flex gap-2 items-center">
              <Select
                onValueChange={(v) => updateField("status", v)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={product.status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    Active
                  </SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">
                    Archived
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    Saving...
                    <Spinner />
                  </>
                ) : !success && !error ? (
                  "Save"
                ) : success && !error ? (
                  <>
                    Saved
                    <Check className="text-green-700" />
                  </>
                ) : !success && error ? (
                  <>
                    Saved
                    <X className="text-red-700" />
                  </>
                ) : ''}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Left: form */}
            <div className="col-span-8">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                  <CardDescription>
                    Title, handle and description
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-2">
                        Title
                      </Label>
                      <Input
                        value={product.name}
                        onChange={(e) => {
                          const newName =
                            e.target.value;
                          setName(newName);
                          updateField(
                            "name",
                            newName
                          );
                        }}
                      />
                    </div>

                    <div>
                      <Label className="mb-2">
                        Handle (slug)
                      </Label>
                      <InputGroup>
                        <InputGroupInput
                          disabled
                          value={product.slug}
                          onChange={(e) => {
                            updateField(
                              "slug",
                              slugify(
                                e.target.value,
                                {
                                  lower: true,
                                  strict: true,
                                }
                              )
                            );
                          }}
                        />
                        <InputGroupAddon align="inline-end">
                          {slugLoading && <Spinner />}
                        </InputGroupAddon>
                      </InputGroup>
                    </div>

                    <div>
                      <Label className="mb-2">
                        Short Description
                      </Label>
                      <Textarea
                        value={
                          product.short_description
                        }
                        onChange={(e) =>
                          updateField(
                            "short_description",
                            e.target.value
                          )
                        }
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label className="mb-2 ">
                        Description
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          For writing better
                          descriptions, use any online
                          text editor and paste the
                          content here.
                        </p>
                      </Label>
                      <Textarea
                        value={product.description}
                        onChange={(e) =>
                          updateField(
                            "description",
                            e.target.value
                          )
                        }
                        rows={4}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Pricing & Inventory</CardTitle>
                  <CardDescription>
                    Set pricing and stock
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-2">
                        Price
                      </Label>
                      <Input
                        type="number"
                        value={product.price}
                        onChange={(e) =>
                          updateField(
                            "price",
                            parseFloat(
                              e.target.value || 0
                            )
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="mb-2">
                        Compare at price
                      </Label>
                      <Input
                        type="number"
                        value={product.mrp}
                        onChange={(e) =>
                          updateField(
                            "mrp",
                            parseFloat(
                              e.target.value || 0
                            )
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="mb-2">SKU</Label>
                      <Input
                        value={product.sku}
                        onChange={(e) =>
                          updateField(
                            "sku",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="mb-2">
                        Inventory
                      </Label>
                      <Input
                        type="number"
                        value={product.stock}
                        onChange={(e) =>
                          updateField(
                            "stock",
                            parseInt(
                              e.target.value || 0
                            )
                          )
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Variants */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Variants</CardTitle>
                  <CardDescription>
                    Create and manage product variants
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {(product.variations || []).map((v) => (
                      <div
                        key={v.id}
                        className="flex items-center gap-4 border rounded p-3"
                      >
                        <div className="flex-1">
                          <Input
                            value={
                              v.variation_name ??
                              ""
                            }
                            onChange={(e) =>
                              updateVariation(
                                v.id,
                                "variation_name",
                                e.target.value
                              )
                            }
                            placeholder="Variant name"
                          />
                          <div className="mt-2 grid grid-cols-3 gap-2">
                            <Input
                              value={
                                v.variation_sku ??
                                ""
                              }
                              onChange={(e) =>
                                updateVariation(
                                  v.id,
                                  "variation_sku",
                                  e.target
                                    .value
                                )
                              }
                              placeholder="SKU"
                            />
                            <Input
                              type="number"
                              value={
                                v.variation_price ??
                                ""
                              }
                              onChange={(e) =>
                                updateVariation(
                                  v.id,
                                  "variation_price",
                                  e.target
                                    .value
                                )
                              }
                              onBlur={(e) =>
                                updateVariation(
                                  v.id,
                                  "variation_price",
                                  String(
                                    Number(
                                      e
                                        .target
                                        .value ||
                                      0
                                    ).toFixed(
                                      2
                                    )
                                  )
                                )
                              }
                              placeholder="Price"
                            />
                            <Input
                              type="number"
                              value={
                                v.variation_mrp ??
                                ""
                              }
                              onChange={(e) =>
                                updateVariation(
                                  v.id,
                                  "variation_mrp",
                                  e.target
                                    .value
                                )
                              }
                              onBlur={(e) =>
                                updateVariation(
                                  v.id,
                                  "variation_mrp",
                                  String(
                                    Number(
                                      e
                                        .target
                                        .value ||
                                      0
                                    ).toFixed(
                                      2
                                    )
                                  )
                                )
                              }
                              placeholder="MRP"
                            />
                          </div>
                        </div>

                        <div className="shrink-0">
                          <Button
                            variant="destructive"
                            onClick={() =>
                              handleRemoveVariant(
                                v.id
                              )
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="border rounded p-3">
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          placeholder="Variant title (e.g. 60)"
                          value={
                            variantDraft.variation_name
                          }
                          onChange={(e) =>
                            setVariantDraft(
                              (d) => ({
                                ...d,
                                variation_name:
                                  e.target
                                    .value,
                              })
                            )
                          }
                        />
                        <Input
                          placeholder="SKU"
                          value={
                            variantDraft.variation_sku
                          }
                          onChange={(e) =>
                            setVariantDraft(
                              (d) => ({
                                ...d,
                                variation_sku:
                                  e.target
                                    .value,
                              })
                            )
                          }
                        />
                        <Input
                          placeholder="Price"
                          value={
                            variantDraft.variation_price
                          }
                          onChange={(e) =>
                            setVariantDraft(
                              (d) => ({
                                ...d,
                                variation_price:
                                  e.target
                                    .value,
                              })
                            )
                          }
                        />
                        <Input
                          placeholder="MRP"
                          value={
                            variantDraft.variation_mrp
                          }
                          onChange={(e) =>
                            setVariantDraft(
                              (d) => ({
                                ...d,
                                variation_mrp:
                                  e.target
                                    .value,
                              })
                            )
                          }
                        />
                      </div>
                      <div className="mt-3">
                        <Button
                          onClick={handleAddVariant}
                        >
                          Add Variant
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: images + preview */}
            <div className="col-span-4">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                  <CardDescription>
                    Select product images
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button onClick={openDrawer}>
                      Select Image
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setImages([]);
                        setProduct((p) => ({
                          ...p,
                          images: [],
                        }));
                      }}
                    >
                      Clear
                    </Button>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative border rounded overflow-hidden"
                      >
                        <img
                          src={img.url}
                          alt={img.name}
                          className="object-cover w-full h-28"
                        />
                        <div className="absolute top-2 right-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleRemoveImage(
                                img.url
                              )
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                    {images.length === 0 && (
                      <div className="text-sm text-slate-500 col-span-2">
                        No images selected
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Input
                      placeholder="Search categories..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                    {searchText && categories.length === 0 && (
                      <div className="absolute z-10 bg-slate-800 border rounded w-full mt-1 p-2 text-gray-500">
                        Loading categories...
                      </div>
                    )}

                    {searchText && categories.length > 0 && filteredCategories.length === 0 && (
                      <div className="absolute z-10 bg-slate-800 border rounded w-full mt-1 p-2 text-gray-500">
                        No matches found
                      </div>
                    )}
                    {searchText && categories.length > 0 && filteredCategories.length > 0 && (
                      <ul className="absolute z-10 bg-slate-800 border rounded w-full mt-1 shadow">
                        {filteredCategories.map((cat) => (
                          <li
                            key={cat.id}
                            className="p-2 hover:bg-slate-900 cursor-pointer"
                            onClick={() => {
                              if (!productCategories.includes(cat.id)) {
                                setProductCategories([...productCategories, cat.id]);
                              }
                              setSearchText("");
                            }}
                          >
                            {cat.name}
                          </li>
                        ))}
                      </ul>
                    )}


                    <div className="flex flex-wrap gap-2 mt-3">
                      {productCategories.map((catId) => {
                        const cat = categories.find((c) => c.id === catId);
                        return (
                          <Badge
                            key={catId}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() =>
                              setProductCategories(
                                productCategories.filter((id) => id !== catId)
                              )
                            }
                          >
                            {cat?.name} ✕
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Live preview</CardTitle>
                  <CardDescription>
                    Toggle on/off and see quick product
                    preview
                  </CardDescription>
                  <CardDescription className={`underline text-blue-400`}>
                    <Link href={`/products/${product.slug}`} target="_blank">
                      View in Store
                    </Link>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="mb-2">
                      Show preview
                    </Label>
                    <Switch
                      checked={previewOpen}
                      onCheckedChange={(v) =>
                        setPreviewOpen(!!v)
                      }
                    />
                  </div>

                  {previewOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded p-4"
                    >
                      <div className="flex gap-4">
                        <div className="w-28 h-28 bg-slate-100 rounded overflow-hidden flex items-center justify-center">
                          {images[0] ? (
                            <img
                              src={images[0].url}
                              alt="cover"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-sm text-slate-400">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {product.title}
                          </h3>
                          <div className="text-sm text-slate-500">
                            {product?.short_description?.slice(
                              0,
                              70
                            )}
                          </div>
                          <div className="mt-2 font-medium">
                            ${product.price}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex justify-end gap-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  Saving...
                  <Spinner />
                </>
              ) : !success && !error ? (
                "Save"
              ) : success && !error ? (
                <>
                  Saved
                  <Check className="text-green-700" />
                </>
              ) : !success && error ? (
                <>
                  Saved
                  <X className="text-red-700" />
                </>
              ) : ''}
            </Button>
          </div>

          {/* Drawer / Modal for ImageKit with pagination */}
          {drawerOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/40 z-40 rounded"
                onClick={cancelSelectRemote}
              />
              <div className="fixed right-0 top-0 bottom-0 w-full md:w-1/3 bg-slate-900 z-50 p-4 overflow-y-auto shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Select images from ImageKit
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={cancelSelectRemote}
                      variant="ghost"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={confirmSelectRemote}
                      disabled={selectedRemote.size === 0}
                    >
                      Add{" "}
                      {selectedRemote.size > 0
                        ? `(${selectedRemote.size})`
                        : ""}
                    </Button>
                  </div>
                </div>

                {/* Pagination controls */}
                <div className="flex items-center justify-between mb-4 gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        setPage((p) =>
                          Math.max(0, p - 1)
                        )
                      }
                      disabled={
                        page <= 0 || remoteLoading
                      }
                    >
                      Prev
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        setPage((p) =>
                          Math.min(
                            totalPages - 1,
                            p + 1
                          )
                        )
                      }
                      disabled={
                        page >= totalPages - 1 ||
                        remoteLoading
                      }
                    >
                      Next
                    </Button>
                    <div className="text-sm text-slate-600 ml-2">
                      Page {page + 1} / {totalPages}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-sm">Limit:</div>
                    <select
                      value={limit}
                      onChange={(e) => {
                        setLimit(
                          Number(e.target.value)
                        );
                        setPage(0);
                      }}
                      className="border rounded px-2 py-1 text-sm"
                      disabled={remoteLoading}
                    >
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>

                {remoteLoading && <PageSpinner />}
                {remoteError && (
                  <div className="text-red-600">
                    {remoteError}
                  </div>
                )}

                {!remoteLoading &&
                  !remoteError &&
                  remoteImages.length === 0 && (
                    <div className="text-sm text-slate-500">
                      No images found in ImageKit.
                    </div>
                  )}

                <div className="grid grid-cols-3 gap-2">
                  {remoteImages.map((ri) => {
                    const isSelected = selectedRemote.has(
                      ri.url
                    );
                    return (
                      <button
                        key={ri.url}
                        type="button"
                        onClick={() =>
                          toggleSelectRemote(ri.url)
                        }
                        className={`relative border rounded overflow-hidden focus:outline-none ${isSelected ? "ring-2 ring-offset-2 ring-indigo-500" : ""}`}
                      >
                        <img
                          src={ri.url}
                          alt={ri.name}
                          className="object-cover w-full h-28"
                        />
                        {isSelected && (
                          <div className="absolute top-1 left-1 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded">
                            Selected
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <PageSpinner />
      )}
    </>
  );
}
