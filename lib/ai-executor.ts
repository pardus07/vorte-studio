import { prisma } from "@/lib/prisma";
import { TOOL_META } from "./ai-tools";
import { createBlogPost, updateBlogPost, deleteBlogPost } from "@/actions/blog";
import { upsertSetting } from "@/actions/settings";

type ToolResult = {
  data?: unknown;
  error?: string;
  pendingArgs?: Record<string, unknown>;
};

/**
 * Level 1 tool'lari otomatik calistirir.
 * Level 2-3 tool'larini pendingArgs olarak dondurur (frontend onay bekler).
 */
export async function resolveToolCall(
  toolName: string,
  args: Record<string, unknown>
): Promise<ToolResult> {
  const meta = TOOL_META[toolName];
  if (!meta) return { error: `Bilinmeyen arac: ${toolName}` };

  // Level 2-3: frontend onay gerekli
  if (meta.level >= 2) {
    return { pendingArgs: args };
  }

  // Level 1: otomatik calistir
  return executeToolCall(toolName, args);
}

/**
 * Frontend onay aldiktan sonra Level 2-3 tool'larini calistirir.
 */
export async function executeApprovedToolCall(
  toolName: string,
  args: Record<string, unknown>
): Promise<ToolResult> {
  return executeToolCall(toolName, args);
}

async function executeToolCall(
  toolName: string,
  args: Record<string, unknown>
): Promise<ToolResult> {
  try {
    switch (toolName) {
      // ── Level 1: Read Operations ──

      case "get_dashboard_stats": {
        const [projectCount, clientCount, leadCount, quoteCount, maintenanceRevenue] =
          await Promise.all([
            prisma.project.count(),
            prisma.client.count(),
            prisma.lead.count(),
            prisma.quote.count({ where: { status: "DRAFT" } }),
            prisma.maintenance.aggregate({
              where: { isActive: true },
              _sum: { monthlyFee: true },
            }),
          ]);
        return {
          data: {
            projectCount,
            clientCount,
            leadCount,
            pendingQuotes: quoteCount,
            monthlyMaintenanceRevenue:
              maintenanceRevenue._sum.monthlyFee || 0,
          },
        };
      }

      case "get_blog_posts": {
        const where: Record<string, unknown> = {};
        if (args.published !== undefined) where.published = args.published;
        if (args.search)
          where.title = {
            contains: args.search as string,
            mode: "insensitive",
          };
        const posts = await prisma.blogPost.findMany({
          where,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            slug: true,
            published: true,
            publishedAt: true,
            tags: true,
            createdAt: true,
          },
        });
        return { data: posts };
      }

      case "get_blog_post": {
        const post = await prisma.blogPost.findUnique({
          where: { id: args.id as string },
        });
        if (!post) return { error: "Blog yazisi bulunamadi" };
        return { data: post };
      }

      case "get_settings": {
        const rows = await prisma.siteSettings.findMany();
        const map: Record<string, string> = {};
        for (const r of rows) map[r.key] = r.value;
        return { data: map };
      }

      case "get_portfolio": {
        const items = await prisma.portfolioItem.findMany({
          where: { isPublished: true },
          orderBy: { order: "asc" },
          select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            featured: true,
          },
        });
        return { data: items };
      }

      case "get_clients": {
        const cWhere: Record<string, unknown> = {};
        if (args.status) cWhere.status = args.status;
        const clients = await prisma.client.findMany({
          where: cWhere,
          orderBy: { updatedAt: "desc" },
          select: {
            id: true,
            name: true,
            company: true,
            status: true,
            totalRevenue: true,
          },
        });
        return { data: clients };
      }

      case "get_leads": {
        const lWhere: Record<string, unknown> = {};
        if (args.status) lWhere.status = args.status;
        const leads = await prisma.lead.findMany({
          where: lWhere,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            company: true,
            status: true,
            source: true,
          },
        });
        return { data: leads };
      }

      case "get_projects": {
        const projects = await prisma.project.findMany({
          orderBy: { updatedAt: "desc" },
          select: {
            id: true,
            title: true,
            status: true,
            progress: true,
            budget: true,
          },
          take: 20,
        });
        return { data: projects };
      }

      case "get_maintenance": {
        const items = await prisma.maintenance.findMany({
          where: { isActive: true },
          include: { client: { select: { name: true } } },
        });
        return { data: items };
      }

      // ── Level 2: Write Operations ──

      case "create_blog_post": {
        const tags = args.tags
          ? (args.tags as string).split(",").map((t: string) => t.trim())
          : [];
        const result = await createBlogPost({
          title: args.title as string,
          slug: args.slug as string | undefined,
          excerpt: args.excerpt as string | undefined,
          content: args.content as string,
          coverImage: args.coverImage as string | undefined,
          seoTitle: args.seoTitle as string | undefined,
          seoDescription: args.seoDescription as string | undefined,
          tags,
          published: (args.published as boolean) ?? false,
        });
        if (!result.success) return { error: result.error || "Blog oluşturulamadı" };
        return { data: { id: result.id, slug: result.slug } };
      }

      case "update_blog_post": {
        const updatePayload: Record<string, unknown> = {};
        if (args.title) updatePayload.title = args.title;
        if (args.content) updatePayload.content = args.content;
        if (args.slug) updatePayload.slug = args.slug;
        if (args.excerpt !== undefined) updatePayload.excerpt = args.excerpt;
        if (args.seoTitle !== undefined) updatePayload.seoTitle = args.seoTitle;
        if (args.seoDescription !== undefined) updatePayload.seoDescription = args.seoDescription;
        if (args.coverImage !== undefined) updatePayload.coverImage = args.coverImage;
        if (args.tags) updatePayload.tags = (args.tags as string).split(",").map((t: string) => t.trim());
        if (args.published !== undefined) updatePayload.published = args.published;
        const result = await updateBlogPost(args.id as string, updatePayload);
        if (!result.success) return { error: result.error || "Blog güncellenemedi" };
        return { data: { updated: true } };
      }

      case "update_settings": {
        const result = await upsertSetting(args.key as string, args.value as string);
        if (!result.success) return { error: result.error || "Ayar güncellenemedi" };
        return { data: { key: args.key, value: args.value } };
      }

      case "generate_image": {
        // generate_image API route uzerinden calistirilir
        // Burada sadece bilgi dondur, gercek islem chat API'de yapilir
        return {
          data: {
            message:
              "generate_image araci API route uzerinden calistirilmali",
          },
        };
      }

      // ── Level 3: Delete Operations ──

      case "delete_blog_post": {
        const result = await deleteBlogPost(args.id as string);
        if (!result.success) return { error: result.error || "Blog silinemedi" };
        return { data: { deleted: true } };
      }

      default:
        return { error: `Bilinmeyen arac: ${toolName}` };
    }
  } catch (err) {
    console.error(`[ai-executor] ${toolName} hatasi:`, err);
    return {
      error: err instanceof Error ? err.message : "Arac calistirma hatasi",
    };
  }
}

