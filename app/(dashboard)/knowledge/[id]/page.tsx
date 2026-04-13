import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

interface Props {
  params: { id: string }
}

export default async function KnowledgeArticlePage({ params }: Props) {
  const supabase = createServerSupabaseClient()

  const { data: article } = await supabase
    .from('kb_articles')
    .select(`
      *,
      category:kb_categories(id, name, icon, slug),
      author:profiles(full_name)
    `)
    .eq('slug', params.id)
    .single()

  if (!article) {
    notFound()
  }

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--forge-muted)' }}>
        <Link href="/knowledge" className="hover:underline">Knowledge</Link>
        {article.category && (
          <>
            <span>/</span>
            <Link href="/knowledge" className="hover:underline">
              {article.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span style={{ color: 'var(--forge-heading)' }}>{article.title}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          {article.category?.icon && (
            <span className="text-2xl">{article.category.icon}</span>
          )}
          <h1 
            className="text-3xl font-bold"
            style={{ color: 'var(--forge-heading)' }}
          >
            {article.title}
          </h1>
        </div>
        <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--forge-muted)' }}>
          {article.author?.full_name && (
            <span>By {article.author.full_name}</span>
          )}
          <span>·</span>
          <span>Updated {formatDate(article.updated_at)}</span>
          {article.is_internal && (
            <>
              <span>·</span>
              <span 
                className="px-2 py-0.5 rounded text-xs font-semibold uppercase"
                style={{ background: 'var(--forge-border)' }}
              >
                Internal
              </span>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <Card className="markdown-content">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </Card>
    </div>
  )
}
