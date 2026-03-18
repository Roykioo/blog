/**
 * Phantom Blog - Markdown-based Article System
 */

const PhantomBlog = {
    articlesCache: null,

    // Parse Markdown to HTML
    parseMarkdown(md) {
        return md
            // Code blocks
            .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
            // Inline code
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Headers
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            // Bold and Italic
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
            // Blockquotes
            .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
            // Horizontal rule
            .replace(/^---$/gm, '<hr>')
            // Unordered lists
            .replace(/^- (.*$)/gm, '<li>$1</li>')
            // Paragraphs
            .replace(/\n\n/g, '</p><p>')
            // Line breaks
            .replace(/\n/g, '<br>')
            // Wrap
            .replace(/^/, '<p>')
            .replace(/$/, '</p>')
            // Clean up empty paragraphs
            .replace(/<p><\/p>/g, '')
            .replace(/<p>(<h[1-3]>)/g, '$1')
            .replace(/(<\/h[1-3]>)<\/p>/g, '$1')
            .replace(/<p>(<pre>)/g, '$1')
            .replace(/(<\/pre>)<\/p>/g, '$1')
            .replace(/<p>(<blockquote>)/g, '$1')
            .replace(/(<\/blockquote>)<\/p>/g, '$1')
            .replace(/<p>(<hr>)<\/p>/g, '$1')
            .replace(/<p>(<li>)/g, '<ul>$1')
            .replace(/(<\/li>)<\/p>/g, '$1</ul>');
    },

    // Parse front matter from markdown
    parseFrontMatter(md) {
        const meta = {};
        const lines = md.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('**Tag:**')) {
                meta.tag = line.replace('**Tag:**', '').trim();
            } else if (line.startsWith('**Date:**')) {
                meta.date = line.replace('**Date:**', '').trim();
            } else if (line.startsWith('**ReadTime:**')) {
                meta.readTime = line.replace('**ReadTime:**', '').trim();
            } else if (line === '---') {
                // Content starts after ---
                meta.contentStart = i + 1;
                break;
            }
        }
        
        return meta;
    },

    // Get article list from index
    async getArticles() {
        if (this.articlesCache) return this.articlesCache;
        
        try {
            const response = await fetch('articles/index.json');
            const articleIds = await response.json();
            const articles = await Promise.all(
                articleIds.map(id => this.getArticleMeta(id))
            );
            this.articlesCache = articles.filter(a => a !== null);
            return this.articlesCache;
        } catch (error) {
            console.error('Failed to load articles:', error);
            return [];
        }
    },

    // Get article metadata
    async getArticleMeta(id) {
        try {
            const response = await fetch(`articles/${id}.md`);
            const md = await response.text();
            const meta = this.parseFrontMatter(md);
            
            // Extract title from first H1
            const titleMatch = md.match(/^# (.+)$/m);
            const title = titleMatch ? titleMatch[1] : id;
            
            // Get excerpt from first paragraph after front matter
            const contentStart = meta.contentStart || 0;
            const content = md.split('\n').slice(contentStart).join('\n');
            const excerptMatch = content.match(/^[^#\-\*\`>]+/m);
            const excerpt = excerptMatch ? excerptMatch[0].trim().substring(0, 150) + '...' : '';
            
            return {
                id,
                tag: meta.tag || 'Article',
                title,
                excerpt,
                date: meta.date || '',
                readTime: meta.readTime || ''
            };
        } catch (error) {
            console.error(`Failed to load article ${id}:`, error);
            return null;
        }
    },

    // Get full article content
    async getArticleContent(id) {
        try {
            const response = await fetch(`articles/${id}.md`);
            const md = await response.text();
            const meta = this.parseFrontMatter(md);
            
            // Extract title
            const titleMatch = md.match(/^# (.+)$/m);
            const title = titleMatch ? titleMatch[1] : id;
            
            // Get content after front matter
            const lines = md.split('\n');
            const contentStart = meta.contentStart || 0;
            const contentMd = lines.slice(contentStart).join('\n');
            const contentHtml = this.parseMarkdown(contentMd);
            
            return {
                id,
                tag: meta.tag || 'Article',
                title,
                date: meta.date || '',
                readTime: meta.readTime || '',
                content: contentHtml
            };
        } catch (error) {
            console.error(`Failed to load article ${id}:`, error);
            return null;
        }
    },

    // Render article card
    renderArticleCard(article) {
        return `
            <article class="article-card" onclick="PhantomBlog.openArticle('${article.id}')">
                <div class="article-tag">${article.tag}</div>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <div class="article-meta">
                    <span>${article.date}</span>
                    <span>${article.readTime}</span>
                </div>
            </article>
        `;
    },

    // Initialize article list
    async initArticleList(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        
        const articles = await this.getArticles();
        if (articles.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">No articles yet</p>';
            return;
        }
        
        container.innerHTML = articles.map(a => this.renderArticleCard(a)).join('');
    },

    // Open article in modal
    async openArticle(id) {
        const article = await this.getArticleContent(id);
        if (!article) return;
        
        const modal = document.getElementById('article-modal');
        const content = document.getElementById('article-content');
        
        if (modal && content) {
            content.innerHTML = `
                <button class="modal-close" onclick="PhantomBlog.closeModal()">&times;</button>
                <div class="article-tag">${article.tag}</div>
                <h1 class="article-title">${article.title}</h1>
                <div class="article-meta">
                    <span>${article.date}</span>
                    <span>${article.readTime}</span>
                </div>
                <div class="article-body">${article.content}</div>
            `;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    // Close modal
    closeModal() {
        const modal = document.getElementById('article-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
};
