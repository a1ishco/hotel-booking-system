import { createContext, useContext, useReducer, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import type { BookingState, DailySelection } from "../types";
import { getUserLocation } from "../services/locationService";
import { citizenship } from "../data/constants";

// Context type
interface BookingContextType {
    state: BookingState;
    updateCitizenship: (citizenship: number) => void;
    updateStartDate: (startDate: string) => void;
    updateNumberOfDays: (numberOfDays: number) => void;
    updateNumberOfGuests: (numberOfGuests: number) => void;
    updateDestinationCountry: (destinationCountry: number) => void;
    updateBoardType: (boardType: "FB" | "HB" | "NB") => void;
    updateDailySelection: (
        day: number,
        selection: Partial<DailySelection>
    ) => void;
    initializeDailySelections: (selections: DailySelection[]) => void;
    resetBooking: () => void;
}

// Initial state
const initialState: BookingState = {
    citizenship: null,
    startDate: "",
    numberOfDays: 0,
    numberOfGuests: 1,
    destinationCountry: null,
    boardType: null,
    dailySelections: [],
};

// Action type
type BookingAction =
    | { type: "UPDATE_CITIZENSHIP"; payload: number }
    | { type: "UPDATE_START_DATE"; payload: string }
    | { type: "UPDATE_NUMBER_OF_DAYS"; payload: number }
    | { type: "UPDATE_NUMBER_OF_GUESTS"; payload: number }
    | { type: "UPDATE_DESTINATION_COUNTRY"; payload: number }
    | { type: "UPDATE_BOARD_TYPE"; payload: "FB" | "HB" | "NB" }
    | {
        type: "UPDATE_DAILY_SELECTION";
        payload: { day: number; selection: Partial<DailySelection> };
    }
    | { type: "INITIALIZE_DAILY_SELECTIONS"; payload: DailySelection[] }
    | { type: "RESET_BOOKING" };

// Reducer state
function bookingReducer(
    state: BookingState,
    action: BookingAction
): BookingState {
    switch (action.type) {
        case "UPDATE_CITIZENSHIP":
            return { ...state, citizenship: action.payload };
        case "UPDATE_START_DATE":
            return { ...state, startDate: action.payload };
        case "UPDATE_NUMBER_OF_DAYS":
            return { ...state, numberOfDays: action.payload };
        case "UPDATE_NUMBER_OF_GUESTS":
            return { ...state, numberOfGuests: action.payload };
        case "UPDATE_DESTINATION_COUNTRY":
            return { ...state, destinationCountry: action.payload };
        case "UPDATE_BOARD_TYPE":
            return { ...state, boardType: action.payload };
        case "INITIALIZE_DAILY_SELECTIONS":
            return { ...state, dailySelections: action.payload };
        case "UPDATE_DAILY_SELECTION": {
            const { day, selection } = action.payload;
            const updatedSelections = state.dailySelections.map((ds) =>
                ds.day === day ? { ...ds, ...selection } : ds
            );
            return { ...state, dailySelections: updatedSelections };
        }
        case "RESET_BOOKING":
            return initialState;
        default:
            return state;
    }
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(bookingReducer, initialState);
    const hasSetDefaultCitizenship = useRef(false);

    // Fetch user location and set default citizenship on mount
    useEffect(() => {
        const setDefaultCitizenship = async () => {
            // Only set default once on mount
            if (!hasSetDefaultCitizenship.current && state.citizenship === null) {
                hasSetDefaultCitizenship.current = true;
                const location = await getUserLocation();
                if (location?.country) {
                    // Find citizenship by country code
                    const matchedCitizenship = citizenship.find(
                        (cit) => cit.code.toUpperCase() === location.country.toUpperCase()
                    );
                    if (matchedCitizenship) {
                        dispatch({ type: "UPDATE_CITIZENSHIP", payload: matchedCitizenship.id });
                    }
                }
            }
        };

        setDefaultCitizenship();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run on mount

    const updateCitizenship = (citizenship: number) => {
        dispatch({ type: "UPDATE_CITIZENSHIP", payload: citizenship });
    };

    const updateStartDate = (startDate: string) => {
        dispatch({ type: "UPDATE_START_DATE", payload: startDate });
    };

    const updateNumberOfDays = (numberOfDays: number) => {
        dispatch({ type: "UPDATE_NUMBER_OF_DAYS", payload: numberOfDays });
    };

    const updateNumberOfGuests = (numberOfGuests: number) => {
        dispatch({ type: "UPDATE_NUMBER_OF_GUESTS", payload: numberOfGuests });
    };

    const updateDestinationCountry = (destinationCountry: number) => {
        dispatch({
            type: "UPDATE_DESTINATION_COUNTRY",
            payload: destinationCountry,
        });
    };

    const updateBoardType = (boardType: "FB" | "HB" | "NB") => {
        dispatch({ type: "UPDATE_BOARD_TYPE", payload: boardType });
    };

    const updateDailySelection = (
        day: number,
        selection: Partial<DailySelection>
    ) => {
        dispatch({ type: "UPDATE_DAILY_SELECTION", payload: { day, selection } });
    };

    const initializeDailySelections = (selections: DailySelection[]) => {
        dispatch({ type: "INITIALIZE_DAILY_SELECTIONS", payload: selections });
    };

    // Reset booking
    const resetBooking = () => {
        dispatch({ type: "RESET_BOOKING" });
    };

    return (
        <BookingContext.Provider
            value={{
                state,
                updateCitizenship,
                updateStartDate,
                updateNumberOfDays,
                updateNumberOfGuests,
                updateDestinationCountry,
                updateBoardType,
                updateDailySelection,
                initializeDailySelections,
                resetBooking,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
}

export function useBooking() {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error("useBooking must be used within a BookingProvider");
    }
    return context;
}
