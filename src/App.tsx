import { useEffect, useRef, Suspense, lazy } from "react";
import { BookingProvider, useBooking } from "./context/BookingContext";
import Loading from "./components/ui/Loading";

const Header = lazy(() => import("./components/Header"));
const HeroSearch = lazy(() => import("./components/HeroSearch"));
const DailyConfiguration = lazy(() => import("./components/DailyConfiguration"));
const SummaryAndPricing = lazy(() => import("./components/SummaryAndPricing"));
const PopularDestinations = lazy(() => import("./components/PopularDestinations"));

function AppContent() {
  const { state } = useBooking();
  const dailyConfigRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);

  const shouldShowDailyConfig =
    state.destinationCountry &&
    state.boardType &&
    state.startDate &&
    state.numberOfDays > 0 &&
    state.citizenship &&
    state.dailySelections.length > 0;

  useEffect(() => {
    if (shouldShowDailyConfig && dailyConfigRef.current && !hasScrolledRef.current) {
      const timeoutId = setTimeout(() => {
        if (dailyConfigRef.current) {
          const rect = dailyConfigRef.current.getBoundingClientRect();
          if (rect.height > 0) {
            dailyConfigRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
            hasScrolledRef.current = true;
          }
        }
      }, 200);

      return () => clearTimeout(timeoutId);
    }

    if (!shouldShowDailyConfig) {
      hasScrolledRef.current = false;
    }
  }, [shouldShowDailyConfig]);

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <HeroSearch />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="space-y-4 sm:space-y-6">
            <div ref={dailyConfigRef}>
              <DailyConfiguration />
            </div>
            <SummaryAndPricing />
          </div>
        </div>
        <PopularDestinations />
      </div>
    </Suspense>
  );
}

function App() {
  return (
    <BookingProvider>
      <AppContent />
    </BookingProvider>
  );
}

export default App;
