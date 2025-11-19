export interface Country {
    id: number;
    name: string;
}

export interface Hotel {
    id: number;
    name: string;
    price: number;
}

export interface BoardType {
    code: string;
    name: string;
    icon: string;
}

export interface Meal {
    id: number;
    name: string;
    price: number;
}

export interface MealsByCountry {
    [countryName: string]: {
        dinner: Meal[];
        lunch: Meal[];
    };
}

export interface DailySelection {
    day: number;
    date: string;
    hotelId: number | null;
    lunchId: number | null;
    dinnerId: number | null;
}

export interface BookingState {
    citizenship: number | null;
    startDate: string;
    numberOfDays: number;
    numberOfGuests: number;
    destinationCountry: number | null;
    boardType: 'FB' | 'HB' | 'NB' | null;
    dailySelections: DailySelection[];
}

export interface PriceBreakdown {
    day: number;
    date: string;
    hotelPrice: number;
    lunchPrice: number;
    dinnerPrice: number;
    dayTotal: number;
}

export interface Destination {
    id: number;
    name: string;
    image: string;
}

export interface Citizenship {
    id: number;
    name: string;
    code: string;
}
