import { useEffect, useRef } from 'react';
import { client } from '@inc/AxiosInterceptor.js';

export default function useAutosave(state, nanoid, dispatch, options = {}) {
  const saveTimerRef = useRef(null);
  const saveControllerRef = useRef(null);
  const DEBOUNCE_MS = options.debounceMs ?? 800;

  useEffect(() => {
    if (!state || state.loading || !state.hasChanges) return;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      if (saveControllerRef.current && typeof saveControllerRef.current.abort === 'function') {
        saveControllerRef.current.abort();
      }

      const controller = new AbortController();
      saveControllerRef.current = controller;

      client
        .post('/sheets', { sheet: state.__flattened ? state.__flattened : state.sheet || state }, { signal: controller.signal, params: { nanoid } })
        .then(() => {
          dispatch({ type: 'resetDirty' });
        })
        .catch((err) => {
          const name = err && err.name;
          const message = err && err.message;
          if (name === 'CanceledError' || (message && message.toLowerCase().includes('canceled'))) {
            // expected when aborting previous requests
          } else {
            // keep error handling minimal here; component-level logging will catch more
            console.error('Autosave error:', err);
          }
        })
        .finally(() => {
          saveControllerRef.current = null;
        });

      saveTimerRef.current = null;
    }, DEBOUNCE_MS);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };
  }, [state, nanoid, dispatch, DEBOUNCE_MS]);
}

