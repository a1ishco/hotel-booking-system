import type {
    Country,
    Hotel,
    BoardType,
    MealsByCountry,
    Destination,
} from "../types";

export const countries: Country[] = [
    { id: 1, name: "Turkey" },
    { id: 2, name: "UAE" },
    { id: 3, name: "Italy" },
];

export const hotels: Record<string, Hotel[]> = {
    Turkey: [
        { id: 101, name: "Hilton Istanbul", price: 120 },
        { id: 102, name: "Titanic Antalya", price: 90 },
    ],
    UAE: [
        { id: 201, name: "Dubai Marina Hotel", price: 200 },
        { id: 202, name: "Palm Jumeirah Resort", price: 300 },
    ],
    Italy: [{ id: 301, name: "Rome Center Hotel", price: 150 }],
};

export const boardTypes: BoardType[] = [
    { code: "FB", name: "Full Board", icon: "Maximize2" },
    { code: "HB", name: "Half Board", icon: "Columns2" },
    { code: "NB", name: "No Board", icon: "CircleOff" },
];

export const meals: MealsByCountry = {
    Turkey: {
        dinner: [
            { id: 1, name: "Turkish Kebab", price: 15 },
            { id: 2, name: "Istanbul Fish Plate", price: 18 },
            { id: 3, name: "Traditional Meat Stew", price: 20 },
        ],
        lunch: [
            { id: 4, name: "Chicken Pilaf", price: 10 },
            { id: 5, name: "Lentil Soup Set", price: 8 },
            { id: 6, name: "Veggie Plate", price: 9 },
        ],
    },
    UAE: {
        dinner: [
            { id: 7, name: "Arabic Mixed Grill", price: 25 },
            { id: 8, name: "Dubai Seafood Dinner", price: 30 },
        ],
        lunch: [
            { id: 9, name: "Shawarma Plate", price: 12 },
            { id: 10, name: "Hummus & Falafel Set", price: 11 },
        ],
    },
    Italy: {
        dinner: [
            { id: 11, name: "Pasta Carbonara", price: 20 },
            { id: 12, name: "Italian Seafood Dinner", price: 28 },
        ],
        lunch: [
            { id: 13, name: "Pizza Margherita", price: 12 },
            { id: 14, name: "Lasagna Lunch Set", price: 14 },
        ],
    },
};

export const popularDestinations: Destination[] = [
    {
        id: 1,
        name: "Istanbul",
        image:
            "https://images.unsplash.com/photo-1636537511494-c3e558e0702b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8SXN0YW5idWx8ZW58MHx8MHx8fDA%3D",
    },
    {
        id: 2,
        name: "Trabzon",
        image:
            "https://images.unsplash.com/photo-1673521768190-7847013f1b9d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fFRyYWJ6b258ZW58MHx8MHx8fDA%3D",
    },
    {
        id: 3,
        name: "Dubai",
        image:
            "https://images.unsplash.com/photo-1546412414-8035e1776c9a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fER1YmFpfGVufDB8fDB8fHww",
    },
    {
        id: 4,
        name: "Sharjah",
        image:
            "https://images.unsplash.com/photo-1683471546843-3dd6eace89b5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8U2hhcmphaHxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
        id: 5,
        name: "Rome",
        image:
            "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Um9tZXxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
        id: 6,
        name: "Venice",
        image:
            "https://images.unsplash.com/photo-1558271736-cd043ef2e855?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8VmVuaWNlfGVufDB8fDB8fHww",
    },
];


