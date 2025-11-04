import React, { Suspense } from "react";
import ShopClient from "./ShopClient";

export default function Page() {
  return (
    <main>
      <Suspense fallback={
        <>
          <div className="flex justify-center items-center my-5">Loading shop...</div>
        </>
        }>
        <ShopClient />
      </Suspense>
    </main>
  );
}
