/**
 * Phantom Blog - 文章管理系统
 */

const PhantomBlog = {
    articlesCache: null,

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
            console.error('加载文章列表失败:', error);
            return [];
        }
    },

    async getArticleMeta(id) {
        try {
            const response = await fetch(`articles/${id}.json`);
            const article = await response.json();
            return {
                id: article.id,
                tag: article.tag,
                title: article.title,
                excerpt: article.excerpt,
                date: article.date,
                readTime: article.readTime
            };
        } catch (error) {
            console.error(`加载文章 ${id} 元数据失败:`, error);
            return null;
        }
    },

    async getArticleContent(id) {
        try {
            const response = await fetch(`articles/${id}.json`);
            return await response.json();
        } catch (error) {
            console.error(`加载文章 ${id} 内容失败:`, error);
            return null;
        }
    },

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

    async initArticleList(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const articles = await this.getArticles();
        if (articles.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">暂无文章</p>';
            return;
        }

        container.innerHTML = articles.map(a => this.renderArticleCard(a)).join('');
    },

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

    closeModal() {
        const modal = document.getElementById('article-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
};
