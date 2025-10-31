// app/admin/images/page.jsx
import ImageManagerClient from "./ImageManagerClient";

export default function Page() {
  return (
    <main className="p-6">
      <h1 style={{ marginBottom: 12 }}>ImageKit — File Manager</h1>
      <ImageManagerClient />
    </main>
  );
}
