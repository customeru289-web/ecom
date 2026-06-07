import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiFilter, FiX } from 'react-icons/fi';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import Pagination from '../components/common/Pagination';
import { ProductGridSkeleton } from '../components/common/Skeletons';
import useDebounce from '../hooks/useDebounce';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'latest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') || '';

  const [searchInput, setSearchInput] = useState(keyword);
  const debouncedSearch = useDebounce(searchInput);

  useEffect(() => {
    categoryAPI.getAll().then(({ data }) => setCategories(data.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    if (debouncedSearch !== keyword) {
      const params = new URLSearchParams(searchParams);
      if (debouncedSearch) params.set('keyword', debouncedSearch);
      else params.delete('keyword');
      params.delete('page');
      setSearchParams(params);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    setLoading(true);
    productAPI.getAll({
      keyword, category, sort, minPrice, maxPrice, rating, page, limit: 12,
    })
      .then(({ data }) => {
        setProducts(data.products);
        setPages(data.pages);
        setTotal(data.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [keyword, category, sort, minPrice, maxPrice, rating, page]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    setSearchParams(params);
    setPage(1);
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-2 block">Search</label>
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search products..."
          className="input-field"
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Category</label>
        <select value={category} onChange={(e) => updateFilter('category', e.target.value)} className="input-field">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Price Range</label>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} className="input-field" />
          <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} className="input-field" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Min Rating</label>
        <select value={rating} onChange={(e) => updateFilter('rating', e.target.value)} className="input-field">
          <option value="">Any Rating</option>
          {[4, 3, 2, 1].map((r) => <option key={r} value={r}>{r}+ Stars</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Sort By</label>
        <select value={sort} onChange={(e) => updateFilter('sort', e.target.value)} className="input-field">
          <option value="latest">Latest</option>
          <option value="popular">Popular</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      <Helmet><title>Shop | Luxora</title></Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="section-title">Shop Collection</h1>
          <p className="text-zinc-500 mt-2">{total} products found</p>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="glass-card p-6 sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setFiltersOpen(true)} className="lg:hidden btn-secondary text-sm py-2 px-4">
                <FiFilter className="w-4 h-4" /> Filters
              </button>
              <select
                value={sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="input-field w-auto text-sm py-2"
              >
                <option value="latest">Latest</option>
                <option value="popular">Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {loading ? (
              <ProductGridSkeleton />
            ) : products.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <p className="text-zinc-500">No products found. Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {products.map((product, i) => (
                    <ProductCard key={product._id} product={product} index={i} />
                  ))}
                </div>
                <Pagination page={page} pages={pages} onPageChange={setPage} />
              </>
            )}
          </div>
        </div>
      </div>

      {filtersOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full glass p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setFiltersOpen(false)}><FiX className="w-5 h-5" /></button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}
    </>
  );
};

export default Shop;
