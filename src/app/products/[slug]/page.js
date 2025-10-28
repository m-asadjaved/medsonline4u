import React from 'react';
import Image from 'next/image';
import RelatedProducts from '../../_components/RelatedProducts';
import ProductActions from "./productActions";
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const baseUrl = process.env.BASE_URL;
  const res = await fetch(`${baseUrl}/api/products/${slug}`, { cache: "no-store" });
  const data = await res.json();
  const product = data;

  if(data.error) notFound();

  return (
    <>
      <main className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 md:gap-6 gap-0 p-6">
            {/* Images */}
            <div className="lg:col-span-6">
              <div className="bg-slate-100 rounded-xl p-4">
                <Image width={500} height={500} src={product.image_url} alt={product.name} className="w-full h-80 md:h-[420px] object-contain rounded-md bg-white" />
              </div>

              {/* Product details below images on mobile */}
              <div className="mt-6 lg:hidden p-3">
                <h1 className="text-2xl font-semibold">{product.name}</h1>
              </div>
            </div>

            {/* Purchase panel */}
            <aside className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="hidden lg:block">
                  <span className="mb-2 inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">{product.category_name}</span>
                  <h1 className="text-2xl font-semibold">{product.name}</h1>
                </div>

                <ProductActions productId={product.id} variations={product.variations} />

                <div className="mt-4 text-sm">
                  <div className="font-bold">Quick Description</div>
                  <p className="mt-2 text-slate-600" dangerouslySetInnerHTML={{
                    __html: product.short_description
                      ?.replace(/\\n/g, "<br>")
                      .replace(/\n/g, "<br>")
                      .trim(),
                  }}>
                  </p>
                </div>

                <div className="mt-4 text-sm text-slate-600">
                  <div className="font-bold">Delivery</div>
                  <div className="mt-1">Standard delivery: 1-3 business days. Express available at checkout.</div>
                </div>
              </div>
            </aside>

            {/* Description */}
            <div
              className="lg:col-span-12 mt-6"
              dangerouslySetInnerHTML={{
                __html: product.description
                  ?.replace(/\\n/g, "<br>")
                  .replace(/\n/g, "<br>")
                  .trim(),
              }}
            ></div>


          </div>
        </div>

        <div className="max-w-6xl mx-auto text-center text-xs text-slate-500 mt-6">*Delivery time varies by location</div>
      </main>

      <RelatedProducts />
    </>
  );
}
