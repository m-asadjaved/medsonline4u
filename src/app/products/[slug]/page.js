import React from 'react';
import Image from 'next/image';
import RelatedProducts from '../../_components/RelatedProducts';
import ProductActions from "./productActions";

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const baseUrl = process.env.BASE_URL;
  const res = await fetch(`${baseUrl}/api/products/${slug}`, { cache: "no-store"});
  const data = await res.json();
  const product = data;

  return (
    <>
      <main className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
            {/* Images */}
            <div className="lg:col-span-6">
              <div className="bg-slate-100 rounded-xl p-4">
                <Image width={500} height={500} src={product.image_url} alt={product.name} className="w-full h-80 md:h-[420px] object-contain rounded-md bg-white" />

                <div className="mt-3 flex items-center gap-3 overflow-x-auto">
                  {/* {product.images.map((img, idx) => (
                  <button key={idx} className={`flex-shrink-0 rounded-md p-1 ${true === true ? 'ring-2 ring-emerald-500' : 'hover:opacity-80'}`}>
                    <img src={img} alt={`thumb-${idx}`} className="h-16 w-16 object-cover rounded-md" />
                  </button>
                ))} */}
                </div>
              </div>

              {/* Product details below images on mobile */}
              <div className="mt-6 lg:hidden p-3">
                <h1 className="text-lg font-semibold">{product.name}</h1>
                <div className="mt-2 flex items-center gap-3">
                  <div className="text-2xl font-bold">${product.price}</div>
                  <div className="text-sm text-slate-500 line-through">${product.mrp}</div>
                  <div className="text-sm text-emerald-600">Save ${product.savings}</div>
                </div>
              </div>
            </div>

            {/* Purchase panel */}
            <aside className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="hidden lg:block">
                  <h1 className="text-2xl font-semibold">{product.name}</h1>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="text-3xl font-bold">₹{product.price}</div>
                    <div className="text-sm text-slate-500 line-through">₹{product.mrp}</div>
                    <div className="text-sm text-emerald-600">Save ₹{product.savings}</div>
                  </div>
                </div>

                <ProductActions productId={product.id} />

                <div className="mt-4 text-sm text-slate-600">
                  <div className="font-medium">Delivery</div>
                  <div className="mt-1">Standard delivery: 1-3 business days. Express available at checkout.</div>
                </div>

                <div className="mt-4 text-sm text-slate-600">
                  <div className="font-medium">What you get</div>
                  <ul className="mt-2 list-disc list-inside">
                    {/* {product.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))} */}
                  </ul>
                </div>

                <div className="mt-4 text-sm">
                  <div className="font-medium">Description</div>
                  <p className="mt-2 text-slate-600">
                    {/* {false ? product.description : `${product.description.slice(0, 140)}...`} */}
                    <button className="ml-2 text-emerald-600">{false ? 'Show less' : 'Read more'}</button>
                  </p>
                </div>
              </div>

              <div className="mt-6 lg:mt-0">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" /></svg>
                  <div>
                    <div className="font-medium">Secure payments</div>
                    <div className="text-xs">Multiple payment options with SSL encryption.</div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-slate-500">Need a prescription? Our partnered doctors can issue one online.</div>
              </div>
            </aside>

            {/* Reviews & Related */}
            <div className="lg:col-span-12 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow-sm">
                  <h3 className="font-semibold">Customer reviews</h3>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="text-3xl font-bold">{product.rating}</div>
                    <div>
                      <div className="text-sm">Based on {product.reviews} reviews</div>
                      <div className="mt-2 text-xs text-slate-500">Most reviews are positive. Always consult your doctor for medical advice.</div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="border rounded-md p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">User {i}</div>
                          <div className="text-xs text-slate-500">⭐ {4 + (i % 2)}</div>
                        </div>
                        <div className="text-sm text-slate-600 mt-2">Worked well for fever. Quick delivery.</div>
                      </div>
                    ))}
                  </div>
                </div>

                <aside className="bg-white p-4 rounded-xl shadow-sm">
                  <h4 className="font-semibold">Related products</h4>
                  <div className="mt-4 grid grid-cols-1 gap-3">
                    {/* {RELATED.map(r => (
                    <div key={r.id} className="flex items-center gap-3">
                      <img src={r.img} className="h-12 w-12 object-cover rounded-md" />
                      <div className="flex-1 text-sm">
                        <div className="font-medium">{r.name}</div>
                        <div className="text-xs text-slate-500">₹{r.price}</div>
                      </div>
                      <button className="px-3 py-1 rounded-md bg-emerald-600 text-white text-xs">Add</button>
                    </div>
                  ))} */}
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto text-center text-xs text-slate-500 mt-6">*Delivery time varies by location</div>
      </main>

      <RelatedProducts />
    </>
  );
}
