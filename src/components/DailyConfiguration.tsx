import { useBooking } from '../context/BookingContext';
import { hotels, meals, countries } from '../data/constants';

export default function DailyConfiguration() {
    const { state, updateDailySelection } = useBooking();

    if (!state.destinationCountry || !state.boardType || state.dailySelections.length === 0) {
        return null;
    }

    const destinationCountryName = countries.find((c) => c.id === state.destinationCountry)?.name || '';
    const availableHotels = hotels[destinationCountryName] || [];
    const availableMeals = meals[destinationCountryName] || { lunch: [], dinner: [] };

    const handleHotelChange = (day: number, hotelId: number) => {
        updateDailySelection(day, { hotelId });
    };

    const handleLunchChange = (day: number, lunchId: number) => {
        // HB - lunch selection
        if (state.boardType === 'HB' && lunchId) {
            updateDailySelection(day, { lunchId, dinnerId: null });
        } else {
            updateDailySelection(day, { lunchId });
        }
    };

    const handleDinnerChange = (day: number, dinnerId: number) => {
        // HB - dinner selection
        if (state.boardType === 'HB' && dinnerId) {
            updateDailySelection(day, { dinnerId, lunchId: null });
        } else {
            updateDailySelection(day, { dinnerId });
        }
    };

    const formatDate = (dateString: string) => {
        // YYYY-MM-DD format
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(Date.UTC(year, month - 1, day));
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC'
        });
    };

    const isLunchDisabled = state.boardType === 'NB';
    const isDinnerDisabled = state.boardType === 'NB';

    return (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Multiple choices in one source</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Select hotels and meals for each day of your trip.
                {state.boardType === 'FB' && ' (Full Board: Both lunch and dinner can be selected)'}
                {state.boardType === 'HB' && ' (Half Board: Only lunch OR dinner can be selected)'}
                {state.boardType === 'NB' && ' (No Board: No meals included)'}
            </p>

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
                    {/* Otel / meal selection */}
                    <tbody className="bg-white divide-y divide-gray-200">
                        {state.dailySelections.map((selection) => {
                            const isLunchDisabledForDay = isLunchDisabled || (state.boardType === 'HB' && selection.dinnerId !== null);
                            const isDinnerDisabledForDay = isDinnerDisabled || (state.boardType === 'HB' && selection.lunchId !== null);

                            return (
                                <tr key={selection.day} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        Day {selection.day}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(selection.date)}
                                    </td>
                                    <td className="px-4 py-4 text-sm">
                                        <select
                                            value={selection.hotelId || ''}
                                            onChange={(e) => handleHotelChange(selection.day, Number(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="" disabled hidden>Select hotel</option>
                                            {availableHotels.map((hotel) => (
                                                <option key={hotel.id} value={hotel.id}>
                                                    {hotel.name} (${hotel.price})
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-4 text-sm">
                                        <select
                                            value={selection.lunchId || ''}
                                            onChange={(e) => handleLunchChange(selection.day, Number(e.target.value))}
                                            disabled={isLunchDisabledForDay}
                                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isLunchDisabledForDay ? 'bg-gray-100 cursor-not-allowed' : ''
                                                }`}
                                        >
                                            <option value="" disabled hidden>Select lunch</option>
                                            {availableMeals.lunch.map((meal) => (
                                                <option key={meal.id} value={meal.id}>
                                                    {meal.name} (${meal.price})
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-4 text-sm">
                                        <select
                                            value={selection.dinnerId || ''}
                                            onChange={(e) => handleDinnerChange(selection.day, Number(e.target.value))}
                                            disabled={isDinnerDisabledForDay}
                                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDinnerDisabledForDay ? 'bg-gray-100 cursor-not-allowed' : ''
                                                }`}
                                        >
                                            <option value="" disabled hidden>Select dinner</option>
                                            {availableMeals.dinner.map((meal) => (
                                                <option key={meal.id} value={meal.id}>
                                                    {meal.name} (${meal.price})
                                                </option>
                                            ))}
                                        </select>
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
                    const isLunchDisabledForDay = isLunchDisabled || (state.boardType === 'HB' && selection.dinnerId !== null);
                    const isDinnerDisabledForDay = isDinnerDisabled || (state.boardType === 'HB' && selection.lunchId !== null);

                    return (
                        <div key={selection.day} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm font-semibold text-gray-900">Day {selection.day}</span>
                                <span className="text-xs text-gray-500">{formatDate(selection.date)}</span>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Hotel
                                    </label>
                                    <select
                                        value={selection.hotelId || ''}
                                        onChange={(e) => handleHotelChange(selection.day, Number(e.target.value))}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="" disabled hidden>Select hotel</option>
                                        {availableHotels.map((hotel) => (
                                            <option key={hotel.id} value={hotel.id}>
                                                {hotel.name} (${hotel.price})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Lunch
                                    </label>
                                    <select
                                        value={selection.lunchId || ''}
                                        onChange={(e) => handleLunchChange(selection.day, Number(e.target.value))}
                                        disabled={isLunchDisabledForDay}
                                        className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isLunchDisabledForDay ? 'bg-gray-100 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        <option value="" disabled hidden>Select lunch</option>
                                        {availableMeals.lunch.map((meal) => (
                                            <option key={meal.id} value={meal.id}>
                                                {meal.name} (${meal.price})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Dinner
                                    </label>
                                    <select
                                        value={selection.dinnerId || ''}
                                        onChange={(e) => handleDinnerChange(selection.day, Number(e.target.value))}
                                        disabled={isDinnerDisabledForDay}
                                        className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDinnerDisabledForDay ? 'bg-gray-100 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        <option value="" disabled hidden>Select dinner</option>
                                        {availableMeals.dinner.map((meal) => (
                                            <option key={meal.id} value={meal.id}>
                                                {meal.name} (${meal.price})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

