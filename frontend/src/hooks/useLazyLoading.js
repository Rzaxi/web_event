import React, { useState, useEffect } from 'react';

// Hook untuk lazy loading dengan skeleton
export const useLazyLoading = (fetchFunction, dependencies = [], delay = 800) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Convert dependencies to string to avoid array reference issues
  const depsString = JSON.stringify(dependencies);

  useEffect(() => {
    let isMounted = true;
    let timeoutId = null;
    
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch data first
        const result = await fetchFunction();
        
        if (isMounted) {
          // Apply minimum delay for skeleton effect
          timeoutId = setTimeout(() => {
            if (isMounted) {
              setData(result);
              setLoading(false);
            }
          }, delay);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
          console.error('Lazy loading error:', err);
        }
      }
    };

    loadData();
    
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [depsString, delay]); // Remove fetchFunction from dependencies to prevent infinite loops

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
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
