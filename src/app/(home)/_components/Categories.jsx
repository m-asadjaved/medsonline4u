import Link from "next/link";
import slugify from 'slugify';

export const dynamic = "force-dynamic";

export default async function FeaturedProducts() {
  const baseUrl = process.env.BASE_URL;
  const res = await fetch(`${baseUrl}/api/categories`, { cache: "no-store" });
  const data = await res.json();

  return (
    <>
      {/* CATEGORIES */}
      <section id="categories" className="scroll-mt-20 md:scroll-mt-24 max-w-7xl mx-auto px-6 md:px-8 lg:px-12 mt-12">
        <h3 className="text-xl font-semibold">Browse by category</h3>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {data.categories.map((c) => (
            <Link href={`/shop?category=${c.id}?${slugify(c.name)}`} key={c.id}>
              <div className="bg-white p-3 rounded-lg text-center shadow-sm hover:shadow-md transition">
                <div className="h-12 w-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-xl">
                  💊
                </div>
                <div className="mt-2 text-sm font-medium">{c.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      ;
    </>
  );
}
