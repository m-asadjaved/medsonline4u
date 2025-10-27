import Link from "next/link";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function FeaturedProducts() {
  const baseUrl = process.env.BASE_URL;
  const res = await fetch(`${baseUrl}/api/products`, { cache: "no-store"});
  const data = await res.json();

  return (
    <>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 mt-10">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Featured products</h3>
          <a className="text-sm text-emerald-600">View all</a>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.products.map((p) => (
            <article
              key={p.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              <Link href={`/products/${p.id}`}><Image
                src={p.image_url}
                alt={p.name}
                className="h-auto w-full object-cover"
                width={500}
                height={500}
              /></Link>
              <div className="p-4">
                <h4 className="font-medium">{p.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{p.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-lg font-semibold">${p.price}</div>
                  <div className="flex items-center gap-2">
                    <Link href={`/products/${p.id}`}>
                      <button className="px-3 py-1 rounded-md border border-slate-200 text-sm">
                        Details
                      </button>
                    </Link>
                    <button className="px-3 py-1 rounded-md bg-emerald-600 text-white text-sm">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
