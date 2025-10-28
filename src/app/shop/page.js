import React, { Suspense } from "react";
import ShopClient from "./ShopClient";

export default function Page() {
  return (
    <main>
      <Suspense fallback={<div>Loading shop...</div>}>
        <ShopClient />
      </Suspense>
    </main>
  );
}
