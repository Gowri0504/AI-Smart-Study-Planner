'use client'

import { useState, useEffect } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { format, subDays, startOfDay } from "date-fns";
import { Tooltip } from 'react-tooltip'
import { Activity, Loader2 } from "lucide-react";

export function ActivityHeatmap() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      const res = await fetch("/api/activity");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  const startDate = subDays(startOfDay(today), 365);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
        <Loader2 className="animate-spin text-emerald-500 mb-4" size={32} />
        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Heatmap Graph Data</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-xl">
            <Activity size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Neural Consistency</h3>
            <p className="text-sm text-slate-500">Your study heatmap over the last 365 days</p>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-4 custom-heatmap">
        <div className="min-w-[800px]">
          <CalendarHeatmap
            startDate={startDate}
            endDate={today}
            values={data}
            classForValue={((value: any) => {
              if (!value || value.count === 0) {
                return 'color-empty';
              }
              // Scale classes based on "hours" (or count weight)
              if (value.count < 2) return 'color-scale-1'; // Light active
              if (value.count < 4) return 'color-scale-2'; // Moderate
              if (value.count < 6) return 'color-scale-3'; // Heavy
              return 'color-scale-4'; // Intense
            }) as any}
            tooltipDataAttrs={((value: any) => {
              if (!value || !value.date) {
                return null;
              }
              return {
                'data-tooltip-id': 'heatmap-tooltip',
                'data-tooltip-content': `${value.count === 0 ? 'No' : value.count} hours studied on ${format(new Date(value.date), 'MMM do, yyyy')}`,
              };
            }) as any}
            showWeekdayLabels={true}
          />
          <Tooltip id="heatmap-tooltip" />
        </div>
      </div>
    </div>
  );
}
