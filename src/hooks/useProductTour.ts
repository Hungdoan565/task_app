import { useState, useEffect, useCallback } from "react";

const TOUR_COMPLETED_KEY = "taskflow_tour_completed";
const TOUR_SKIPPED_KEY = "taskflow_tour_skipped";

export interface TourState {
  run: boolean;
  stepIndex: number;
  tourActive: boolean;
}

export function useProductTour() {
  const [tourState, setTourState] = useState<TourState>({
    run: false,
    stepIndex: 0,
    tourActive: false,
  });

  // Check if user has completed or skipped tour
  useEffect(() => {
    const completed = localStorage.getItem(TOUR_COMPLETED_KEY);
    const skipped = localStorage.getItem(TOUR_SKIPPED_KEY);
    
    // Auto-start tour for first-time users
    if (!completed && !skipped) {
      const timer = setTimeout(() => {
        setTourState((prev) => ({ ...prev, run: true, tourActive: true }));
      }, 1000); // Delay 1s to let page load

      return () => clearTimeout(timer);
    }
  }, []);

  const startTour = useCallback(() => {
    setTourState({ run: true, stepIndex: 0, tourActive: true });
    localStorage.removeItem(TOUR_SKIPPED_KEY);
  }, []);

  const stopTour = useCallback(() => {
    setTourState((prev) => ({ ...prev, run: false, tourActive: false }));
  }, []);

  const skipTour = useCallback(() => {
    localStorage.setItem(TOUR_SKIPPED_KEY, "true");
    stopTour();
  }, [stopTour]);

  const completeTour = useCallback(() => {
    localStorage.setItem(TOUR_COMPLETED_KEY, "true");
    localStorage.removeItem(TOUR_SKIPPED_KEY);
    stopTour();
  }, [stopTour]);

  const resetTour = useCallback(() => {
    localStorage.removeItem(TOUR_COMPLETED_KEY);
    localStorage.removeItem(TOUR_SKIPPED_KEY);
    startTour();
  }, [startTour]);

  const setStepIndex = useCallback((index: number) => {
    setTourState((prev) => ({ ...prev, stepIndex: index }));
  }, []);

  return {
    tourState,
    startTour,
    stopTour,
    skipTour,
    completeTour,
    resetTour,
    setStepIndex,
  };
}

