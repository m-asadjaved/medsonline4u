"use client"

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
const SAMPLE_PRODUCTS = Array.from({ length: 18 }).map((_, i) => ({
  id: i + 1,
  name: [
    "Paracetamol 500mg",
    "Vitamin C 1000mg",
    "Cough Syrup 120ml",
    "Aspirin 75mg",
    "Antacid Tablets",
    "Omega-3 Softgels",
    "Antibiotic Capsule",
    "Allergy Relief",
  ][i % 8] + ` ${i + 1}`,
  category: ["Pain Relief", "Vitamins", "Cold & Flu", "Digestive"][i % 4],
  price: Math.round(50 + Math.random() * 950),
  rating: +(3 + Math.random() * 2).toFixed(1),
  img: `https://images.unsplash.com/photo-1580281657521-3d9bd8d45f2b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=${i}`,
}));

export default function ShopPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sort, setSort] = useState("popular");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [products, setProducts] = useState([]);

  const categories = useMemo(() => ["All", ...Array.from(new Set(SAMPLE_PRODUCTS.map(p => p.category)))], []);

  // const filtered = useMemo(() => {
  //   return SAMPLE_PRODUCTS.filter(p => {
  //     if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
  //     if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
  //     if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
  //     return true;
  //   }).sort((a, b) => {
  //     if (sort === "price_asc") return a.price - b.price;
  //     if (sort === "price_desc") return b.price - a.price;
  //     if (sort === "rating") return b.rating - a.rating;
  //     return b.id - a.id; // recent/popular fallback
  //   });
  // }, [query, selectedCategory, priceRange, sort]);

  useEffect(() => {
    fetchProducts();
  }, []);
  
  async function fetchProducts() {
    try {
      const res = await fetch(`/api/products/search`);
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();               // <- await here
      // API might return { products: [...] } or an array directly
      const list = Array.isArray(data) ? data : data.products ?? [];
      setProducts(list);
      console.log('fetched products:', list);     // log the actual array
    } catch (err) {
      console.error('Failed to fetch products', err);
      setProducts([]); // fallback to empty array
    }
  }
  


  return (
      <div className="max-w-7xl mx-auto mt-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Shop Medicines</h1>
            <p className="text-sm text-slate-600 mt-1">Browse verified medicines — secure checkout, fast delivery.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center bg-white rounded-lg px-3 py-2 shadow-sm">
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search medicines, brands..." className="outline-none text-sm" />
            </div>

            <button onClick={() => setShowMobileFilters(true)} className="sm:hidden px-3 py-2 bg-emerald-600 text-white rounded-md">Filters</button>

            <div className="hidden sm:flex items-center gap-2">
              <label className="text-sm">Sort</label>
              <select value={sort} onChange={e => setSort(e.target.value)} className="text-sm rounded-md border px-2 py-1">
                <option value="popular">Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top rated</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left - Filters */}
          <aside className="md:col-span-3 lg:col-span-3 hidden md:block">
            <div className="bg-white p-4 rounded-xl shadow-sm sticky top-24">
              <h4 className="font-semibold">Filters</h4>

              <div className="mt-4">
                <h5 className="text-sm font-medium">Category</h5>
                <div className="mt-2 flex flex-col gap-2">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`text-sm text-left px-3 py-2 rounded-md ${selectedCategory === cat ? 'bg-emerald-50 border border-emerald-200' : 'hover:bg-slate-50'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h5 className="text-sm font-medium">Price range</h5>
                <div className="mt-2 flex items-center gap-2">
                  <input type="number" value={priceRange[0]} onChange={e => setPriceRange([Number(e.target.value || 0), priceRange[1]])} className="w-1/2 px-2 py-1 rounded-md border text-sm" />
                  <input type="number" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], Number(e.target.value || 1000)])} className="w-1/2 px-2 py-1 rounded-md border text-sm" />
                </div>
                <div className="text-xs text-slate-500 mt-2">Tip: enter values in your currency (0 - 1000).</div>
              </div>

              <div className="mt-4">
                <h5 className="text-sm font-medium">Rating</h5>
                <div className="mt-2 flex gap-2">
                  {[4,3,2].map(r => (
                    <button key={r} onClick={() => setPriceRange([priceRange[0], priceRange[1]])} className="text-sm px-3 py-1 rounded-md border">{r}+ ⭐</button>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button onClick={() => { setSelectedCategory('All'); setPriceRange([0,1000]); setQuery(''); }} className="flex-1 px-3 py-2 rounded-md bg-slate-100">Reset</button>
                <button onClick={() => {}} className="flex-1 px-3 py-2 rounded-md bg-emerald-600 text-white">Apply</button>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 bg-black/40 flex md:hidden">
              <div className="w-3/4 bg-white p-4 overflow-auto">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Filters</h4>
                  <button onClick={() => setShowMobileFilters(false)} className="text-slate-600">Close</button>
                </div>

                <div className="mt-4">
                  <h5 className="text-sm font-medium">Category</h5>
                  <div className="mt-2 flex flex-col gap-2">
                    {categories.map(cat => (
                      <button key={cat} onClick={() => setSelectedCategory(cat)} className={`text-sm text-left px-3 py-2 rounded-md ${selectedCategory === cat ? 'bg-emerald-50 border border-emerald-200' : 'hover:bg-slate-50'}`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <h5 className="text-sm font-medium">Price range</h5>
                  <div className="mt-2 flex items-center gap-2">
                    <input type="number" value={priceRange[0]} onChange={e => setPriceRange([Number(e.target.value || 0), priceRange[1]])} className="w-1/2 px-2 py-1 rounded-md border text-sm" />
                    <input type="number" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], Number(e.target.value || 1000)])} className="w-1/2 px-2 py-1 rounded-md border text-sm" />
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button onClick={() => { setSelectedCategory('All'); setPriceRange([0,1000]); setQuery(''); setShowMobileFilters(false); }} className="flex-1 px-3 py-2 rounded-md bg-slate-100">Reset</button>
                  <button onClick={() => setShowMobileFilters(false)} className="flex-1 px-3 py-2 rounded-md bg-emerald-600 text-white">Apply</button>
                </div>
              </div>

              <div className="flex-1" onClick={() => setShowMobileFilters(false)} />
            </div>
          )}

          {/* Products grid */}
          <section className="md:col-span-9 lg:col-span-9">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="text-sm text-slate-600">{products.length} products found</div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(p => (
                  <article key={p.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <Link href={`/products/${p.id}`}><Image src={p.image_url} alt={p.name} className="h-40 w-full object-cover" width={500} height={500} /></Link>
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-sm">{p.name}</h3>
                          <div className="text-xs text-slate-500 mt-1">{p.category}</div>
                        </div>
                        <div className="text-sm font-semibold">₹{p.price}</div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-xs text-slate-500">⭐ 4.5</div>
                        <div className="flex items-center gap-2">
                          <Link href={`/products/${p.id}`}><button className="px-3 py-1 rounded-md border text-xs">Details</button></Link>
                          <button className="px-3 py-1 rounded-md bg-emerald-600 text-white text-xs">Add</button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}

                {products.length === 0 && (
                  <div className="col-span-full text-center text-slate-500 py-10">No products match your filters.</div>
                )}
              </div>

              {/* Pagination placeholder */}
              <div className="mt-6 flex items-center justify-center">
                <nav className="inline-flex items-center gap-2">
                  <button className="px-3 py-1 rounded-md border">Prev</button>
                  <button className="px-3 py-1 rounded-md border bg-emerald-50">1</button>
                  <button className="px-3 py-1 rounded-md border">2</button>
                  <button className="px-3 py-1 rounded-md border">Next</button>
                </nav>
              </div>
            </div>
          </section>
        </div>
      </div>
  );
}
