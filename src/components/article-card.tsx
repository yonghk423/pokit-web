import type { Article } from "@/content/home";

type Props = {
  article: Article;
  variant?: "feature" | "vertical" | "compact" | "mini";
  hideImage?: boolean;
};

export function ArticleCard({
  article,
  variant = "vertical",
  hideImage = false,
}: Props) {
  return (
    <article className={`article-card article-card--${variant}`}>
      {!hideImage && (
        <a href={`#${article.slug}`} className="article-card__media" aria-label={article.title}>
          <img src={article.image} alt={article.imageAlt} loading="lazy" />
        </a>
      )}
      <div className="article-card__body">
        <p className="article-card__kicker">{article.kicker ?? article.category}</p>
        <h3 className="article-card__title">
          <a href={`#${article.slug}`}>{article.title}</a>
        </h3>
        {article.description && variant === "feature" && (
          <p className="article-card__desc">{article.description}</p>
        )}
        <p className="article-card__meta">{article.readTime}</p>
      </div>
    </article>
  );
}
