import { prisma } from "@/lib/prisma";
import { TOOL_META } from "./ai-tools";

type ToolResult = {
  data?: unknown;
  error?: string;
  pendingArgs?: Record<string, unknown>;
};

/**
 * Level 1 tool'ları otomatik çalıştırır.
 * Level 2-3 tool'larını pendingArgs olarak döndürür (frontend onay bekler).
 */
export async function resolveToolCall(
  toolName: string,
  args: Record<string, unknown>,
  baseUrl: string,
  cookies: string
): Promise<ToolResult> {
  const meta = TOOL_META[toolName];
  if (!meta) return { error: `Bilinmeyen araç: ${toolName}` };

  // Level 2-3: frontend onay gerekli
  if (meta.level >= 2) {
    return { pendingArgs: args };
  }

  // Level 1: otomatik çalıştır
  return executeReadToolCall(toolName, args);
}

/**
 * Frontend onay aldıktan sonra Level 2-3 tool'larını çalıştırır.
 * Mevcut API route'larına fetch ile yönlendirir (Vorte Tekstil pattern).
 */
export async function executeApprovedToolCall(
  toolName: string,
  args: Record<string, unknown>,
  baseUrl: string,
  cookies: string
): Promise<ToolResult> {
  return executeWriteToolCall(toolName, args, baseUrl, cookies);
}

// ─── Level 1: Prisma-direct read operations ────────────────────

async function executeReadToolCall(
  toolName: string,
  args: Record<string, unknown>
): Promise<ToolResult> {
  try {
    switch (toolName) {
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
        if (!post) return { error: "Blog yazısı bulunamadı" };
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

      case "generate_image": {
        return {
          data: { message: "generate_image route handler'da işlenir" },
        };
      }

      default:
        return { error: `Bilinmeyen araç: ${toolName}` };
    }
  } catch (err) {
    console.error(`[ai-executor] ${toolName} hatası:`, err);
    return {
      error: err instanceof Error ? err.message : "Araç çalıştırma hatası",
    };
  }
}

// ─── Level 2-3: fetch to existing API routes (Vorte Tekstil pattern) ──

async function executeWriteToolCall(
  toolName: string,
  args: Record<string, unknown>,
  baseUrl: string,
  cookies: string
): Promise<ToolResult> {
  const meta = TOOL_META[toolName];
  if (!meta) return { error: `Bilinmeyen araç: ${toolName}` };

  try {
    // Endpoint'teki {id} gibi path param'ları değiştir
    let endpoint = meta.endpoint;
    const bodyArgs = { ...args };
    const pathParamMatch = endpoint.match(/\{(\w+)\}/);
    if (pathParamMatch) {
      const paramName = pathParamMatch[1];
      endpoint = endpoint.replace(`{${paramName}}`, String(args[paramName]));
      delete bodyArgs[paramName];
    }

    // tags: virgülle ayrılmış string → array
    if (bodyArgs.tags && typeof bodyArgs.tags === "string") {
      bodyArgs.tags = (bodyArgs.tags as string).split(",").map((t: string) => t.trim());
    }

    const url = `${baseUrl}${endpoint}`;
    const fetchOptions: RequestInit = {
      method: meta.method,
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies,
      },
    };

    if (meta.method !== "GET" && meta.method !== "DELETE") {
      fetchOptions.body = JSON.stringify(bodyArgs);
    }

    console.log(`[ai-executor] ${meta.method} ${url}`);

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errBody = await response.text();
      let errorMsg: string;
      try {
        const parsed = JSON.parse(errBody);
        errorMsg = parsed.error || parsed.message || errBody;
      } catch {
        errorMsg = errBody || `HTTP ${response.status}`;
      }
      console.error(`[ai-executor] API hatası (${response.status}):`, errorMsg);
      return { error: errorMsg };
    }

    const text = await response.text();
    if (!text) return { data: { success: true } };

    try {
      return { data: JSON.parse(text) };
    } catch {
      return { data: { success: true } };
    }
  } catch (err) {
    console.error(`[ai-executor] ${toolName} fetch hatası:`, err);
    return {
      error: `API bağlantı hatası: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`,
    };
  }
}

