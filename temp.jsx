
    const { useState, useEffect, useRef, useMemo, useCallback } = React;

    // Custom SVGs for Lucide Icons
    const LucideIcon = {
      MapPin: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      Flame: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
        </svg>
      ),
      Map: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
          <line x1="9" y1="3" x2="9" y2="18"/>
          <line x1="15" y1="6" x2="15" y2="21"/>
        </svg>
      ),
      Layers: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <polygon points="12 2 2 7 12 12 22 7 12 2"/>
          <polygon points="2 17 12 22 22 17"/>
          <polygon points="2 12 12 17 22 12"/>
        </svg>
      ),
      X: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      ),
      List: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <line x1="8" y1="6" x2="21" y2="6"/>
          <line x1="8" y1="12" x2="21" y2="12"/>
          <line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/>
          <line x1="3" y1="12" x2="3.01" y2="12"/>
          <line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
      ),
      FileText: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
          <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
          <path d="M10 9H8"/>
          <path d="M16 13H8"/>
          <path d="M16 17H8"/>
        </svg>
      ),
      Truck: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <rect x="1" y="3" width="15" height="13"/>
          <polygon points="16 8 20 8 23 11 23 16 16 16"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      ),
      Search: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      ),
      Clock: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      AlertTriangle: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
      Zap: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      ),
      ChevronRight: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      ),
      UserCheck: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <polyline points="16 11 18 13 22 9"/>
        </svg>
      ),
      Volume2: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
      ),
      VolumeX: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
      ),
      Sliders: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
          <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
          <line x1="2" y1="14" x2="6" y2="14"/>
          <line x1="10" y1="8" x2="14" y2="8"/>
          <line x1="18" y1="16" x2="22" y2="16"/>
        </svg>
      ),
      Activity: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
      Droplet: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z"/>
        </svg>
      ),
      Wind: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59-2.41A2 2 0 1 1 14 9H2m15.59-1.41A2 2 0 1 1 19 11H2"/>
        </svg>
      )
    };

    function Icon({ name, className }) {
      const Component = LucideIcon[name] || LucideIcon.MapPin;
      return <Component className={className} />;
    }

    // Config Mapping & Translations
    const SEVERITY_ORDER = ['Critical', 'High', 'Medium', 'Low'];
    const SEVERITY_COLORS = {
      Critical: {
        map: '#ef4444',
        bg: 'bg-red-500/10 dark:bg-red-500/20',
        text: 'text-red-700 dark:text-red-400',
        border: 'border-red-500/20 dark:border-red-500/30',
        dot: 'bg-red-500',
        label: 'Critical'
      },
      High: {
        map: '#f97316',
        bg: 'bg-orange-500/10 dark:bg-orange-500/20',
        text: 'text-orange-700 dark:text-orange-400',
        border: 'border-orange-500/20 dark:border-orange-500/30',
        dot: 'bg-orange-500',
        label: 'High'
      },
      Medium: {
        map: '#eab308',
        bg: 'bg-yellow-500/10 dark:bg-yellow-500/20',
        text: 'text-yellow-700 dark:text-yellow-400',
        border: 'border-yellow-500/20 dark:border-yellow-500/30',
        dot: 'bg-yellow-500',
        label: 'Medium'
      },
      Low: {
        map: '#10b981',
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-500/20 dark:border-emerald-500/30',
        dot: 'bg-emerald-500',
        label: 'Low'
      },
      Unclassified: {
        map: '#6b7280',
        bg: 'bg-slate-500/10 dark:bg-slate-500/20',
        text: 'text-slate-700 dark:text-slate-400',
        border: 'border-slate-500/20 dark:border-slate-500/30',
        dot: 'bg-slate-500',
        label: 'Unclassified'
      },
      unclassified: {
        map: '#6b7280',
        bg: 'bg-slate-500/10 dark:bg-slate-500/20',
        text: 'text-slate-700 dark:text-slate-400',
        border: 'border-slate-500/20 dark:border-slate-500/30',
        dot: 'bg-slate-500',
        label: 'Unclassified'
      }
    };

    const STATUS_CONFIG = {
      new: { label: 'New', bg: 'bg-blue-500/10 dark:bg-blue-500/20', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-500/20 dark:border-blue-500/30', icon: 'AlertTriangle' },
      pending_review: { label: 'Pending Review', bg: 'bg-amber-500/10 dark:bg-amber-500/20', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-500/20 dark:border-amber-500/30', icon: 'Clock' },
      dispatched: { label: 'Dispatched', bg: 'bg-rose-500/10 dark:bg-rose-500/20', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-500/20 dark:border-rose-500/30', icon: 'Truck' },
      resolved: { label: 'Resolved', bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-500/20 dark:border-emerald-500/30', icon: 'UserCheck' }
    };

    const TYPE_ICONS = {
      'fire': 'Flame',
      'road accident': 'AlertTriangle',
      'medical emergency': 'Activity',
      'flooding': 'Droplet',
      'gas leak': 'Wind',
      'accident': 'AlertTriangle',
      'medical': 'Activity',
      'flood': 'Droplet'
    };

    // Helper functions
    function beep() {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 880; gain.gain.value = 0.08;
        osc.start(); osc.stop(ctx.currentTime + 0.15);
      } catch (e) {}
    }

    function siren() {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.5);
        osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 1.0);
        
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
        
        osc.start();
        osc.stop(ctx.currentTime + 1.5);
      } catch (e) {}
    }

    function timeAgo(iso) {
      if (!iso) return "just now";
      const date = new Date(iso.endsWith('Z') ? iso : iso + 'Z');
      const seconds = Math.floor((new Date() - date) / 1000);
      if (seconds < 60) return "just now";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }

    function mapIncident(raw) {
      return {
        ...raw,
        lat: raw.latitude,
        lon: raw.longitude,
        type: raw.incident_type,
      };
    }

    // App State Management (React Context)
    const AppContext = React.createContext();
    function useApp() { return React.useContext(AppContext); }

    function AppProvider({ children }) {
      const [state, setState] = useState({
        incidents: [],
        selectedIncidentId: null,
        mapView: { center: [12.9716, 77.5946], zoom: 12, fitted: false }, // Bengaluru coordinates
        clusteringEnabled: true,
        heatmapEnabled: false,
        sidebarOpen: true,
        activeTab: 'list',
        connected: false,
        searchTerm: '',
        severityFilter: 'all',
        auditLogs: [],
        toasts: [],
        soundEnabled: true,
        sosMode: false,
        appView: 'landing', // 'landing' or 'dashboard'
      });

      // Fetch initial incidents and audit logs
      const fetchAuditLogs = useCallback(async () => {
        try {
          const res = await fetch("/audit-log?limit=100");
          if (res.ok) {
            const logs = await res.json();
            const mappedLogs = logs.map(l => ({ ...l, details_json: l.detail }));
            setState(prev => ({ ...prev, auditLogs: mappedLogs }));
          }
        } catch (e) {
          console.error("Audit log error:", e);
        }
      }, []);

      const pushToast = useCallback((incident) => {
        const id = `${incident.id}-${Date.now()}`;
        setState(prev => ({
          ...prev,
          toasts: [...prev.toasts.slice(-4), { id, severity: incident.severity || 'Unclassified', message: `[${(incident.incident_type||'').replace('_',' ').toUpperCase()}] ${incident.description}` }]
        }));
        setTimeout(() => {
          setState(prev => ({ ...prev, toasts: prev.toasts.filter(t => t.id !== id) }));
        }, 6000);
      }, []);

      const applyIncidents = useCallback((incoming) => {
        setState(prev => {
          const oldIds = new Set(prev.incidents.map(i => i.id));
          incoming.forEach(inc => {
            if (!oldIds.has(inc.id)) {
              // Toast for all new incidents; beep only for Critical/High
              pushToast(inc);
              if (prev.soundEnabled && (inc.severity === 'Critical' || inc.severity === 'High')) beep();
            }
          });
          return { ...prev, incidents: incoming };
        });
      }, [pushToast]);

      useEffect(() => {
        // Initial load
        fetch("/incidents")
          .then(r => r.json())
          .then(applyIncidents)
          .catch(e => console.error("Incidents load error:", e));

        fetchAuditLogs();

        // WS Connection
        let ws;
        function connect() {
          const proto = window.location.protocol === "https:" ? "wss" : "ws";
          ws = new WebSocket(`${proto}://${window.location.host}/ws`);
          ws.onopen = () => setState(prev => ({ ...prev, connected: true }));
          ws.onclose = () => {
            setState(prev => ({ ...prev, connected: false }));
            setTimeout(connect, 3000);
          };
          ws.onmessage = (event) => {
            try {
              const msg = JSON.parse(event.data);
              if (msg.type === 'INCIDENT_UPDATE') {
                applyIncidents(msg.data);
              } else if (msg.type === 'SOS_TRIGGER') {
                // Broadcast received from ANY device!
                setState(prev => {
                  if (prev.soundEnabled) siren();
                  return { ...prev, sosMode: true };
                });
                setTimeout(() => setState(prev => ({ ...prev, sosMode: false })), 3000);
                
                // Add the new SOS incident immediately
                setState(prev => {
                  if (prev.incidents.some(i => i.id === msg.incident.id)) return prev;
                  return { ...prev, incidents: [msg.incident, ...prev.incidents] };
                });
              } else if (Array.isArray(msg)) {
                applyIncidents(msg);
              }
            } catch (e) {
              console.error("WS parsing error:", e);
            }
          };
        }
        connect();

        // Poll audit logs
        const interval = setInterval(fetchAuditLogs, 5000);

        return () => {
          if (ws) ws.close();
          clearInterval(interval);
        };
      }, [fetchAuditLogs, applyIncidents]);

      // Computed context values
      const contextValue = useMemo(() => {
        const filtered = state.incidents
          .filter(inc => {
            if (state.severityFilter !== 'all') {
              const sev = inc.severity || 'unclassified';
              return sev.toLowerCase() === state.severityFilter.toLowerCase();
            }
            return true;
          })
          .filter(inc => {
            if (!state.searchTerm) return true;
            const term = state.searchTerm.toLowerCase();
            return (
              inc.description.toLowerCase().includes(term) ||
              inc.incident_type.toLowerCase().includes(term) ||
              (inc.recommended_unit || '').toLowerCase().includes(term) ||
              String(inc.id).includes(term)
            );
          });

        const kanbanColumns = {
          new: [],
          pending_review: [],
          dispatched: [],
          resolved: []
        };
        state.incidents.forEach(inc => {
          const col = inc.status || 'new';
          if (kanbanColumns[col]) {
            kanbanColumns[col].push(mapIncident(inc));
          } else {
            kanbanColumns['new'].push(mapIncident(inc));
          }
        });

        const resourceUnits = [
          { id: 'F1', name: 'Central Fire Station F1', type: 'Fire Engine', status: 'available' },
          { id: 'F2', name: 'Whitefield Fire Station F2', type: 'Fire Engine', status: 'available' },
          { id: 'F3', name: 'Jayanagar Fire Station F3', type: 'Fire Engine', status: 'available' },
          { id: 'A1', name: 'MG Road Hospital A1', type: 'Ambulance', status: 'available' },
          { id: 'A2', name: 'Electronic City Hospital A2', type: 'Ambulance', status: 'available' },
          { id: 'A3', name: 'Hebbal Hospital A3', type: 'Ambulance', status: 'available' },
          { id: 'T1', name: 'Central Traffic Unit T1', type: 'Ambulance + Traffic Response Unit', status: 'available' },
          { id: 'T2', "name": "Outer Ring Road Traffic Unit T2", "type": "Ambulance + Traffic Response Unit", status: 'available' },
          { id: 'R1', name: 'Indiranagar Rescue Station R1', type: 'NDRF-style Rescue Team', status: 'available' },
          { id: 'R2', name: 'Yeshwanthpur Rescue Station R2', type: 'NDRF-style Rescue Team', status: 'available' },
          { id: 'H1', name: 'Central Hazmat Team H1', type: 'Hazmat Team', status: 'available' },
          { id: 'H2', name: 'North Hazmat Team H2', type: 'Hazmat Team', status: 'available' }
        ].map(unit => {
          const activeDispatched = state.incidents.some(inc => 
            inc.status === 'dispatched' && inc.recommended_unit === unit.name
          );
          return {
            ...unit,
            status: activeDispatched ? 'dispatched' : 'available'
          };
        });

        return {
          state: {
            ...state,
            filteredIncidents: filtered.map(mapIncident),
            kanbanColumns,
            resourceUnits
          },
          actions: {
            selectIncident: (id) => setState(prev => ({ ...prev, selectedIncidentId: id })),
            setMapView: (view) => setState(prev => ({ ...prev, mapView: { ...prev.mapView, ...view } })),
            toggleHeatmap: () => setState(prev => ({ ...prev, heatmapEnabled: !prev.heatmapEnabled })),
            toggleCluster: () => setState(prev => ({ ...prev, clusteringEnabled: !prev.clusteringEnabled })),
            toggleSidebar: () => setState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen })),
            toggleSound: () => setState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled })),
            setFilters: (filters) => setState(prev => ({ ...prev, ...filters })),
            overrideIncident: async (id, newStatus, reason) => {
              try {
                const res = await fetch(`/incidents/${id}/override`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ new_status: newStatus, dispatcher_name: "duty_dispatcher", note: reason || '' })
                });
                if (res.ok) {
                  const updated = await res.json();
                  setState(prev => ({
                    ...prev,
                    incidents: prev.incidents.map(inc => inc.id === id ? updated.incident : inc)
                  }));
                  fetchAuditLogs();
                  return true;
                }
              } catch (e) {
                console.error("Override status error:", e);
              }
              return false;
            },
            simulateIncident: async () => {
              try {
                const res = await fetch("/incidents/simulate", { method: "POST" });
                if (res.ok) {
                  const simulated = await res.json();
                  setState(prev => {
                    if (prev.incidents.some(i => i.id === simulated.id)) return prev;
                    return { ...prev, incidents: [simulated, ...prev.incidents] };
                  });
                  return simulated;
                }
              } catch (e) {
                console.error("Simulation error:", e);
              }
              return null;
            },
            triggerSOS: async (emType = 'general') => {
              try {
                await fetch("/sos/trigger", { 
                  method: "POST", 
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ type: emType })
                });
              } catch (e) {
                console.error("SOS Trigger failed:", e);
              }
            },
            setAppView: (view) => setState(prev => ({ ...prev, appView: view })),
            fetchAuditLogs
          }
        };
      }, [state, fetchAuditLogs]);

      return (
        <AppContext.Provider value={contextValue}>
          {children}
        </AppContext.Provider>
      );
    }

    // --- Live Clock Hook ---
    function useClock() {
      const [now, setNow] = useState(new Date());
      useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
      }, []);
      return now;
    }

    // --- Incidents/min Rate Hook ---
    function useIncidentRate(incidents) {
      return useMemo(() => {
        const cutoff = Date.now() - 60000;
        const recent = incidents.filter(i => {
          const ts = new Date(i.created_at && !i.created_at.endsWith('Z') ? i.created_at + 'Z' : i.created_at).getTime();
          return ts >= cutoff;
        }).length;
        return recent;
      }, [incidents]);
    }

    function Header() {
      const { state, actions } = useApp();
      const searchRef = useRef(null);

      useEffect(() => {
        const handleKeyDown = (e) => {
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (searchRef.current) searchRef.current.focus();
          }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
      }, []);

      const now = useClock();
      const rate = useIncidentRate(state.incidents);
      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

      return (
        <header className={`flex items-center justify-between px-5 border-b border-white/5 backdrop-blur-xl z-30 transition-colors duration-300 ${state.sosMode ? 'bg-red-950/90' : 'bg-slate-950/80'}`} style={{height:'60px',flexShrink:0}}>
          {state.sosMode && (
            <div className="fixed inset-0 pointer-events-none z-[9999] animate-pulse bg-red-500/20 mix-blend-overlay"></div>
          )}
          {/* Left: Logo + Status */}
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-orange-400 to-amber-300 flex items-center gap-2">
              <span className="text-xl animate-float">🚨</span> ERAAS
            </h1>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${state.connected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${state.connected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
              {state.connected ? 'Live' : 'Offline'}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="stat-count">{rate}</span>/min
            </span>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-xs mx-4 relative">
            <Icon name="Search" className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search incidents... (Ctrl+K)"
              value={state.searchTerm}
              onChange={(e) => actions.setFilters({ searchTerm: e.target.value })}
              className="w-full pl-9 pr-4 py-1.5 bg-white/5 border border-white/5 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>

          {/* Right: Clock + Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => actions.triggerSOS()}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-red-600 animate-pulse border-2 border-red-400 shadow-[0_0_15px_rgba(220,38,38,0.8)] hover:scale-110 transition-transform sm:mr-2"
              title="EMERGENCY PANIC BUTTON"
            >
              <Icon name="AlertTriangle" className="w-4 h-4 text-white" />
            </button>
            <div className="hidden md:flex flex-col items-end leading-none">
              <span className="font-mono text-sm font-bold text-white tracking-wider tabular-nums">{timeStr}</span>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">{dateStr}</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-white/10" />
            <button onClick={() => actions.toggleSound()} className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-all" title={state.soundEnabled ? 'Mute' : 'Unmute'}>
              <Icon name={state.soundEnabled ? 'Volume2' : 'VolumeX'} className="w-4 h-4" />
            </button>
            <button onClick={() => actions.simulateIncident()} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-xs rounded-lg hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
              <Icon name="Plus" className="w-3.5 h-3.5" />
              Simulate
            </button>
          </div>
        </header>
      );
    }

    // --- StatsBar ---
    function StatsBar() {
      const { state, actions } = useApp();

      const counts = useMemo(() => {
        const total = state.incidents.length;
        const critical = state.incidents.filter(i => (i.severity||'').toLowerCase() === 'critical').length;
        const high = state.incidents.filter(i => (i.severity||'').toLowerCase() === 'high').length;
        const medium = state.incidents.filter(i => (i.severity||'').toLowerCase() === 'medium').length;
        const low = state.incidents.filter(i => (i.severity||'').toLowerCase() === 'low').length;
        const dispatched = state.incidents.filter(i => i.status === 'dispatched').length;
        const resolved = state.incidents.filter(i => i.status === 'resolved').length;
        return { total, critical, high, medium, low, dispatched, resolved };
      }, [state.incidents]);

      return (
        <div className="flex items-center justify-between px-5 border-b border-white/5 text-xs overflow-x-auto gap-4 bg-slate-950/60" style={{height:'44px',flexShrink:0}}>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500 uppercase text-[9px] tracking-widest mr-1">FILTER</span>
            {[
              { id: 'all', label: 'All', count: counts.total, cls: 'border-slate-700 text-slate-300 bg-slate-900/60 hover:bg-slate-800' },
              { id: 'Critical', label: 'Critical', count: counts.critical, cls: 'border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10' },
              { id: 'High', label: 'High', count: counts.high, cls: 'border-orange-500/30 text-orange-400 bg-orange-500/5 hover:bg-orange-500/10' },
              { id: 'Medium', label: 'Medium', count: counts.medium, cls: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/5 hover:bg-yellow-500/10' },
              { id: 'Low', label: 'Low', count: counts.low, cls: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10' },
            ].map(chip => (
              <button
                key={chip.id}
                onClick={() => actions.setFilters({ severityFilter: chip.id })}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-semibold transition-all ${chip.cls} ${state.severityFilter === chip.id ? 'ring-1 ring-indigo-500 ring-offset-1 ring-offset-slate-950' : ''}`}
              >
                {chip.label} <span className="stat-count bg-black/20 px-1 rounded-full text-[9px]">{chip.count}</span>
              </button>
            ))}
          </div>
          {/* Right: dispatch/resolved stats */}
          <div className="hidden sm:flex items-center gap-4 text-[10px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span className="stat-count text-rose-400 font-bold">{counts.dispatched}</span> dispatched
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="stat-count text-emerald-400 font-bold">{counts.resolved}</span> resolved
            </span>
          </div>
        </div>
      );
    }

    // --- IncidentModal ---
    function IncidentModal() {
      const { state, actions } = useApp();
      const [note, setNote] = useState('');
      const [overrideStatus, setOverrideStatus] = useState('pending_review');

      const selectedIncident = useMemo(() => {
        return state.incidents.find(i => i.id === state.selectedIncidentId);
      }, [state.incidents, state.selectedIncidentId]);

      // MUST be before early return — React Rules of Hooks
      useEffect(() => {
        if (selectedIncident) {
          setOverrideStatus(selectedIncident.status);
          setNote('');
        }
      }, [selectedIncident]);

      // Suppress Leaflet map z-index while modal is open — MUST be before early return
      useEffect(() => {
        if (selectedIncident) {
          document.body.classList.add('modal-open');
        } else {
          document.body.classList.remove('modal-open');
        }
        return () => document.body.classList.remove('modal-open');
      }, [selectedIncident]);

      if (!selectedIncident) return null;

      const sev = SEVERITY_COLORS[selectedIncident.severity] || SEVERITY_COLORS.unclassified;
      const st = STATUS_CONFIG[selectedIncident.status] || { label: selectedIncident.status, bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20', icon: 'AlertTriangle' };

      const handleOverrideSubmit = async (e) => {
        e.preventDefault();
        const success = await actions.overrideIncident(selectedIncident.id, overrideStatus, note);
        if (success) actions.selectIncident(null);
      };

      return (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in"
          style={{ zIndex: 10000 }}
        >
          <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-slate-800/40">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-500">#{selectedIncident.id}</span>
                <h3 className="font-bold text-sm text-white capitalize">{selectedIncident.incident_type}</h3>
              </div>
              <button onClick={() => actions.selectIncident(null)} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
                <Icon name="X" className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="flex gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${sev.bg} ${sev.text} ${sev.border}`}>
                  {selectedIncident.severity.toUpperCase()}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${st.bg} ${st.text} ${st.border}`}>
                  {st.label}
                </span>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Description</h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-white/5">{selectedIncident.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Location Coordinates</h4>
                  <p className="font-mono text-xs text-slate-300">{selectedIncident.latitude.toFixed(6)}, {selectedIncident.longitude.toFixed(6)}</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">ETA / Recommended Unit</h4>
                  <p className="text-xs text-slate-300">
                    {selectedIncident.recommended_unit || 'Awaiting Allocation'} {selectedIncident.eta_minutes ? `(${selectedIncident.eta_minutes} mins)` : ''}
                  </p>
                </div>
              </div>

              {selectedIncident.reasoning && (
                <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 mb-1">
                    <Icon name="Zap" className="w-3.5 h-3.5" />
                    <span>AI Agent Reasoning</span>
                  </div>
                  <p className="text-xs text-indigo-200/90 italic leading-relaxed">"{selectedIncident.reasoning}"</p>
                </div>
              )}

              <form onSubmit={handleOverrideSubmit} className="border-t border-white/5 pt-4 space-y-3">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Icon name="UserCheck" className="w-3.5 h-3.5" />
                  <span>Dispatcher Override (Human-in-the-loop)</span>
                </h4>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'pending_review', label: 'Review' },
                    { id: 'dispatched', label: 'Dispatch' },
                    { id: 'resolved', label: 'Resolve' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setOverrideStatus(opt.id)}
                      className={`py-1.5 text-xs font-medium rounded-lg border transition ${overrideStatus === opt.id ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/10' : 'bg-slate-800/40 text-slate-300 border-white/5 hover:bg-slate-800'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Enter manual override reasoning/notes..."
                    className="w-full p-2 text-xs bg-slate-950/40 border border-white/5 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    rows={2}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => actions.selectIncident(null)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-lg shadow-indigo-500/10"
                  >
                    Apply Override
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }

    // --- CommandPalette ---
    function CommandPalette() {
      const { state, actions } = useApp();
      const [isOpen, setIsOpen] = useState(false);
      const [input, setInput] = useState('');
      const inputRef = useRef(null);

      useEffect(() => {
        const handleKeyDown = (e) => {
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
            e.preventDefault();
            setIsOpen(prev => !prev);
          }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
      }, []);

      useEffect(() => {
        if (isOpen) {
          if (inputRef.current) inputRef.current.focus();
          setInput('');
        }
      }, [isOpen]);

      if (!isOpen) return null;

      const commands = [
        { name: 'Simulate Incident', desc: '/simulate', icon: 'Plus', action: () => actions.simulateIncident() },
        { name: 'Toggle Alert Sound', desc: '/sound', icon: 'Volume2', action: () => actions.toggleSound() },
        { name: 'Toggle Clustering', desc: '/cluster', icon: 'Layers', action: () => actions.toggleCluster() },
        { name: 'Toggle Heatmap', desc: '/heatmap', icon: 'Flame', action: () => actions.toggleHeatmap() },
        { name: 'View List Tab', desc: '/tab list', icon: 'List', action: () => actions.setFilters({ activeTab: 'list' }) },
        { name: 'View Board Tab', desc: '/tab board', icon: 'Layers', action: () => actions.setFilters({ activeTab: 'kanban' }) },
        { name: 'View Audit Log', desc: '/tab audit', icon: 'FileText', action: () => actions.setFilters({ activeTab: 'audit' }) },
        { name: 'View Resources', desc: '/tab resources', icon: 'Truck', action: () => actions.setFilters({ activeTab: 'resources' }) },
      ];

      const filteredCommands = commands.filter(c => 
        c.name.toLowerCase().includes(input.toLowerCase()) || 
        c.desc.toLowerCase().includes(input.toLowerCase())
      );

      const handleCommandClick = (action) => {
        action();
        setIsOpen(false);
      };

      return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[15vh] bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-slate-950/20">
              <Icon name="Sliders" className="w-4 h-4 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type command or search shortcuts... (Ctrl+P)"
                value={input}
                onChange={e => setInput(e.target.value)}
                className="w-full bg-transparent text-white placeholder-slate-500 text-xs focus:outline-none"
              />
              <kbd className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-white/5 font-mono">ESC</kbd>
            </div>

            <div className="max-h-[260px] overflow-y-auto p-2 space-y-0.5">
              {filteredCommands.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">No commands found</div>
              ) : (
                filteredCommands.map(cmd => (
                  <button
                    key={cmd.name}
                    onClick={() => handleCommandClick(cmd.action)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon name={cmd.icon} className="w-3.5 h-3.5 text-slate-400" />
                      <span>{cmd.name}</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">{cmd.desc}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      );
    }

    // --- Toasts ---
    function Toasts() {
      const { state } = useApp();
      return (
        <div className="fixed bottom-10 right-4 z-[9998] flex flex-col gap-2 pointer-events-none">
          {state.toasts.map(toast => {
            const sev = SEVERITY_COLORS[toast.severity] || SEVERITY_COLORS.unclassified;
            return (
              <div
                key={toast.id}
                className={`pointer-events-auto flex items-start gap-3 p-3 pr-4 rounded-xl border shadow-2xl backdrop-blur-md max-w-[300px] animate-in`}
                style={{ background: 'rgba(15,23,42,0.95)', borderColor: 'rgba(255,255,255,0.08)', animationDuration: '300ms' }}
              >
                <div className={`p-1.5 rounded-lg flex-shrink-0 ${sev.bg} ${sev.text}`}>
                  <Icon name="AlertTriangle" className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${sev.text}`}>{toast.severity || 'NEW'}</span>
                  <p className="text-[11px] text-slate-200 leading-normal mt-0.5 line-clamp-2">{toast.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // --- Live Activity Ticker ---
    function ActivityTicker() {
      const { state } = useApp();
      const recentItems = useMemo(() => {
        const items = state.incidents
          .filter(i => i.severity && i.status !== 'resolved')
          .slice(0, 30)
          .map(i => ({ id: i.id, type: (i.incident_type || 'incident').toUpperCase(), severity: i.severity, unit: i.recommended_unit, status: i.status }));
        // Duplicate for seamless loop
        return [...items, ...items];
      }, [state.incidents]);

      if (recentItems.length === 0) return null;

      const sevColor = { Critical: 'text-red-400', High: 'text-orange-400', Medium: 'text-yellow-400', Low: 'text-emerald-400' };

      return (
        <div className="ticker-wrap">
          <span className="flex-shrink-0 px-3 text-[9px] font-bold uppercase tracking-widest text-indigo-400 border-r border-white/10 mr-3" style={{lineHeight:'28px'}}>● LIVE</span>
          <div className="ticker-track">
            {recentItems.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-2 text-[10px]">
                <span className={`font-bold ${sevColor[item.severity] || 'text-slate-400'}`}>[{(item.severity || '').toUpperCase()}]</span>
                <span className="text-slate-300">{item.type}</span>
                {item.unit && <span className="text-slate-500">→ {item.unit}</span>}
                <span className="text-slate-600 mx-2">•</span>
              </span>
            ))}
          </div>
        </div>
      );
    }

    // --- MapPanel (Leaflet Map) ---
    function MapPanel() {
      const { state, actions } = useApp();
      const mapRef = useRef(null);
      const mapInstanceRef = useRef(null);
      const markersRef = useRef({});
      const clusterGroupRef = useRef(null);
      const heatLayerRef = useRef(null);
      const initRef = useRef(false);

      useEffect(() => {
        if (initRef.current) return;
        initRef.current = true;

        // Initialize Map centered on Bengaluru
        const map = L.map(mapRef.current).setView(state.mapView.center, state.mapView.zoom);
        mapInstanceRef.current = map;

        // Dark mode map tiles — CartoDB Dark Matter, fallback to inverted OSM
        const darkTiles = L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          { attribution: '&copy; OpenStreetMap &copy; CARTO', subdomains: 'abcd', maxZoom: 19 }
        );
        const osmInverted = L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          { attribution: '&copy; OpenStreetMap contributors', className: 'map-tiles-dark' }
        );
        // Try CartoDB first; if tiles fail to load, show inverted OSM
        darkTiles.on('tileerror', () => {
          if (map.hasLayer(darkTiles)) {
            map.removeLayer(darkTiles);
            osmInverted.addTo(map);
          }
        });
        darkTiles.addTo(map);

        clusterGroupRef.current = L.markerClusterGroup ? L.markerClusterGroup({
          showCoverageOnHover: false,
          maxClusterRadius: 40
        }) : L.featureGroup();
        
        heatLayerRef.current = L.heatLayer ? L.heatLayer([], {
          radius: 25,
          blur: 15,
          maxZoom: 15
        }) : L.layerGroup();

        map.addLayer(clusterGroupRef.current);
        map.addLayer(heatLayerRef.current);

        // Cleanup
        return () => { map.remove(); initRef.current = false; };
      }, []);

      // Update markers when incidents or clustering/heatmap toggles change
      useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        const clusterGroup = clusterGroupRef.current;
        const heatLayer = heatLayerRef.current;
        const clustering = state.clusteringEnabled;
        const heatmap = state.heatmapEnabled;

        // Clear existing layers
        clusterGroup.clearLayers();
        heatLayer.setLatLngs([]);
        if (map.hasLayer(clusterGroup)) map.removeLayer(clusterGroup);
        if (map.hasLayer(heatLayer)) map.removeLayer(heatLayer);

        // Build data
        const heatPoints = [];
        state.filteredIncidents.forEach(inc => {
          const sev = inc.severity || 'Unclassified';
          const color = SEVERITY_COLORS[sev].map;
          const isCritical = sev === 'Critical';
          const isSelected = inc.id === state.selectedIncidentId;

          const iconHtml = `
            <div class="custom-marker ${sev.toLowerCase()} ${isSelected ? 'selected' : ''}" style="background:${color};">
              ${isCritical ? '<div class="pulse-ring" style="position:absolute;inset:-6px;border-radius:50%;border:2px solid currentColor;opacity:0.6;"></div>' : ''}
            </div>
          `;

          const marker = L.marker([inc.lat, inc.lon], {
            icon: L.divIcon({ className: '', html: iconHtml, iconSize: [28, 28], iconAnchor: [14, 14] }),
            severity: sev,
            id: inc.id
          }).bindPopup(`
            <div style="min-width:200px; padding: 4px;">
              <strong style="color:${color}; font-size:13px;">${inc.type.toUpperCase()}</strong><br>
              <small style="color:#cbd5e1; font-size:11px;">${inc.description.slice(0,100)}...</small><br>
              <span class="badge ${SEVERITY_COLORS[sev].bg} ${SEVERITY_COLORS[sev].text} mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-bold border border-white/5">${sev}</span>
              ${inc.recommended_unit ? `<br><small style="color:#94a3b8; font-size:10px;">Unit: ${inc.recommended_unit}</small>` : ''}
              ${inc.eta_minutes ? `<br><small style="color:#94a3b8; font-size:10px;">ETA: ~${inc.eta_minutes}min</small>` : ''}
            </div>
          `);

          // Click handler
          marker.on('click', () => {
            actions.selectIncident(inc.id);
            actions.setMapView({ center: [inc.lat, inc.lon], zoom: 15 });
          });

          if (clustering) clusterGroup.addLayer(marker);
          else marker.addTo(map);

          markersRef.current[inc.id] = marker;
          heatPoints.push([inc.lat, inc.lon, sev === 'Critical' ? 1.0 : sev === 'High' ? 0.7 : sev === 'Medium' ? 0.4 : 0.2]);
        });

        // Add active layer
        if (clustering) map.addLayer(clusterGroup);
        if (heatmap) { heatLayer.setLatLngs(heatPoints); map.addLayer(heatLayer); }

        // Fit bounds on first load or when incidents change significantly
        if (state.filteredIncidents.length > 0 && !state.mapView.fitted) {
          const group = clustering ? clusterGroup : L.featureGroup(Object.values(markersRef.current));
          if (group.getLayers().length) map.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 14 });
          actions.setMapView({ ...state.mapView, fitted: true });
        }
      }, [state.filteredIncidents, state.clusteringEnabled, state.heatmapEnabled, state.selectedIncidentId, actions]);

      // Sync map view changes back to state
      useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;
        const handler = () => actions.setMapView({ center: map.getCenter(), zoom: map.getZoom(), fitted: true });
        map.on('moveend', handler);
        return () => map.off('moveend', handler);
      }, [actions]);

      // Mobile: Full screen map, sidebar as sheet
      const isMobile = window.innerWidth < 1024;

      return (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          <div ref={mapRef} id="map" style={{ position: 'absolute', inset: 0 }} />
          
          {/* Map Controls Overlay */}
          <div className="absolute top-4 left-4 right-4 flex flex-col gap-2 sm:flex-row sm:justify-between pointer-events-none z-10">
            <div className="flex gap-2 pointer-events-auto">
              <button className="btn-secondary btn-icon p-2 rounded-lg glass" onClick={() => actions.toggleHeatmap()} aria-pressed={state.heatmapEnabled} aria-label="Toggle Heatmap">
                <Icon name={state.heatmapEnabled ? 'Flame' : 'Map'} className="w-5 h-5" />
              </button>
              <button className="btn-secondary btn-icon p-2 rounded-lg glass" onClick={() => actions.toggleCluster()} aria-pressed={state.clusteringEnabled} aria-label="Toggle Clustering">
                <Icon name={state.clusteringEnabled ? 'Layers' : 'MapPin'} className="w-5 h-5" />
              </button>
              <button className="btn-secondary btn-icon p-2 rounded-lg glass" onClick={() => { const map = mapInstanceRef.current; if (map) map.locate({ setView: true, maxZoom: 16 }); }} aria-label="Locate Me">
                <Icon name="MapPin" className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-2 pointer-events-auto">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full glass text-muted">
                <span className={`w-2 h-2 rounded-full ${state.connected ? 'bg-green-500' : 'bg-red-500'}`} />
                {state.connected ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 pointer-events-auto z-10">
            <div className="card glass p-3 rounded-lg shadow-lg min-w-[180px] animate-in">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Severity Legend</p>
              <div className="flex flex-col gap-1.5">
                {SEVERITY_ORDER.map(sev => {
                  const c = SEVERITY_COLORS[sev];
                  return (
                    <div key={sev} className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${c.dot} ${sev === 'Critical' ? 'animate-pulse-ring' : ''}`} />
                      <span className="text-xs font-medium text-slate-300">{c.label}</span>
                    </div>
                  );
                })}
                <div className="flex items-center gap-2 border-t border-white/5 pt-1.5 mt-1">
                  <span className="w-3 h-3 rounded-full bg-slate-500" />
                  <span className="text-xs font-medium text-slate-400">Unclassified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Sidebar Trigger */}
          {isMobile && state.sidebarOpen && (
            <div className="absolute inset-0 bg-black/50 z-20" onClick={() => actions.toggleSidebar()} aria-hidden="true" />
          )}
        </div>
      );
    }

    // --- Side Panel (List / Kanban / Audit / Resources) ---
    function SidePanel() {
      const { state, actions } = useApp();
      const isMobile = window.innerWidth < 1024;

      const tabs = [
        { id: 'list', label: 'Incidents', icon: 'List' },
        { id: 'kanban', label: 'Board', icon: 'Layers' },
        { id: 'audit', label: 'Audit Log', icon: 'FileText' },
        { id: 'resources', label: 'Resources', icon: 'Truck' }
      ];

      return (
        <aside className="side-panel">
          {/* Mobile Header */}
          {isMobile && (
            <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/80 backdrop-blur sticky top-0 z-10">
              <h2 className="font-semibold text-sm">Incidents</h2>
              <button className="btn-ghost btn-icon p-2" onClick={() => actions.toggleSidebar()} aria-label="Close sidebar"><Icon name="X" className="w-5 h-5" /></button>
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-white/5 bg-slate-950/70 backdrop-blur sticky top-0 z-10">
            {tabs.map(t => (
              <button
                key={t.id}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-3 text-[11px] font-semibold transition-colors border-b-2 ${state.activeTab === t.id ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-slate-500 hover:text-slate-200'}`}
                onClick={() => actions.setFilters({ activeTab: t.id })}
              >
                <Icon name={t.icon} className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {state.activeTab === 'list' && <IncidentList />}
            {state.activeTab === 'kanban' && <KanbanBoard />}
            {state.activeTab === 'audit' && <AuditLogView />}
            {state.activeTab === 'resources' && <ResourceTracker />}
          </div>
        </aside>
      );
    }

    // --- Incident List ---
    function IncidentList() {
      const { state, actions } = useApp();
      const listRef = useRef(null);

      // Virtualized-ish rendering for performance
      const visibleIncidents = state.filteredIncidents.slice(0, 200);

      return (
        <div className="flex-1 overflow-y-auto p-3 space-y-2" ref={listRef} role="list" aria-label="Incidents">
          {state.filteredIncidents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500 p-8 text-center">
              <Icon name="Search" className="w-10 h-10 mb-3 opacity-30 text-slate-400" />
              <p className="text-xs">No incidents match current filters</p>
            </div>
          ) : (
            visibleIncidents.map((inc, i) => (
              <IncidentCard key={inc.id} incident={inc} index={i} isList={true} />
            ))
          )}
          {state.filteredIncidents.length > 200 && (
            <div className="text-center text-[10px] text-slate-500 py-3 border-t border-white/5">Showing 200 of {state.filteredIncidents.length} incidents. Refine filters to see more.</div>
          )}
        </div>
      );
    }

    // --- Incident Card (Unified for List, Kanban, Mobile) ---
    function IncidentCard({ incident, index = 0, isList = false, isKanban = false }) {
      const { state, actions } = useApp();
      const sev = SEVERITY_COLORS[incident.severity] || SEVERITY_COLORS.unclassified;
      const st = STATUS_CONFIG[incident.status] || { label: incident.status, bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20', icon: 'AlertTriangle' };
      const isSelected = incident.id === state.selectedIncidentId;
      const isNew = incident.status === 'new' && !incident.severity;
      const IconComp = LucideIcon[TYPE_ICONS[incident.type]] || LucideIcon.MapPin;

      const handleClick = () => {
        actions.selectIncident(incident.id);
        actions.setMapView({ center: [incident.lat, incident.lon], zoom: 15 });
      };

      const handleOverride = (e, newStatus) => {
        e.stopPropagation();
        actions.overrideIncident(incident.id, newStatus, `Manual override via ${isKanban ? 'board' : 'list'}: ${STATUS_CONFIG[newStatus].label}`);
      };

      return (
        <article
          className={`card relative overflow-hidden transition-all duration-200 animate-in stagger-${(index % 4) + 1} ${isSelected ? 'ring-1 ring-rose-500 border-white/10' : 'border-white/5'} ${isNew ? 'bg-rose-500/5' : ''} ${isKanban ? 'cursor-grab bg-slate-900/60 p-3' : 'cursor-pointer'}`}
          data-incident-id={incident.id}
          onClick={isKanban ? undefined : handleClick}
          onDoubleClick={isKanban ? handleClick : undefined}
          role="listitem"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
        >
          {/* Severity Badge */}
          <div className="absolute top-3 right-3 z-10">
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${sev.bg} ${sev.text} ${sev.border} shadow-sm flex items-center`}>
              <span className={`badge-dot ${sev.dot} ${incident.severity === 'Critical' ? 'pulse-ring' : ''}`}></span>
              {sev.label}
            </span>
          </div>

          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                <span className={`p-1 rounded-lg ${sev.bg} ${sev.text}`}><IconComp className="w-3.5 h-3.5" /></span>
                <h4 className="font-semibold text-xs truncate max-w-[120px] text-white">{incident.type.replace('_', ' ').toUpperCase()}</h4>
                <span className={`px-1.5 py-0.25 rounded text-[9px] font-bold border flex items-center ${st.bg} ${st.text} ${st.border}`}><Icon name={st.icon} className="w-2.5 h-2.5 mr-0.5" />{st.label}</span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 pr-4">{incident.description}</p>
            </div>
            <div className="flex flex-col items-end gap-1 text-right min-w-[70px]">
              <time className="text-[10px] text-slate-500" dateTime={incident.created_at}>{timeAgo(incident.created_at)}</time>
              <span className="text-[9px] font-mono text-slate-500">#{incident.id}</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px] mb-2.5">
            <div className="flex items-center gap-1.5 text-slate-400 col-span-2">
              <Icon name="MapPin" className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span className="font-mono truncate">{incident.lat.toFixed(5)}, {incident.lon.toFixed(5)}</span>
            </div>
            {incident.recommended_unit && (
              <div className="flex items-center gap-1.5 text-slate-400 col-span-2">
                <Icon name="Truck" className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span className="font-mono truncate text-slate-300">{incident.recommended_unit}</span>
              </div>
            )}
            {incident.eta_minutes ? (
              <div className="flex items-center gap-1.5 text-slate-400">
                <Icon name="Clock" className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span>~{incident.eta_minutes}min</span>
              </div>
            ) : null}
            {incident.priority ? (
              <div className="flex items-center gap-1.5 text-slate-400">
                <Icon name="AlertTriangle" className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span>P{incident.priority}</span>
              </div>
            ) : null}
          </div>

          {/* AI Reasoning Expander — stopPropagation prevents map pan + modal open */}
          {incident.reasoning && (
            <details className="group mb-2.5" onClick={e => e.stopPropagation()}>
              <summary className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer list-none select-none p-1.5 rounded bg-slate-900/40 hover:bg-slate-900/80 transition">
                <Icon name="Zap" className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span>AI Reasoning</span>
                <Icon name="ChevronRight" className="w-3.5 h-3.5 transition-transform group-open:rotate-90 flex-shrink-0 ml-auto" />
              </summary>
              <div className="p-2 mt-1 bg-slate-950/40 rounded border border-white/5 animate-in">
                <p className="text-[10px] text-slate-400 leading-normal italic">"{incident.reasoning}"</p>
              </div>
            </details>
          )}

          {/* Override Actions (List View Only) */}
          {!isKanban && (
            <div className="flex gap-1.5 pt-2 border-t border-white/5">
              {['pending_review', 'dispatched', 'resolved'].filter(s => s !== incident.status).map(nextStatus => (
                <button key={nextStatus} className="flex-1 btn-secondary text-[10px] py-1 px-2 hover:text-white" onClick={e => handleOverride(e, nextStatus)}>
                  <Icon name={STATUS_CONFIG[nextStatus].icon} className="w-3 h-3" />
                  {STATUS_CONFIG[nextStatus].label}
                </button>
              ))}
            </div>
          )}
        </article>
      );
    }

    // --- Kanban Board ---
    function KanbanBoard() {
      const { state, actions } = useApp();
      const columnsRef = useRef({});
      const STATUS_ORDER = ['new', 'pending_review', 'dispatched', 'resolved'];

      useEffect(() => {
        STATUS_ORDER.forEach(status => {
          const el = columnsRef.current[status];
          if (el && !el._sortable) {
            el._sortable = new Sortable(el, {
              group: 'kanban', animation: 150, ghostClass: 'sortable-ghost', dragClass: 'dragging',
              onEnd: async (evt) => {
                const incId = Number(evt.item.dataset.incidentId);
                const newStatus = evt.to.dataset.status;
                const inc = state.incidents.find(i => i.id === incId);
                if (inc && inc.status !== newStatus) {
                  await actions.overrideIncident(incId, newStatus, `Drag-drop to ${STATUS_CONFIG[newStatus].label}`);
                }
              }
            });
          }
        });
      }, [state.kanbanColumns, actions, state.incidents]);

      return (
        <div className="flex-1 overflow-auto p-4 bg-slate-950/20">
          <div className="kanban-board">
            {STATUS_ORDER.map(status => {
              const incidents = state.kanbanColumns[status] || [];
              const st = STATUS_CONFIG[status];
              return (
                <div key={status} className="kanban-col" role="list" aria-label={`${st.label} column`}>
                  <div className="kanban-col-header">
                    <div className="flex items-center gap-1.5 text-xs text-white">
                      <Icon name={st.icon} className={`w-3.5 h-3.5 ${st.text}`} />
                      <span className="capitalize">{st.label}</span>
                    </div>
                    <span className="bg-slate-900 border border-white/5 text-slate-400 font-bold px-1.5 py-0.25 rounded text-[10px]">{incidents.length}</span>
                  </div>
                  <div className="kanban-col-content" ref={el => columnsRef.current[status] = el} data-status={status} id={`column-${status}`}>
                    {incidents.length === 0 ? (
                      <div className="text-center text-slate-500 text-[10px] py-6 border border-dashed border-white/5 rounded-lg">Drop incidents here</div>
                    ) : (
                      incidents.map((inc, i) => <IncidentCard key={inc.id} incident={inc} index={i} isKanban={true} />)
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // --- Audit Log View ---
    function AuditLogView() {
      const { state } = useApp();
      return (
        <div className="flex-1 overflow-auto p-3">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left" role="table">
              <thead className="sticky top-0 bg-slate-900/90 backdrop-blur-md border-b border-white/5">
                <tr>
                  <th className="px-3 py-2 font-semibold text-slate-400 text-[10px] uppercase tracking-wider">Time</th>
                  <th className="px-3 py-2 font-semibold text-slate-400 text-[10px] uppercase tracking-wider">Incident</th>
                  <th className="px-3 py-2 font-semibold text-slate-400 text-[10px] uppercase tracking-wider">Actor</th>
                  <th className="px-3 py-2 font-semibold text-slate-400 text-[10px] uppercase tracking-wider">Action</th>
                  <th className="px-3 py-2 font-semibold text-slate-400 text-[10px] uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {state.auditLogs.length === 0 ? (
                  <tr><td colSpan={5} className="px-3 py-8 text-center text-slate-500">No audit logs available</td></tr>
                ) : (
                  state.auditLogs.map(log => {
                    const isHuman = log.actor.includes('dispatcher') || log.actor.includes('human');
                    return (
                      <tr key={log.id} className="hover:bg-slate-900/40 transition">
                        <td className="px-3 py-2 text-slate-500 font-mono text-[10px]">{timeAgo(log.timestamp)}</td>
                        <td className="px-3 py-2 font-mono text-rose-400 text-[10px]">#{log.incident_id}</td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.25 rounded text-[9px] font-bold ${isHuman ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                            <Icon name={isHuman ? 'UserCheck' : 'Zap'} className="w-2.5 h-2.5" />
                            {isHuman ? 'Human' : 'Agent'}
                          </span>
                        </td>
                        <td className="px-3 py-2 font-medium text-slate-300 text-[10px]">{log.action.replace('_', ' ')}</td>
                        <td className="px-3 py-2 text-slate-400 font-mono text-[10px] max-w-[120px] truncate" title={log.details_json}>{log.details_json}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // --- Resource Tracker ---
    function ResourceTracker() {
      const { state } = useApp();
      return (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xs text-white">Active Dispatch Units</h3>
            <span className="bg-slate-900 border border-white/5 text-slate-400 font-bold px-1.5 py-0.25 rounded text-[10px]">{state.resourceUnits.length}</span>
          </div>
          <div className="space-y-2" role="list">
            {state.resourceUnits.map(unit => (
              <article key={unit.id} className="unit-card" role="listitem">
                <span className={`unit-status ${unit.status}`} aria-label={`Unit ${unit.status}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs text-white">{unit.name}</p>
                  <p className="text-[10px] text-slate-500">{unit.type} • <span className="capitalize">{unit.status}</span></p>
                </div>
                <span className="text-[9px] font-mono text-slate-500">#{unit.id}</span>
              </article>
            ))}
          </div>
        </div>
      );
    }

        

    // --- Civilian Landing Page ---
    function LandingPage() {
      const { actions } = useApp();
      const [justTriggered, setJustTriggered] = useState(false);

      const handleSOS = (type) => {
        actions.triggerSOS(type);
        setJustTriggered(true);
        setTimeout(() => setJustTriggered(false), 4000);
      };

      if (justTriggered) {
        return (
          <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-red-950/80 animate-pulse text-center p-8">
            <Icon name="AlertTriangle" className="w-32 h-32 text-red-500 mb-8 animate-bounce" />
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">EMERGENCY SIGNAL SENT</h1>
            <p className="text-xl md:text-2xl text-red-200">Help is on the way. Please stay calm and remain in a safe location.</p>
          </div>
        );
      }

      return (
        <div className="flex-1 flex flex-col min-h-screen bg-[#030712] relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900/80 to-[#030712] pointer-events-none"></div>
          
          {/* Top Bar */}
          <div className="relative z-10 flex justify-between items-center p-6 w-full max-w-6xl mx-auto">
            <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-orange-400 to-amber-300 flex items-center gap-2">
              <span className="text-2xl animate-float">🚨</span> ERAAS
            </h1>
            <button 
              onClick={() => actions.setAppView('dashboard')}
              className="text-xs font-semibold text-slate-400 hover:text-white px-4 py-2 rounded-full border border-white/5 hover:bg-white/10 transition"
            >
              Dispatcher Login →
            </button>
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto p-6 pt-0">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-xl">Civilian Emergency Portal</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">Tap the button that matches your emergency. This will immediately dispatch the nearest available response unit to your location.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
              <button 
                onClick={() => handleSOS('fire')}
                className="group relative flex flex-col items-center justify-center p-10 rounded-3xl bg-red-500/10 border-2 border-red-500/30 hover:bg-red-500 hover:border-red-400 transition-all shadow-[0_0_40px_rgba(239,68,68,0.1)] hover:shadow-[0_0_60px_rgba(239,68,68,0.4)] hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-red-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Icon name="Flame" className="w-16 h-16 text-red-500 group-hover:text-white mb-4 relative z-10 transition-colors" />
                <span className="text-2xl font-bold text-red-400 group-hover:text-white relative z-10 transition-colors uppercase tracking-widest">Fire</span>
              </button>

              <button 
                onClick={() => handleSOS('accident')}
                className="group relative flex flex-col items-center justify-center p-10 rounded-3xl bg-orange-500/10 border-2 border-orange-500/30 hover:bg-orange-500 hover:border-orange-400 transition-all shadow-[0_0_40px_rgba(249,115,22,0.1)] hover:shadow-[0_0_60px_rgba(249,115,22,0.4)] hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-orange-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Icon name="AlertTriangle" className="w-16 h-16 text-orange-500 group-hover:text-white mb-4 relative z-10 transition-colors" />
                <span className="text-2xl font-bold text-orange-400 group-hover:text-white relative z-10 transition-colors uppercase tracking-widest">Accident</span>
              </button>

              <button 
                onClick={() => handleSOS('medical')}
                className="group relative flex flex-col items-center justify-center p-10 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/30 hover:bg-emerald-500 hover:border-emerald-400 transition-all shadow-[0_0_40px_rgba(16,185,129,0.1)] hover:shadow-[0_0_60px_rgba(16,185,129,0.4)] hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Icon name="Activity" className="w-16 h-16 text-emerald-500 group-hover:text-white mb-4 relative z-10 transition-colors" />
                <span className="text-2xl font-bold text-emerald-400 group-hover:text-white relative z-10 transition-colors uppercase tracking-widest">Medical</span>
              </button>

              <button 
                onClick={() => handleSOS('general')}
                className="group relative flex flex-col items-center justify-center p-10 rounded-3xl bg-slate-500/10 border-2 border-slate-500/30 hover:bg-slate-500 hover:border-slate-400 transition-all shadow-[0_0_40px_rgba(100,116,139,0.1)] hover:shadow-[0_0_60px_rgba(100,116,139,0.4)] hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Icon name="Zap" className="w-16 h-16 text-slate-400 group-hover:text-white mb-4 relative z-10 transition-colors" />
                <span className="text-2xl font-bold text-slate-400 group-hover:text-white relative z-10 transition-colors uppercase tracking-widest">Other / Panic</span>
              </button>
            </div>
            
            <p className="mt-12 text-xs text-slate-600 uppercase tracking-widest font-semibold">For Demo / Development Purposes Only</p>
          </div>
        </div>
      );
    }

    // --- Main App Layout ---
    function AppLayout() {
      const { state, actions } = useApp();

      if (state.appView === 'landing') {
        return (
          <React.Fragment>
            <LandingPage />
            <Toasts />
          </React.Fragment>
        );
      }

      return (
        <div className="app-shell">
          <Header />
          <StatsBar />
          <div className="main-grid">
            <div className="map-panel-wrap">
              <MapPanel />
            </div>
            <div
              className="gutter"
              role="separator"
              aria-label="Resize panels"
              tabIndex={0}
              onMouseDown={e => {
                e.preventDefault();
                document.body.classList.add('resizing');
                const startX = e.clientX;
                const sidebarEl = document.querySelector('.side-panel');
                const startW = sidebarEl ? sidebarEl.offsetWidth : 400;
                const move = (moveEvent) => {
                  const delta = startX - moveEvent.clientX;
                  const newW = Math.min(Math.max(startW + delta, 300), 600);
                  const gridEl = document.querySelector('.main-grid');
                  if (gridEl) gridEl.style.gridTemplateColumns = `1fr 4px ${newW}px`;
                };
                const up = () => {
                  document.body.classList.remove('resizing');
                  document.removeEventListener('mousemove', move);
                  document.removeEventListener('mouseup', up);
                };
                document.addEventListener('mousemove', move);
                document.addEventListener('mouseup', up);
              }}
            />
            <SidePanel />
          </div>
          <IncidentModal />
          <CommandPalette />
          <Toasts />
          <ActivityTicker />
        </div>
      );
    }

    // --- Root ---
    function App() {
      return (
        <AppProvider>
          <AppLayout />
        </AppProvider>
      );
    }

    // Hydrate
    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  