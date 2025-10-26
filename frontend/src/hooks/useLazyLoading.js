import { useState, useEffect } from 'react';

// Hook untuk lazy loading dengan skeleton
export const useLazyLoading = (fetchFunction, dependencies = [], delay = 800) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate minimum loading time untuk skeleton effect
        const [result] = await Promise.all([
          fetchFunction(),
          new Promise(resolve => setTimeout(resolve, delay))
        ]);
        
        setData(result);
      } catch (err) {
        setError(err);
        console.error('Lazy loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, dependencies);

  return { data, loading, error, refetch: () => loadData() };
};

// Hook untuk infinite scroll lazy loading
export const useInfiniteLoading = (fetchFunction, itemsPerPage = 12) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const result = await fetchFunction(page, itemsPerPage);
      
      if (result && result.length > 0) {
        setItems(prev => [...prev, ...result]);
        setPage(prev => prev + 1);
        
        // Check if we have more items
        if (result.length < itemsPerPage) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Infinite loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setLoading(false);
  };

  return {
    items,
    loading,
    hasMore,
    loadMore,
    reset
  };
};

// Hook untuk lazy loading dengan intersection observer
export const useIntersectionLoading = (fetchFunction, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [elementRef, setElementRef] = useState(null);

  useEffect(() => {
    if (!elementRef) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !loading && !data) {
          setLoading(true);
          try {
            const result = await fetchFunction();
            setData(result);
          } catch (error) {
            console.error('Intersection loading error:', error);
          } finally {
            setLoading(false);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(elementRef);

    return () => {
      if (elementRef) {
        observer.unobserve(elementRef);
      }
    };
  }, [elementRef, loading, data, fetchFunction]);

  return { data, loading, setElementRef };
};

export default useLazyLoading;
