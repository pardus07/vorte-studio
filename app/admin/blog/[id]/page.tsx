import { getBlogPost } from "@/actions/blog";
import BlogEditor from "./blog-editor";

export const dynamic = "force-dynamic";

export default async function BlogEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let post = null;
  if (id !== "new") {
    post = await getBlogPost(id);
  }
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">
        {post ? "Blog Yazısı Düzenle" : "Yeni Blog Yazısı"}
      </h1>
      <BlogEditor post={post} />
    </div>
  );
}
