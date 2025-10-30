"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from 'next/navigation'
import { CiFilter } from "react-icons/ci"; // Example: Font Awesome shopping cart
import slugify from "slugify";

export default function ShopPage() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category') ?? 0;
  
  const [selectedCategory, setSelectedCategory] = useState(category ?? 0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    fetchProducts();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    fetchProducts();
  }, [selectedCategory]);

  async function fetchProducts() {
    setLoading(true);
    try {
      let res;
      if(selectedCategory != 0){
        res = await fetch(`/api/products/shop/${currentPage}/${selectedCategory}`);
      }else{
        res = await fetch(`/api/products/shop/${currentPage}`);
      }
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.products ?? [];

      setProducts(list);
      setTotalProducts(data.totalRows);
      setTotalPages(
        Math.ceil(data.totalRows / 9)
      );
    } catch (err) {
      console.error('Failed to fetch products', err);
      setProducts([]);
    }
    setLoading(false);
  }

  async function fetchCategories() {
    try {
      const res = await fetch(`/api/categories/`);
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();               // <- await here
      // API might return { products: [...] } or an array directly
      const list = Array.isArray(data) ? data : data.categories ?? [];
      setCategories([{ id: 0, name: "All" }, ...list]);
    } catch (err) {
      console.error('Failed to fetch categories', err);
      setCategories([]); // fallback to empty array
    }
  }

  return (
    <div className="max-w-7xl mx-auto mt-5">
      <div className="flex items-center justify-between mb-6">
        {/* <div>
          <h1 className="text-2xl font-bold">Shop Medicines</h1>
          <p className="text-sm text-slate-600 mt-1">Browse verified medicines — secure checkout, fast delivery.</p>
        </div> */}

        <div className="flex items-center gap-3">

          <button onClick={() => setShowMobileFilters(true)} className="sm:hidden px-3 py-2 mx-2 bg-emerald-600 text-white rounded-md"><CiFilter /></button>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left - Filters */}
        <aside className="md:col-span-3 lg:col-span-3 hidden md:block">
          <div className="bg-white p-4 rounded-xl shadow-sm sticky top-24">
            <h5 className="font-semibold">Categories</h5>

            <div className="mt-4">
              <div className="mt-2 flex flex-col gap-2">
                {categories.map(cat => (
                  <button key={cat.id} onClick={() => {setSelectedCategory(cat.id);}} className={`cursor-pointer text-sm text-left px-3 py-2 rounded-md ${selectedCategory == cat.id ? 'bg-emerald-100 border border-emerald-200' : 'hover:bg-emerald-50 hover:border-emerald-100'}`}>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-100 bg-black/40 flex md:hidden">
            <div className="w-3/4 bg-white p-4 overflow-auto">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Filters</h4>
                <button onClick={() => setShowMobileFilters(false)} className="text-slate-600">Close</button>
              </div>

              <div className="mt-4">
                <h5 className="text-sm font-medium">Category</h5>
                <div className="mt-2 flex flex-col gap-2">
                  {categories.map(cat => (
                    <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`text-sm text-left px-3 py-2 rounded-md ${selectedCategory === cat.id ? 'bg-emerald-50 border border-emerald-200' : 'hover:bg-slate-50'}`}>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1" onClick={() => setShowMobileFilters(false)} />
          </div>
        )}

        {/* Products grid */}
        <section className="md:col-span-9 lg:col-span-9">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            {!loading && <div className="text-sm text-slate-600">{totalProducts} products found</div>}

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {!loading && products.map(p => (
                <article key={p.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                  <Link href={`/products/${p.id}?${slugify(p.name)}`}><Image src={p.image_url} alt={p.name} className="h-40 w-full object-cover" width={500} height={500} />
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-xs text-slate-500 mt-1">{p.category}</div>
                          <h3 className="font-medium text-sm">{p.name}</h3>
                        </div>
                      </div>
                      <div className="text-sm font-semibold">${p.min_price} - ${p.max_price}</div>

                      <div className="flex items-center justify-between">
                        <p
                          className="text-xs text-slate-500 mt-1"
                          dangerouslySetInnerHTML={{
                            __html: `${p.short_description.slice(0, 90)}...`,
                          }}
                        ></p>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}

              {loading ? (
                <div className="col-span-full text-center text-slate-500 py-10">Loading...</div>
              ) : products.length === 0 && (
                <div className="col-span-full text-center text-slate-500 py-10">No products match your filters.</div>
              )}
            </div>

            {/* Pagination */}
            {!loading &&
            <div className="mt-6 flex items-center justify-center">
              <nav className="inline-flex items-center gap-2">

                {/* Prev Button */}
                <button
                  onClick={() => { setCurrentPage(currentPage - 1); setLoading(true); }}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md border transition-all ${currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-emerald-500 hover:text-white cursor-pointer"
                    }`}
                >
                  Prev
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  )
                  .map((page, index, arr) => (
                    <React.Fragment key={page}>
                      {/* Ellipsis handling */}
                      {index > 0 && page - arr[index - 1] > 1 && (
                        <span className="px-2">...</span>
                      )}

                      <button
                        onClick={() => { setCurrentPage(page); setLoading(true); }}
                        className={`px-3 py-1 rounded-md border transition-all ${page === currentPage
                          ? "bg-emerald-600 text-white"
                          : "hover:bg-emerald-500 hover:text-white cursor-pointer"
                          }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}

                {/* Next Button */}
                <button
                  onClick={() => { setCurrentPage(currentPage + 1); setLoading(true); }}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md border transition-all ${currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-emerald-500 hover:text-white cursor-pointer"
                    }`}
                >
                  Next
                </button>

              </nav>
            </div>}

          </div>
        </section>
      </div>
    </div>
  );
}
