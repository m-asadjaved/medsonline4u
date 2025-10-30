import Link from "next/link";
import Image from "next/image";
import slugify from 'slugify';

export const dynamic = 'force-dynamic';

export default async function FeaturedProducts() {
  const baseUrl = process.env.BASE_URL;
  const res = await fetch(`${baseUrl}/api/products`, { cache: "no-store" });
  const data = await res.json();

  return (
    <>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 mt-10">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Featured products</h3>
          <Link href={'/shop'} className="text-sm text-emerald-600">View all</Link>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.products.map((p) => (
            <article
              key={p.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              <Link href={`products/${slugify(p.slug)}`}><Image
                src={p.image_url}
                alt={p.name}
                className="h-44 w-full object-cover"
                width={500}
                height={500}
              />
              <div className="p-4">
                <h4 className="font-medium">{p.name}</h4>
                {/* <p
                  className="text-xs text-slate-500 mt-1"
                  dangerouslySetInnerHTML={{
                    __html: `${p.short_description.slice(0, 100)}...`,
                  }}
                ></p> */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm md:text-lg font-semibold">${p.min_price} - ${p.max_price}</div>
                </div>
              </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
