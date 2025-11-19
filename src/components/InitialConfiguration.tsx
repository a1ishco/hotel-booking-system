import { useEffect, useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { countries, boardTypes } from '../data/constants';
import { validateBookingState } from '../utils/validation';

export default function InitialConfiguration() {
    const { state, updateCitizenship, updateStartDate, updateNumberOfDays, updateDestinationCountry, updateBoardType, initializeDailySelections } = useBooking();
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Loop validation
    useEffect(() => {
        if (state.startDate && state.numberOfDays > 0) {
            const selections = [];
            const [startYear, startMonth, startDay] = state.startDate.split('-').map(Number);
            const startDateUTC = Date.UTC(startYear, startMonth - 1, startDay);

            for (let i = 0; i < state.numberOfDays; i++) {
                const currentDateUTC = startDateUTC + i * 24 * 60 * 60 * 1000;
                const currentDate = new Date(currentDateUTC);

                // YYYY-MM-DD format
                const year = currentDate.getUTCFullYear();
                const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
                const day = String(currentDate.getUTCDate()).padStart(2, '0');
                const dateString = `${year}-${month}-${day}`;

                selections.push({
                    day: i + 1,
                    date: dateString,
                    hotelId: null,
                    lunchId: null,
                    dinnerId: null,
                });
            }

            // Loop validation control
            const needsUpdate =
                state.dailySelections.length !== selections.length ||
                selections.some((sel, idx) => {
                    const existing = state.dailySelections[idx];
                    return !existing || existing.date !== sel.date || existing.day !== sel.day;
                });

            if (needsUpdate) {
                initializeDailySelections(selections);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.startDate, state.numberOfDays]);

    useEffect(() => {
        const validationErrors = validateBookingState(state);
        setErrors(validationErrors as Record<string, string>);
    }, [state]);

    return (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Step 1: Initial Configuration</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Citizenship */}
                <div>
                    <label htmlFor="citizenship" className="block text-sm font-medium text-gray-700 mb-2">
                        Citizenship <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="citizenship"
                        value={state.citizenship || ''}
                        onChange={(e) => updateCitizenship(Number(e.target.value))}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.citizenship ? 'border-red-500' : 'border-gray-300'
                            }`}
                        required
                    >
                        <option value="">Select your country</option>
                        {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                    {errors.citizenship && (
                        <p className="mt-1 text-sm text-red-600">{errors.citizenship}</p>
                    )}
                </div>

                {/* Start Date */}
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        value={state.startDate}
                        onChange={(e) => updateStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.startDate ? 'border-red-500' : 'border-gray-300'
                            }`}
                        required
                    />
                    {errors.startDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                    )}
                </div>

                {/* Number of Days */}
                <div>
                    <label htmlFor="numberOfDays" className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Days <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        id="numberOfDays"
                        value={state.numberOfDays || ''}
                        onChange={(e) => updateNumberOfDays(Number(e.target.value))}
                        min="1"
                        max="30"
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.numberOfDays ? 'border-red-500' : 'border-gray-300'
                            }`}
                        required
                    />
                    {errors.numberOfDays && (
                        <p className="mt-1 text-sm text-red-600">{errors.numberOfDays}</p>
                    )}
                </div>

                {/* Destination */}
                <div>
                    <label htmlFor="destinationCountry" className="block text-sm font-medium text-gray-700 mb-2">
                        Destination Country <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="destinationCountry"
                        value={state.destinationCountry || ''}
                        onChange={(e) => updateDestinationCountry(Number(e.target.value))}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.destinationCountry ? 'border-red-500' : 'border-gray-300'
                            }`}
                        required
                    >
                        <option value="">Select destination</option>
                        {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                    {errors.destinationCountry && (
                        <p className="mt-1 text-sm text-red-600">{errors.destinationCountry}</p>
                    )}
                </div>
            </div>

            {/* Board type */}
            <div className="mt-4 sm:mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Board Type <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                    {boardTypes.map((boardType) => (
                        <label
                            key={boardType.code}
                            className="flex items-center space-x-2 cursor-pointer p-3 border-2 rounded-lg transition-colors hover:bg-gray-50 flex-1 sm:flex-none min-w-0"
                            style={{
                                borderColor: state.boardType === boardType.code ? '#3b82f6' : '#e5e7eb',
                                backgroundColor: state.boardType === boardType.code ? '#eff6ff' : 'transparent',
                            }}
                        >
                            <input
                                type="radio"
                                name="boardType"
                                value={boardType.code}
                                checked={state.boardType === boardType.code}
                                onChange={(e) => updateBoardType(e.target.value as 'FB' | 'HB' | 'NB')}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                                required
                            />
                            <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                                {boardType.code} - {boardType.name}
                            </span>
                        </label>
                    ))}
                </div>
                {errors.boardType && (
                    <p className="mt-1 text-sm text-red-600">{errors.boardType}</p>
                )}
            </div>
        </div>
    );
}

