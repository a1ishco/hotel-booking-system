# GlobalSoft Hotel Booking System

A dynamic hotel booking application that allows users to select travel destinations, choose hotels, and configure meal plans based on board type selections. The application calculates total costs based on user selections across multiple days.

## Features as wanted

- **Step 1: Initial configuration**

  - Select citizenship country (added API for auto select)
  - Choose travel date range (start date and number of days)
  - Select destination country (TR, UA, IT)
  - Choose board type (Full Board, Half Board, or No Board)

- **Step 2: Daily configuration**

  - Configure hotel and meal selections for each day
  - Meal selection rules based on board type:
    - **Full Board (FB)**: Both lunch AND dinner can be selected
    - **Half Board (HB)**: Only lunch OR dinner can be selected (mutually exclusive)
    - **No Board (NB)**: No meal selections allowed

- **Step 3: Summary & price calculation**
  - View configuration summary
  - See daily selections breakdown
  - Calculate and display total price with per-day breakdown
  - Calculation for number of guests

## Technology stack

- **Framework**: React.js 19.2.0 with TypeScript
- **State Management**: React Context API with useReducer
- **Styling**: Tailwind CSS 4.1.17
- **Build Tool**: Vite 7.2.2
- **Language**: TypeScript 5.9.3

## Prerequisites

- Node.js (v20.19.0 or >=22.12.0 recommended)
- npm or yarn package manager

## Project structure

```
hotel-booking-system/
├── src/
│   ├── components/          # React components
│   │   ├── ui/              # UI components
│   │   │   ├── Icons.tsx    # Lucide icons
│   │   │   └── Loading.tsx  # Lottie animation added
│   │   ├── Header.tsx
│   │   ├── HeroSearch.tsx
│   │   ├── InitialConfiguration.tsx
│   │   ├── DailyConfiguration.tsx
│   │   ├── Logo.tsx
│   │   ├── PopularDestinations.tsx
│   │   └── SummaryAndPricing.tsx
│   ├── context/             # Context API for state management
│   │   └── BookingContext.tsx
│   ├── data/                # Data constants
│   │   └── constants.ts
│   ├── services/            # Service functions
│   │   └── locationService.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   └── validation.ts
│   ├── assets/              # Static assets
│   │   └── react.svg
│   ├── App.tsx              # Main App component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles with Tailwind
├── public/                  # Public static assets
│   └── vite.svg
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tailwind.config.ts       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── tsconfig.json            # TypeScript configuration
├── tsconfig.app.json        # TypeScript app configuration
├── tsconfig.node.json       # TypeScript node configuration
├── eslint.config.js         # ESLint configuration
└── vite.config.ts           # Vite configuration
```

## Architecture decisions

### State management

I chose **React Context API with useReducer** over Redux for the following reasons:

1. **Simplicity**: The application state is relatively straightforward and doesn't require complex middleware or time-travel debugging
2. **Built-in**: No additional dependencies needed
3. **Performance**: Context API is sufficient for this application's scale
4. **Type Safety**: Works seamlessly with TypeScript

The state is managed in `BookingContext.tsx` with a reducer pattern that handles all booking-related actions.

### Component architecture

The application follows a **component-based architecture** with clear separation of concerns:

- **InitialConfiguration**: Handles Step 1 form inputs and validation
- **DailyConfiguration**: Manages daily hotel and meal selections with board type rules
- **SummaryAndPricing**: Displays summary and calculates prices

Each component is self-contained and communicates through the shared Context.

### Styling approach

**Tailwind CSS** was chosen for:

1. **Rapid Development**: Utility-first approach speeds up styling
2. **Responsive Design**: Built-in responsive utilities
3. **Consistency**: Ensures consistent spacing and colors
4. **Small Bundle Size**: Only used classes are included in production

### TypeScript

TypeScript is used throughout the project for:

1. **Type Safety**: Prevents runtime errors
2. **Better IDE Support**: Autocomplete and IntelliSense
3. **Self-Documenting Code**: Types serve as documentation
4. **Refactoring Safety**: Easier to refactor with confidence

## Features implementation

### Meal selection rules

The meal selection logic is implemented in `DailyConfiguration.tsx`:

- **Full Board (FB)**: Both lunch and dinner dropdowns are enabled
- **Half Board (HB)**: Selecting lunch disables dinner and vice versa (mutually exclusive)
- **No Board (NB)**: Both meal dropdowns are disabled

### Price calculation

Price calculation is done in `SummaryAndPricing.tsx`:

- Calculates per-day totals: Hotel Price + Lunch Price + Dinner Price
- Displays breakdown for each day
- Shows grand total across all days with number of gests

### Form validation

Validation is implemented in `utils/validation.ts`:

- Validates all required fields
- Checks date constraints (cannot be in the past)
- Validates number of days (1-30 range)
- Provides real-time error feedback

## Responsive design

The application is fully responsive and works on:

- **Desktop**: Full-width layout with multi-column grids
- **Tablet**: Adjusted grid layouts
- **Mobile**: Single-column layout with horizontal scrolling for tables
