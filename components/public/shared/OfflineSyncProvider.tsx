'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { apiFetch, QueuedRequest, getApiBaseUrl } from '@/lib/api/client';
import { CloudLightning, Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

export function OfflineSyncProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [queueCount, setQueueCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync state with localstorage queue count
  const updateQueueCount = useCallback(() => {
    if (typeof window !== 'undefined') {
      const queueJson = localStorage.getItem('sfg_offline_submissions');
      const queue: QueuedRequest[] = queueJson ? JSON.parse(queueJson) : [];
      setQueueCount(queue.length);
    }
  }, []);

  // Flush queued requests in sequence
  const flushQueue = useCallback(async () => {
    if (typeof window === 'undefined' || isSyncing) return;
    
    const queueJson = localStorage.getItem('sfg_offline_submissions');
    const queue: QueuedRequest[] = queueJson ? JSON.parse(queueJson) : [];
    
    if (queue.length === 0) return;

    setIsSyncing(true);
    let successCount = 0;
    const remainingQueue: QueuedRequest[] = [];

    // Attempt to flush each request
    for (const req of queue) {
      try {
        const baseUrl = getApiBaseUrl();
        
        // Use normal fetch so we do not trigger the interceptor again
        const res = await fetch(`${baseUrl}${req.path}`, {
          method: req.method,
          headers: {
            'Content-Type': 'application/json',
            ...req.headers,
          },
          body: req.body,
        });

        if (res.ok) {
          successCount++;
          // Trigger a beautiful success toast for each successful sync
          toast({
            title: `Sync Complete: ${req.formName}`,
            description: `Your saved ${req.formName.toLowerCase()} has been uploaded successfully.`,
            variant: 'default',
          });
        } else {
          // If the server explicitly rejected the input (e.g. 400 Bad Request),
          // we do not want to keep retrying a bad payload forever (poison pill).
          if (res.status >= 400 && res.status < 500) {
            console.error(`Offline sync discarded invalid payload (${res.status}) for ${req.formName}`);
            // Let's discard this bad payload but log it
            continue;
          }
          // Server error or rate-limit, keep in queue
          remainingQueue.push(req);
        }
      } catch (err) {
        console.error('Failed to sync offline item:', err);
        // Network still down or server unreachable, keep the rest of the queue
        remainingQueue.push(req);
      }
    }

    // Save remaining items back to queue
    localStorage.setItem('sfg_offline_submissions', JSON.stringify(remainingQueue));
    setQueueCount(remainingQueue.length);
    setIsSyncing(false);

    if (successCount > 0) {
      toast({
        title: 'Synchronization Finished',
        description: `Successfully uploaded ${successCount} queued form${successCount > 1 ? 's' : ''}.`,
      });
    }
  }, [isSyncing]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize states
    setIsOnline(navigator.onLine);
    updateQueueCount();

    // Event listeners for network connectivity changes
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: 'Back Online',
        description: 'Network connection restored. Syncing offline changes...',
        variant: 'default',
      });
      flushQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: 'Connection Lost',
        description: 'You are currently offline. Forms will be queued securely.',
        variant: 'destructive',
      });
    };

    // Listener for custom queuing event triggered by apiFetch
    const handleQueued = (e: Event) => {
      updateQueueCount();
      const customEvent = e as CustomEvent<QueuedRequest>;
      const req = customEvent.detail;
      
      toast({
        title: 'Form Saved (Offline)',
        description: `Your ${req.formName.toLowerCase()} has been stored on your device and will be sent automatically when online.`,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('sfg-offline-queued', handleQueued);

    // Initial check/flush on mount
    if (navigator.onLine) {
      flushQueue();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('sfg-offline-queued', handleQueued);
    };
  }, [flushQueue, updateQueueCount]);

  return (
    <>
      {children}

      {/* Floating Network & Sync Dashboard Status Indicator */}
      {queueCount > 0 && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 rounded-full bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl border border-slate-800 animate-fade-in md:px-5 md:py-3 md:text-sm">
          {isSyncing ? (
            <RefreshCw className="h-4 w-4 animate-spin text-amber-500 shrink-0" />
          ) : isOnline ? (
            <Wifi className="h-4 w-4 text-emerald-400 shrink-0 animate-pulse" />
          ) : (
            <WifiOff className="h-4 w-4 text-amber-400 shrink-0" />
          )}

          <span className="max-w-[180px] truncate">
            {isSyncing
              ? `Syncing ${queueCount} request${queueCount > 1 ? 's' : ''}...`
              : !isOnline
              ? `${queueCount} request${queueCount > 1 ? 's' : ''} queued offline`
              : `${queueCount} pending request${queueCount > 1 ? 's' : ''} ready`}
          </span>

          {isOnline && !isSyncing && (
            <button
              onClick={flushQueue}
              className="ml-1 rounded-md bg-brand-primary px-2 py-1 text-[10px] font-bold text-white uppercase tracking-wider hover:bg-brand-primary/80 transition-all shrink-0 active:scale-95"
            >
              Sync Now
            </button>
          )}
        </div>
      )}
    </>
  );
}
