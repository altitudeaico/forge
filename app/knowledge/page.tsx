import { createServerSupabaseClient, getProfile } from '@/lib/supabase/server'
import { PageHeader, Card, EmptyState } from '@/components/ui'
import { formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'

export default async function KnowledgePage() {
  const supabase = createServerSupabaseClient()
  const profile = await getProfile() as { role: string } | null
  
  const canEdit = profile?.role === 'super_admin' || profile?.role === 'admin'

  const { data: categoriesData } = await supabase
    .from('kb_categories')
    .select('*')
    .order('sort_order')

  const categories = categoriesData as any[] | null

  const { data: articlesData } = await supabase
    .from('kb_articles')
    .select(`
      *,
      category:kb_categories(id, name, icon)
    `)
    .eq('is_published', true)
    .order('updated_at', { ascending: false })

  const articles = articlesData as any[] | null

  // Group articles by category
  const articlesByCategory: Record<string, any[]> = {}
  articles?.forEach((article: any) => {
    const catId = article.category_id || 'uncategorized'
    if (!articlesByCategory[catId]) {
      articlesByCategory[catId] = []
    }
    articlesByCategory[catId].push(article)
  })

  return (
    <div>
      <PageHeader 
        title="Knowledge Base"
        description="Guides, playbooks, and documentation"
        action={canEdit && (
          <button className="btn btn-primary">
            + New Article
          </button>
        )}
      />

      {/* Categories Grid */}
      {categories && categories.length > 0 ? (
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category.id}>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{category.icon || '📁'}</span>
                <div>
                  <h2 
                    className="font-semibold text-lg"
                    style={{ color: 'var(--forge-heading)' }}
                  >
                    {category.name}
                  </h2>
                  {category.description && (
                    <p 
                      className="text-sm"
                      style={{ color: 'var(--forge-muted)' }}
                    >
                      {category.description}
                    </p>
                  )}
                </div>
                {category.is_internal && (
                  <span 
                    className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded"
                    style={{ background: 'var(--forge-border)', color: 'var(--forge-muted)' }}
                  >
                    Internal
                  </span>
                )}
              </div>

              {/* Articles */}
              {articlesByCategory[category.id] && articlesByCategory[category.id].length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {articlesByCategory[category.id].map((article: any) => (
                    <Link key={article.id} href={`/knowledge/${article.slug}`}>
                      <Card hover className="h-full">
                        <h3 
                          className="font-semibold mb-2"
                          style={{ color: 'var(--forge-heading)' }}
                        >
                          {article.title}
                        </h3>
                        {article.excerpt && (
                          <p 
                            className="text-sm mb-4 line-clamp-2"
                            style={{ color: 'var(--forge-text)' }}
                          >
                            {article.excerpt}
                          </p>
                        )}
                        <p 
                          className="text-xs"
                          style={{ color: 'var(--forge-muted)' }}
                        >
                          Updated {formatRelativeTime(article.updated_at)}
                        </p>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <Card>
                  <p 
                    className="text-sm text-center py-4"
                    style={{ color: 'var(--forge-muted)' }}
                  >
                    No articles in this category yet
                  </p>
                </Card>
              )}
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon="◈"
            title="No knowledge base content"
            description="Start building your knowledge base by creating categories and articles"
            action={canEdit ? {
              label: 'Create Category',
              onClick: () => {}
            } : undefined}
          />
        </Card>
      )}
    </div>
  )
}
