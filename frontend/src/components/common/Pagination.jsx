import { Link } from 'react-router-dom';

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const getPages = () => {
    const items = [];
    const max = 5;
    let start = Math.max(1, page - Math.floor(max / 2));
    let end = Math.min(pages, start + max - 1);
    if (end - start < max - 1) start = Math.max(1, end - max + 1);

    for (let i = start; i <= end; i++) items.push(i);
    return items;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="btn-secondary px-4 py-2 text-sm disabled:opacity-40"
      >
        Prev
      </button>
      {getPages().map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
            p === page
              ? 'bg-gold-500 text-zinc-900'
              : 'glass hover:bg-white/90 dark:hover:bg-zinc-800/90'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
        className="btn-secondary px-4 py-2 text-sm disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
