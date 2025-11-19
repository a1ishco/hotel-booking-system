import { useEffect, useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { countries, boardTypes, citizenship } from '../data/constants';
import { validateBookingState } from '../utils/validation';
import LucideIcon from './ui/Icons';

const formatDateForDisplay = (isoDate: string) => {
    if (!isoDate) {
        return '';
    }
    const [year, month, day] = isoDate.split('-');
    if (!year || !month || !day) {
        return isoDate;
    }
    const paddedDay = day.padStart(2, '0');
    const paddedMonth = month.padStart(2, '0');
    return `${paddedDay}-${paddedMonth}-${year}`;
};

const parseDisplayDate = (value: string) => {
    const normalized = value.replace(/[-/.]/g, ' ');
    const parts = normalized.trim().split(/\s+/).filter(p => p.length > 0);

    if (parts.length !== 3) {
        return null;
    }

    const [dayStr, monthStr, yearStr] = parts;
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    // Validation DD MM YYYY
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return null;
    }

    // Validation range
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1000 || year > 9999) {
        return null;
    }

    // Timezone validation
    const date = new Date(Date.UTC(year, month - 1, day));

    // Excepton validation
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
        return null;
    }

    // YYYY-MM-DD format
    const yearStrFormatted = year.toString().padStart(4, '0');
    const monthStrFormatted = month.toString().padStart(2, '0');
    const dayStrFormatted = day.toString().padStart(2, '0');
    return `${yearStrFormatted}-${monthStrFormatted}-${dayStrFormatted}`;
};

const formatDateInputValue = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 8);
    const parts = [];

    if (digitsOnly.length >= 2) {
        parts.push(digitsOnly.slice(0, 2));
    } else if (digitsOnly.length > 0) {
        parts.push(digitsOnly);
        return parts.join('-');
    } else {
        return '';
    }

    if (digitsOnly.length >= 4) {
        parts.push(digitsOnly.slice(2, 4));
    } else if (digitsOnly.length > 2) {
        parts.push(digitsOnly.slice(2));
        return parts.join('-');
    } else {
        return parts.join('-');
    }

    if (digitsOnly.length > 4) {
        parts.push(digitsOnly.slice(4));
    }

    return parts.join('-');
};

