import type { BookingState } from "../types";

export interface ValidationErrors {
    citizenship?: string;
    startDate?: string;
    numberOfDays?: string;
    destinationCountry?: string;
    boardType?: string;
    dailySelections?: string;
}

export function validateBookingState(state: BookingState): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!state.citizenship) {
        errors.citizenship = "Citizenship is required";
    }

    if (!state.startDate) {
        errors.startDate = "Start date is required";
    } else {
        const [year, month, day] = state.startDate.split("-").map(Number);

        // Validate date parts
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
            errors.startDate = "Invalid date format";
        } else {
            // Create date in UTC to avoid timezone issues
            const startDate = new Date(Date.UTC(year, month - 1, day));

            // Validate the date is valid
            if (startDate.getUTCFullYear() !== year || startDate.getUTCMonth() !== month - 1 || startDate.getUTCDate() !== day) {
                errors.startDate = "Invalid date";
            } else {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const startDateLocal = new Date(year, month - 1, day);
                startDateLocal.setHours(0, 0, 0, 0);

                if (startDateLocal < today) {
                    errors.startDate = "Start date cannot be in the past";
                }
            }
        }
    }

    if (!state.numberOfDays || state.numberOfDays < 1) {
        errors.numberOfDays = "Number of days must be at least 1";
    } else if (state.numberOfDays > 30) {
        errors.numberOfDays = "Number of days cannot exceed 30";
    }

    if (!state.destinationCountry) {
        errors.destinationCountry = "Destination country is required";
    }

    if (!state.boardType) {
        errors.boardType = "Board type is required";
    }

    if (state.dailySelections.length === 0) {
        errors.dailySelections = "Please configure at least one day";
    }

    return errors;
}

export function isBookingValid(state: BookingState): boolean {
    const errors = validateBookingState(state);
    return Object.keys(errors).length === 0;
}
