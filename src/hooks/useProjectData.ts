import { useState, useEffect } from 'react';
import { fetchProjectData, fallbackProjectState } from '../services/projectService';
import type { ProjectStatePayload } from '../types';

export function useProjectData() {
  const [data, setData] = useState<ProjectStatePayload>(fallbackProjectState);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      const result = await fetchProjectData();
      if (isMounted) {
        setData(result.data);
        setIsLive(result.isLive);
        setError(result.error);
        setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error, isLive };
}