export default function HeroSearch() {
    const { state, updateCitizenship, updateStartDate, updateNumberOfDays, updateNumberOfGuests, updateDestinationCountry, updateBoardType, initializeDailySelections } = useBooking();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [checkOutDate, setCheckOutDate] = useState('');
    const [startDateInput, setStartDateInput] = useState(() => formatDateForDisplay(state.startDate));
    const [checkOutInput, setCheckOutInput] = useState(() => formatDateForDisplay(''));

    useEffect(() => {
        if (state.startDate && state.numberOfDays > 0) {
            const [year, month, day] = state.startDate.split('-').map(Number);
            // Timezone 
            const startDateUTC = Date.UTC(year, month - 1, day);
            const endDateUTC = startDateUTC + (state.numberOfDays - 1) * 24 * 60 * 60 * 1000;
            const endDate = new Date(endDateUTC);
            // YYYY-MM-DD format
            const endYear = endDate.getUTCFullYear();
            const endMonth = String(endDate.getUTCMonth() + 1).padStart(2, '0');
            const endDay = String(endDate.getUTCDate()).padStart(2, '0');
            setCheckOutDate(`${endYear}-${endMonth}-${endDay}`);
        }
    }, [state.startDate, state.numberOfDays]);

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

            // Loop validation
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
        setStartDateInput(formatDateForDisplay(state.startDate));
    }, [state.startDate]);

    useEffect(() => {
        setCheckOutInput(formatDateForDisplay(checkOutDate));
    }, [checkOutDate]);

    useEffect(() => {
        const validationErrors = validateBookingState(state);
        const filteredErrors: Record<string, string> = {};

        Object.keys(validationErrors).forEach((key) => {
            if (touched[key]) {
                filteredErrors[key] = validationErrors[key as keyof typeof validationErrors] || '';
            }
        });

        setErrors(filteredErrors);
    }, [state, touched]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const handleStartDateChange = (value: string) => {
        setTouched(prev => ({ ...prev, startDate: true }));
        const formatted = formatDateInputValue(value);
        setStartDateInput(formatted);
        if (!formatted.trim()) {
            updateStartDate('');
            return;
        }

        const isoDate = parseDisplayDate(formatted);
        if (isoDate) {
            updateStartDate(isoDate);
        }
    };

    const handleCheckOutChange = (value: string) => {
        setTouched(prev => ({ ...prev, numberOfDays: true }));
        const formatted = formatDateInputValue(value);
        setCheckOutInput(formatted);
        if (!formatted.trim()) {
            setCheckOutDate('');
            return;
        }

        const isoDate = parseDisplayDate(formatted);
        if (isoDate) {
            setCheckOutDate(isoDate);
            if (state.startDate) {
                const [startYear, startMonth, startDay] = state.startDate.split('-').map(Number);
                const [endYear, endMonth, endDay] = isoDate.split('-').map(Number);

                const startUTC = Date.UTC(startYear, startMonth - 1, startDay);
                const endUTC = Date.UTC(endYear, endMonth - 1, endDay);
                const diffTime = endUTC - startUTC;
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
                if (diffDays > 0) {
                    updateNumberOfDays(diffDays);
                }
            }
        }
    };

    return (
        <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 min-h-[500px] sm:min-h-[600px] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920")',
                }}
            />

            <div className="relative z-10 max-w-6xl w-full">
                <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 px-2">Book your stay with GlobalSoft</h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 px-2">1,480,086 rooms around the world are waiting for you!</p>
                </div>

                <form onSubmit={handleSearch} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Destnaton */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                            </label>
                            <select
                                id="location"
                                value={state.destinationCountry || ''}
                                onChange={(e) => {
                                    setTouched(prev => ({ ...prev, destinationCountry: true }));
                                    updateDestinationCountry(Number(e.target.value));
                                }}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.destinationCountry ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                required
                                defaultValue={''}
                            >
                                <option value="" disabled hidden>Where are you going?</option>
                                {countries.map((country) => (
                                    <option key={country.id} value={country.id}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                            {errors.destinationCountry && (
                                <p className="mt-2 text-sm text-red-600">{errors.destinationCountry}</p>
                            )}
                        </div>

                        {/* Check-in */}
                        <div>
                            <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-2">
                                Check-in
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                id="checkIn"
                                value={startDateInput}
                                placeholder="DD-MM-YYYY"
                                maxLength={10}
                                onChange={(e) => handleStartDateChange(e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.startDate ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                required
                            />
                            {errors.startDate && (
                                <p className="mt-2 text-sm text-red-600">{errors.startDate}</p>
                            )}
                        </div>

                        {/* Check-out */}
                        <div>
                            <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-2">
                                Check-out
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                id="checkOut"
                                value={checkOutInput}
                                placeholder="DD-MM-YYYY"
                                maxLength={10}
                                onChange={(e) => handleCheckOutChange(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            {errors.numberOfDays && (
                                <p className="mt-2 text-sm text-red-600">{errors.numberOfDays}</p>
                            )}
                        </div>

                        {/* Guests */}
                        <div>
                            <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
                                Guests
                            </label>
                            <input
                                type="number"
                                id="guests"
                                min="1"
                                max="10"
                                value={state.numberOfGuests || ''}
                                onChange={(e) => updateNumberOfGuests(Number(e.target.value) || 1)}
                                placeholder="Number of guests"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Citizenship / board */}
                    <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label htmlFor="citizenship" className="block text-sm font-medium text-gray-700 mb-2">
                                Citizenship
                            </label>
                            <select
                                id="citizenship"
                                value={state.citizenship || ''}
                                defaultValue={citizenship[0].id}
                                onChange={(e) => {
                                    setTouched(prev => ({ ...prev, citizenship: true }));
                                    updateCitizenship(Number(e.target.value));
                                }}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.citizenship ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                required
                            >
                                <option value="" disabled hidden>Select your country</option>
                                {citizenship.map((citizenship) => (
                                    <option key={citizenship.id} value={citizenship.id}>
                                        {citizenship.name}
                                    </option>
                                ))}
                            </select>
                            {errors.citizenship && (
                                <p className="mt-2 text-sm text-red-600">{errors.citizenship}</p>
                            )}
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meal Plan
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                                <div className="flex flex-wrap gap-3 sm:gap-4 flex-1">
                                    {boardTypes.map((boardType) => (
                                        <label
                                            key={boardType.code}
                                            className="flex items-center space-x-2 cursor-pointer p-3 sm:p-[13px] rounded-lg border-2 transition-colors hover:bg-gray-50 flex-1 sm:flex-none"
                                            style={{
                                                borderColor: state.boardType === boardType.code ? '#2563eb' : '#e5e7eb',
                                                backgroundColor: state.boardType === boardType.code ? '#eff6ff' : 'transparent',
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name="boardType"
                                                value={boardType.code}
                                                checked={state.boardType === boardType.code}
                                                onChange={(e) => {
                                                    setTouched(prev => ({ ...prev, boardType: true }));
                                                    updateBoardType(e.target.value as 'FB' | 'HB' | 'NB');
                                                }}
                                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">{boardType.name}</span>
                                            <LucideIcon name={boardType.icon as any} className="w-4 h-4 flex-shrink-0" />
                                        </label>
                                    ))}
                                </div>
                                {/* Search / submit*/}
                                <div className="flex justify-end sm:justify-end">
                                    <button
                                        type="submit"
                                        className="w-full sm:w-12 h-12 bg-blue-600 text-white rounded-lg sm:rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg"
                                    >
                                        <span className="sm:hidden mr-2">Search</span>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            {errors.boardType && (
                                <p className="mt-2 text-sm text-red-600">{errors.boardType}</p>
                            )}
                        </div>
                    </div>


                </form>
            </div>
        </div>
    );
}

