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
import { useParams } from "next/navigation";
import { Spinner } from "@/app/(admin)/_components/Spinner";
import slugify from "slugify";

// Mock product shape
const SAMPLE_PRODUCT = {
  id: "p_001",
  title: "Classic Cotton Tee",
  handle: "classic-cotton-tee",
  description:
    "Soft, breathable cotton t-shirt. Available in multiple colors and sizes.",
  price: 24.99,
  compareAtPrice: 34.99,
  sku: "TEE-CL-001",
  inventory: 120,
  status: "active",
  images: [],
  variations: [
    {
      id: "v1",
      title: "Small / White",
      sku: "TEE-CL-S-W",
      price: 24.99,
      inventory: 30,
    },
    {
      id: "v2",
      title: "Medium / White",
      sku: "TEE-CL-M-W",
      price: 24.99,
      inventory: 40,
    },
  ]
};

export default function ProductEditor({ initial = SAMPLE_PRODUCT }) {
  const [product, setProduct] = useState(initial);
  const [images, setImages] = useState(initial.images || []);
  const [variantDraft, setVariantDraft] = useState({
    variation_name: "",
    variation_sku: "",
    variation_price: 0,
    variation_mrp: 0,
  });
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const { slug } = params; // Access the dynamic parameter 'slug'

  function updateField(path, value) {
    setProduct((p) => ({ ...p, [path]: value }));
  }

  // --- Put these helper functions inside your component (replace the old ones) ---

  // safe string-id comparison
  const idEq = (a, b) => String(a) === String(b);

  function updateVariation(id, field, value) {
    setProduct((p) => ({
      ...p,
      variations: (p.variations || []).map((v) =>
        idEq(v.id, id) ? { ...v, [field]: value } : v
      ),
    }));
  }

  function handleAddVariant() {
    // check the actual draft key
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
      // keep as strings to match your API style — or cast to number if you prefer
      variation_price: String(
        Number(variantDraft.variation_price || 0).toFixed(2)
      ),
      variation_mrp: String(Number(variantDraft.variation_mrp || 0).toFixed(2)),
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
    // remove from product.variations (not variants)
    setProduct((p) => ({
      ...p,
      variations: (p.variations || []).filter((v) => !idEq(v.id, id)),
    }));
  }

  function handleImageUpload(e) {
    const files = Array.from(e.target.files || []);
    const readPromises = files.map((f) => {
      return new Promise((res) => {
        const reader = new FileReader();
        reader.onload = (ev) => res({ name: f.name, url: ev.target.result });
        reader.readAsDataURL(f);
      });
    });
    Promise.all(readPromises).then((imgs) => {
      setImages((cur) => [...cur, ...imgs]);
    });
  }

  function handleRemoveImage(name) {
    setImages((cur) => cur.filter((i) => i.name !== name));
  }

  useEffect(() => {
    fetchProductData();
  }, []);

  async function fetchProductData() {
    setLoading(true);
    const res = await fetch(`/api/products/${slug}`, { cache: "no-store" });
    const data = await res.json();
    setProduct(data);
    setLoading(false);
  }

// helper: convert dataURL => Blob
function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

async function handleSave() {
  setSaving(true);
  try {
    const url = `/api/admin/products/save/${product.id}`;
    const method = "PUT";

    const fd = new FormData();

    // send the product JSON as a field (without images)
    const productCopy = { ...product };
    // remove client-only things if needed:
    delete productCopy.images; // we'll send files separately
    fd.append("payload", JSON.stringify(productCopy));

    // append each image as file
    images.forEach((img, idx) => {
      // img.url should be dataURL from FileReader
      if (img.url && img.url.startsWith("data:")) {
        const blob = dataURLtoBlob(img.url);
        // give a filename if not present
        const name = img.name || `image-${idx}.png`;
        fd.append("images", blob, name);
      } else {
        // if already a remote URL or path, send reference
        fd.append("image_urls", img.url);
      }
    });

    const res = await fetch(url, {
      method,
      body: fd, // browser sets multipart headers
      // DO NOT set Content-Type here
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API ${res.status}: ${text}`);
    }

    const data = await res.json();
    setProduct(data);
    alert("Saved (with files) successfully");
  } catch (err) {
    console.error(err);
    alert("Save failed: " + (err.message || err));
  } finally {
    setSaving(false);
  }
}

  return (
    <>
      {!loading ? (
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Product editor</h1>
            <div className="flex gap-2 items-center">
              <Select onValueChange={(v) => updateField("status", v)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={product.status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
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
                      <Label>Title</Label>
                      <Input
                        value={product.name}
                        onChange={(e) => {
                          updateField("name", e.target.value);
                          setTimeout(
                            () =>
                              updateField(
                                "slug",
                                slugify(e.target.value, {
                                  lower: true,
                                  strict: true,
                                })
                              ),
                            500
                          );
                        }}
                      />
                    </div>

                    <div>
                      <Label>Handle (slug)</Label>
                      <Input
                        value={product.slug}
                        onChange={(e) =>
                          updateField(
                            "slug",
                            slugify(e.target.value, {
                              lower: true,
                              strict: true,
                            })
                          )
                        }
                      />
                    </div>

                    <div>
                      <Label>Short Description</Label>
                      <Textarea
                        value={product.short_description}
                        onChange={(e) =>
                          updateField("short_description", e.target.value)
                        }
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={product.description}
                        onChange={(e) =>
                          updateField("description", e.target.value)
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
                  <CardDescription>Set pricing and stock</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Price</Label>
                      <Input
                        type="number"
                        value={product.price}
                        onChange={(e) =>
                          updateField("price", parseFloat(e.target.value || 0))
                        }
                      />
                    </div>
                    <div>
                      <Label>Compare at price</Label>
                      <Input
                        type="number"
                        value={product.mrp}
                        onChange={(e) =>
                          updateField("mrp", parseFloat(e.target.value || 0))
                        }
                      />
                    </div>
                    <div>
                      <Label>SKU</Label>
                      <Input
                        value={product.sku}
                        onChange={(e) => updateField("sku", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Inventory</Label>
                      <Input
                        type="number"
                        value={product.stock}
                        onChange={(e) =>
                          updateField("stock", parseInt(e.target.value || 0))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* --- Replace your Variants Card with this --- */}
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
                            value={v.variation_name ?? ""}
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
                              value={v.variation_sku ?? ""}
                              onChange={(e) =>
                                updateVariation(
                                  v.id,
                                  "variation_sku",
                                  e.target.value
                                )
                              }
                              placeholder="SKU"
                            />

                            {/* keep the input value as string while typing, but ensure we store a numeric-ish string */}
                            <Input
                              type="number"
                              value={v.variation_price ?? ""}
                              onChange={(e) =>
                                updateVariation(
                                  v.id,
                                  "variation_price",
                                  // keep user input minimally transformed to avoid jumpiness
                                  e.target.value
                                )
                              }
                              onBlur={(e) =>
                                // normalize to 2 decimals on blur
                                updateVariation(
                                  v.id,
                                  "variation_price",
                                  String(Number(e.target.value || 0).toFixed(2))
                                )
                              }
                              placeholder="Price"
                            />

                            <Input
                              type="number"
                              value={v.variation_mrp ?? ""}
                              onChange={(e) =>
                                updateVariation(
                                  v.id,
                                  "variation_mrp",
                                  e.target.value
                                )
                              }
                              onBlur={(e) =>
                                updateVariation(
                                  v.id,
                                  "variation_mrp",
                                  String(Number(e.target.value || 0).toFixed(2))
                                )
                              }
                              placeholder="MRP"
                            />
                          </div>
                        </div>

                        <div className="shrink-0">
                          <Button
                            variant="destructive"
                            onClick={() => handleRemoveVariant(v.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}

                    {/* Add new variant */}
                    <div className="border rounded p-3">
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          placeholder="Variant title (e.g. 60)"
                          value={variantDraft.variation_name}
                          onChange={(e) =>
                            setVariantDraft((d) => ({
                              ...d,
                              variation_name: e.target.value,
                            }))
                          }
                        />
                        <Input
                          placeholder="SKU"
                          value={variantDraft.variation_sku}
                          onChange={(e) =>
                            setVariantDraft((d) => ({
                              ...d,
                              variation_sku: e.target.value,
                            }))
                          }
                        />
                        <Input
                          placeholder="Price"
                          value={variantDraft.variation_price}
                          onChange={(e) =>
                            setVariantDraft((d) => ({
                              ...d,
                              variation_price: e.target.value,
                            }))
                          }
                        />
                        <Input
                          placeholder="MRP"
                          value={variantDraft.variation_mrp}
                          onChange={(e) =>
                            setVariantDraft((d) => ({
                              ...d,
                              variation_mrp: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="mt-3">
                        <Button onClick={handleAddVariant}>Add Variant</Button>
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
                  <CardDescription>Upload product images</CardDescription>
                </CardHeader>
                <CardContent>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {images.map((img) => (
                      <div
                        key={img.name}
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
                            variant="ghost"
                            onClick={() => handleRemoveImage(img.name)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Live preview</CardTitle>
                  <CardDescription>
                    Toggle on/off and see quick product preview
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <Label>Show preview</Label>
                    <Switch
                      checked={previewOpen}
                      onCheckedChange={(v) => setPreviewOpen(!!v)}
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

                        <div>
                          <h3 className="font-semibold">{product.title}</h3>
                          <div className="text-sm text-slate-500">
                            {product.description}
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
            <Button
              variant="destructive"
              onClick={() =>
                confirm("Delete product? This cannot be undone") &&
                alert("Deleted (demo)")
              }
            >
              Delete
            </Button>
            <Button onClick={handleSave}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
}
