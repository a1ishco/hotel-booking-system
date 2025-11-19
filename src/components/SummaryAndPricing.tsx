import { useBooking } from "../context/BookingContext";
import { hotels, meals, countries, boardTypes } from "../data/constants";
import type { PriceBreakdown } from "../types";

export default function SummaryAndPricing() {
  // Custom hook context
  const { state } = useBooking();

  if (
    !state.destinationCountry ||
    !state.boardType ||
    state.dailySelections.length === 0
  ) {
    return null;
  }

  const citizenshipName =
    countries.find((c) => c.id === state.citizenship)?.name || "Not selected";
  const destinationCountryName =
    countries.find((c) => c.id === state.destinationCountry)?.name || "";
  const boardTypeName =
    boardTypes.find((bt) => bt.code === state.boardType)?.name || "";
  const availableHotels = hotels[destinationCountryName] || [];
  const availableMeals = meals[destinationCountryName] || {
    lunch: [],
    dinner: [],
  };

  // Price breakdown
  const calculatePriceBreakdown = (): PriceBreakdown[] => {
    return state.dailySelections.map((selection) => {
      const hotel = availableHotels.find((h) => h.id === selection.hotelId);
      const lunch = availableMeals.lunch.find(
        (m) => m.id === selection.lunchId
      );
      const dinner = availableMeals.dinner.find(
        (m) => m.id === selection.dinnerId
      );

      const hotelPrice = hotel?.price || 0;
      const lunchPrice = lunch?.price || 0;
      const dinnerPrice = dinner?.price || 0;
      const dayTotal = hotelPrice + lunchPrice + dinnerPrice;

      return {
        day: selection.day,
        date: selection.date,
        hotelPrice,
        lunchPrice,
        dinnerPrice,
        dayTotal,
      };
    });
  };

  const priceBreakdown = calculatePriceBreakdown();
  const grandTotal = priceBreakdown.reduce((sum, day) => sum + day.dayTotal, 0);
  const totalPriceForGuestCount = grandTotal * (state.numberOfGuests || 1);

  const formatDate = (dateString: string) => {
    // YYYY-MM-DD format
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
        Booking Summary & Pricing
      </h2>

      <div className="mb-6 sm:mb-8">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 sm:mb-4">
          Configuration Summary
        </h3>
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <span className="text-sm font-medium text-gray-600">
              Citizenship:
            </span>
            <span className="ml-2 text-gray-900">{citizenshipName}</span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-600">
              Start Date:
            </span>
            <span className="ml-2 text-gray-900">
              {state.startDate ? formatDate(state.startDate) : "Not selected"}
            </span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-600">
              Number of Days:
            </span>
            <span className="ml-2 text-gray-900">{state.numberOfDays}</span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-600">
              Number of Guests:
            </span>
            <span className="ml-2 text-gray-900">
              {state.numberOfGuests || 1}
            </span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-600">
              Destination:
            </span>
            <span className="ml-2 text-gray-900">{destinationCountryName}</span>
          </div>
          <div className="md:col-span-2">
            <span className="text-sm font-medium text-gray-600">
              Board Type:
            </span>
            <span className="ml-2 text-gray-900">{boardTypeName}</span>
          </div>
        </div>
      </div>

      {/* Daily  */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 sm:mb-4">
          Daily Selections
        </h3>
        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Day
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hotel
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lunch
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dinner
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {state.dailySelections.map((selection) => {
                const hotel = availableHotels.find(
                  (h) => h.id === selection.hotelId
                );
                const lunch = availableMeals.lunch.find(
                  (m) => m.id === selection.lunchId
                );
                const dinner = availableMeals.dinner.find(
                  (m) => m.id === selection.dinnerId
                );

                return (
                  <tr key={selection.day} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Day {selection.day}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(selection.date)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {hotel ? `${hotel.name} ($${hotel.price})` : "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {lunch ? `${lunch.name} ($${lunch.price})` : "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {dinner ? `${dinner.name} ($${dinner.price})` : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Mobile */}
        <div className="md:hidden space-y-4">
          {state.dailySelections.map((selection) => {
            const hotel = availableHotels.find(
              (h) => h.id === selection.hotelId
            );
            const lunch = availableMeals.lunch.find(
              (m) => m.id === selection.lunchId
            );
            const dinner = availableMeals.dinner.find(
              (m) => m.id === selection.dinnerId
            );

            return (
              <div
                key={selection.day}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-gray-900">
                    Day {selection.day}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(selection.date)}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs font-medium text-gray-600">
                      Hotel:{" "}
                    </span>
                    <span className="text-sm text-gray-900">
                      {hotel ? `${hotel.name} ($${hotel.price})` : "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-600">
                      Lunch:{" "}
                    </span>
                    <span className="text-sm text-gray-900">
                      {lunch ? `${lunch.name} ($${lunch.price})` : "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-600">
                      Dinner:{" "}
                    </span>
                    <span className="text-sm text-gray-900">
                      {dinner ? `${dinner.name} ($${dinner.price})` : "-"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Price table */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 sm:mb-4">
          Price Calculation
        </h3>
        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Day
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hotel Price
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lunch Price
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dinner Price
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Day Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {priceBreakdown.map((day) => (
                <tr key={day.day} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Day {day.day}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(day.date)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    ${day.hotelPrice}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    ${day.lunchPrice}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    ${day.dinnerPrice}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                    ${day.dayTotal}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100">
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-4 text-right text-sm font-medium text-gray-700"
                >
                  Subtotal (per guest):
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                  ${grandTotal}
                </td>
              </tr>
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-4 text-right text-sm font-medium text-gray-700"
                >
                  Number of Guests:
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                  {state.numberOfGuests || 1}
                </td>
              </tr>
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-4 text-right text-sm font-bold text-gray-900"
                >
                  Grand Total:
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-lg font-bold text-blue-600">
                  ${totalPriceForGuestCount}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        {/* Mobile */}
        <div className="md:hidden space-y-4">
          {priceBreakdown.map((day) => (
            <div
              key={day.day}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-gray-900">
                  Day {day.day}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(day.date)}
                </span>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-gray-600">
                    Hotel Price:
                  </span>
                  <span className="text-sm text-gray-900">
                    ${day.hotelPrice}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-gray-600">
                    Lunch Price:
                  </span>
                  <span className="text-sm text-gray-900">
                    ${day.lunchPrice}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-gray-600">
                    Dinner Price:
                  </span>
                  <span className="text-sm text-gray-900">
                    ${day.dinnerPrice}
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-300 flex justify-between">
                <span className="text-sm font-semibold text-gray-900">
                  Day Total:
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  ${day.dayTotal}
                </span>
              </div>
            </div>
          ))}
          {/* Summary (guest count * day total) */}
          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200 space-y-3 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Subtotal (per guest):
              </span>
              <span className="text-sm font-semibold text-gray-900">
                ${grandTotal}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Number of Guests:
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {state.numberOfGuests || 1}
              </span>
            </div>
            <div className="pt-2 border-t border-blue-300 flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">
                Grand Total:
              </span>
              <span className="text-lg font-bold text-blue-600">
                ${totalPriceForGuestCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
