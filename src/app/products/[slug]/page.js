import React from 'react';

const SAMPLE_PRODUCT = {
  id: 101,
  name: 'Paracetamol 500mg - Tablet (20 pcs)',
  price: 129,
  mrp: 150,
  savings: 21,
  category: 'Pain Relief',
  rating: 4.6,
  reviews: 324,
  images: [
    'https://images.unsplash.com/photo-1580281657521-3d9bd8d45f2b?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=1',
    'https://images.unsplash.com/photo-1580281657521-3d9bd8d45f2b?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=2',
    'https://images.unsplash.com/photo-1584281456442-7c4b1b9d0a5b?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=3',
  ],
  description:
    'Effective fever and pain relief. Each tablet contains 500mg of paracetamol. Use as directed by your physician. Keep out of reach of children.',
  highlights: ['20 tablets', 'Store in a cool, dry place', 'Check interactions with other meds'],
};

const RELATED = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 200,
  name: `Related Product ${i + 1}`,
  price: 80 + i * 30,
  img: `https://images.unsplash.com/photo-1580281657521-3d9bd8d45f2b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=${i}`,
}));

export default async function ProductPage({ params }) {
  "use cache"
  const { slug } = await params;
  const baseUrl = process.env.BASE_URL;
  const res = await fetch(`${baseUrl}/api/products/${slug}`);
  const data = await res.json();
  const product = data;

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
          {/* Images */}
          <div className="lg:col-span-6">
            <div className="bg-slate-100 rounded-xl p-4">
              <img src={product.image_url} alt={product.name} className="w-full h-80 md:h-[420px] object-contain rounded-md bg-white" />

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

              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="text-sm text-slate-600">Qty</div>
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <button className="px-3 py-2 text-sm">-</button>
                    <div className="px-4 py-2 text-sm">21</div>
                    <button className="px-3 py-2 text-sm">+</button>
                  </div>
                </div>

                <div className="text-sm text-slate-600">⭐ {product.rating} · {product.reviews} reviews</div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 px-4 py-3 rounded-lg bg-emerald-600 text-white font-semibold">Add to cart</button>
                <button className="px-4 py-3 rounded-lg border border-emerald-600 text-emerald-600">Buy now</button>
              </div>

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
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18"/></svg>
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
                  {[1,2,3].map(i => (
                    <div key={i} className="border rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">User {i}</div>
                        <div className="text-xs text-slate-500">⭐ {4 + (i%2)}</div>
                      </div>
                      <div className="text-sm text-slate-600 mt-2">Worked well for fever. Quick delivery.</div>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="bg-white p-4 rounded-xl shadow-sm">
                <h4 className="font-semibold">Related products</h4>
                <div className="mt-4 grid grid-cols-1 gap-3">
                  {RELATED.map(r => (
                    <div key={r.id} className="flex items-center gap-3">
                      <img src={r.img} className="h-12 w-12 object-cover rounded-md" />
                      <div className="flex-1 text-sm">
                        <div className="font-medium">{r.name}</div>
                        <div className="text-xs text-slate-500">₹{r.price}</div>
                      </div>
                      <button className="px-3 py-1 rounded-md bg-emerald-600 text-white text-xs">Add</button>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto text-center text-xs text-slate-500 mt-6">*Delivery time varies by location</div>
    </main>
  );
}
