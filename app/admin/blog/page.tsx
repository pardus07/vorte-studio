import { getBlogPosts } from "@/actions/blog";
import BlogList from "./blog-list";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Blog Yönetimi</h1>
        <p className="mt-1 text-[13px] text-admin-muted">
          Blog yazılarını oluşturun, düzenleyin ve yayınlayın.
        </p>
      </div>
      <BlogList initialPosts={posts} />
    </div>
  );
}
