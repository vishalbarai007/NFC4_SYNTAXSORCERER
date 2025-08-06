import { useState, useEffect, useCallback } from 'react';
import userFileService from '../services/userFileService';

export const useUserFiles = (options = {}) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);

  const fetchFiles = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      setError(null);

      const fetchOptions = {
        ...options,
        lastDoc: reset ? null : lastDoc
      };

      const result = await userFileService.getUserFiles(fetchOptions);

      if (result.success) {
        if (reset) {
          setFiles(result.data);
        } else {
          setFiles(prev => [...prev, ...result.data]);
        }
        setHasMore(result.hasMore);
        setLastDoc(result.lastDoc);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [options, lastDoc]);

  const refreshFiles = useCallback(() => {
    setLastDoc(null);
    fetchFiles(true);
  }, [fetchFiles]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchFiles(false);
    }
  }, [loading, hasMore, fetchFiles]);

  const deleteFile = useCallback(async (fileId) => {
    try {
      const result = await userFileService.deleteFile(fileId);
      if (result.success) {
        setFiles(prev => prev.filter(file => file.id !== fileId));
      }
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const updateFile = useCallback(async (fileId, updateData) => {
    try {
      const result = await userFileService.updateFileInfo(fileId, updateData);
      if (result.success) {
        setFiles(prev => prev.map(file => 
          file.id === fileId ? { ...file, ...updateData } : file
        ));
      }
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  useEffect(() => {
    fetchFiles(true);
  }, []);

  return {
    files,
    loading,
    error,
    hasMore,
    refreshFiles,
    loadMore,
    deleteFile,
    updateFile
  };
};

export const useUserFileStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await userFileService.getUserFileStats();

      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats
  };
};

export const useFileSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const searchFiles = useCallback(async (searchTerm, options = {}) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      setSearchError(null);

      const result = await userFileService.searchFiles(searchTerm, options);

      if (result.success) {
        setSearchResults(result.data);
      } else {
        setSearchError(result.error);
        setSearchResults([]);
      }
    } catch (err) {
      setSearchError(err.message);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setSearchError(null);
  }, []);

  return {
    searchResults,
    searching,
    searchError,
    searchFiles,
    clearSearch
  };
};

export const useRealtimeFiles = (options = {}) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = userFileService.subscribeToFiles(
      (result) => {
        if (result.success) {
          setFiles(result.data);
          setError(null);
        } else {
          setError(result.error);
        }
        setLoading(false);
      },
      options
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  return {
    files,
    loading,
    error
  };
};
