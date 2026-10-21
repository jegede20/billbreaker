export const STRINGS = {
  brand: {
    name: 'BillBreaker',
    wordmarkFirst: 'Bill',
    wordmarkSecond: 'Breaker',
    tagline: 'Find out which appliance is consuming your light bill.',
    footerDisclaimer: 'Estimates use typical appliance wattage, not measured use.',
    estimateBadge: 'Estimate, check your bill',
  },
  nav: {
    howItWorks: 'How it works',
    features: 'Features',
    faq: 'FAQ',
    breakMyBill: 'Break my bill',
    backToLanding: 'Landing page',
    home: 'Home',
    appliances: 'Appliances',
    savings: 'Savings',
    tokens: 'Tokens',
    settings: 'Settings',
  },
  landing: {
    eyebrow: 'Free · No signup · Works offline',
    headline: 'Find out which appliance is consuming your light bill.',
    subtext:
      'Add your appliances, see what each one costs, and learn which changes save you the most money.',
    primaryCta: 'Break my bill',
    secondaryCta: 'See how it works',
    sampleCardTitle: 'Sample Monthly Bill Breakdown',
    sampleCardSubtitle: 'Lagos 3-bedroom apartment · Prepaid meter',
    currencyStripLabel: 'Works in your local currency',
    miniCalc: {
      title: 'Quick Appliance Cost Check',
      subtitle: 'Pick an appliance and slide the daily hours to see an instant monthly estimate.',
      applianceLabel: 'Select appliance',
      hoursLabel: 'Hours used per day',
      monthlyCostLabel: 'Estimated monthly cost',
      monthlyKwhLabel: 'Monthly energy use',
      disclaimer: 'Instant estimate based on typical appliance wattage and standard residential tariff.',
    },
    howItWorks: {
      eyebrow: 'How it works',
      title: 'Three steps to a smaller bill',
      steps: [
        {
          number: '01',
          title: 'Add your appliances',
          description:
            'Pick from a list of common household appliances and set the hours you use them.',
        },
        {
          number: '02',
          title: 'See what each one costs',
          description:
            'Your bill is split by appliance, so the biggest drain is obvious.',
        },
        {
          number: '03',
          title: 'Apply the savings',
          description:
            'Test changes like one less hour of AC and watch your monthly bill drop.',
        },
      ],
    },
    features: {
      eyebrow: 'Features',
      title: 'Built for how power really works, wherever you live',
      items: [
        {
          title: 'Appliance ranking',
          description:
            'Ranks every device in your home from biggest electricity drain to smallest with a clear share bar.',
        },
        {
          title: 'Savings what-ifs',
          description:
            'Toggle real-world habit changes and immediately see how much cash stays in your pocket every month and year.',
        },
        {
          title: 'Prepaid token calculator',
          description:
            'Enter your token purchase to see how many days it lasts, your next top-up date, and extra days gained from savings.',
        },
        {
          title: 'Generator and solar costs',
          description:
            'Accounts for daily grid outages, generator fuel burn, and inverter or solar backup so your true power spend is visible.',
        },
      ],
    },
    savingsExamples: {
      eyebrow: 'Real numbers, real relief',
      title: 'Small daily tweaks that cut a ₦48,000 bill by 27%',
      subtitle:
        'See how four realistic changes save ₦12,900 every month (₦154,800 a year) and stretch a ₦20,000 token from 12 days to 17 days.',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Common questions',
      items: [
        {
          question: 'How accurate is it?',
          answer:
            'BillBreaker calculates estimates from typical appliance wattage and compressor duty cycles. You can make it even more accurate with Bill Calibration by entering your last real electricity bill so every appliance scales to match your meter.',
        },
        {
          question: 'Is it free?',
          answer:
            'Yes. BillBreaker is 100% free to use with no paywalls, subscriptions, or hidden fees.',
        },
        {
          question: 'Do I need to sign up?',
          answer:
            'No. There are no accounts and no cloud database. All of your appliances, rates, and settings stay privately on your own phone or computer.',
        },
        {
          question: 'Which countries does it work in?',
          answer:
            'It works anywhere in the world. We include quick rate presets for Nigeria, Ghana, Kenya, South Africa, Uganda, the US, UK, Europe, India, and more — and you can set any local currency and tariff rate.',
        },
      ],
    },
    finalCta: {
      title: 'Ready to break your bill?',
      subtitle: 'Takes less than 60 seconds. No account required.',
      button: 'Break my bill',
    },
  },
  setup: {
    title: 'Set up your power profile',
    skip: 'Skip setup (use defaults)',
    step1Title: 'Where do you live?',
    step1Subtitle: 'We use this to set your currency and a starting electricity rate.',
    step2Title: 'Your meter and tariff rate',
    step2Subtitle: 'Choose your meter type and confirm or edit your rate per kWh.',
    step3Title: 'Power sources and grid supply',
    step3Subtitle: 'Select how your home gets power and how many hours a day the grid is on.',
    back: 'Back',
    next: 'Continue',
    finish: 'See my dashboard',
    starterPackLabel: 'Start with a typical household appliance list (you can edit or remove any item)',
  },
  dashboard: {
    monthlyEstimateLabel: 'Estimated monthly bill',
    afterSavingsLabel: 'After applied savings',
    billBreakerTitle: 'Bill Breaker Breakdown',
    billBreakerSubtitle: 'How your monthly electricity spend splits across each appliance',
    topCulpritsTitle: 'Top 3 Culprits',
    topCulpritsSubtitle: 'These appliances drive the biggest share of your bill',
    quickWinTitle: 'Quick Win',
    quickWinAppliedBadge: 'Applied to bill',
    quickWinApplyBtn: 'Apply saving',
    calibratedBadge: 'Calibrated to real bill',
    unpoweredWarningTitle: 'Grid outage cap active',
    emptyTitle: 'No appliances added yet',
    emptyDescription:
      'Add the appliances in your home or load our sample household to see your monthly bill breakdown.',
    addFirstApplianceBtn: 'Add appliances',
    loadSampleBtn: 'Load sample household',
  },
  appliances: {
    title: 'Your Appliances',
    subtitle: 'Adjust daily hours, wattage, or power source for any item in your home.',
    addApplianceBtn: 'Add appliance',
    customApplianceBtn: 'Add custom appliance',
    searchPlaceholder: 'Search appliances (e.g. AC, freezer, fan, pump)...',
    hoursPerDay: 'Hours / day',
    wattsLabel: 'Watts (typical estimate)',
    quantityLabel: 'Quantity',
    dutyCycleLabel: 'Duty cycle (0.1 - 1.0)',
    powerSourceLabel: 'Power source',
  },
  savings: {
    title: 'Savings What-Ifs',
    subtitle: 'Test practical changes and toggle them on to see your new monthly bill.',
    summaryTitle: 'Apply everything and save',
    currentlyAppliedLabel: 'Currently applied savings',
    applyAllBtn: 'Apply all tips',
    clearAllBtn: 'Reset toggles',
    applyBtn: 'Apply',
    appliedBtn: 'Applied',
    noTipsTitle: 'Add appliances to unlock tailored savings tips',
    noTipsDescription:
      'Once you add appliances like an AC, freezer, fans, lighting, or TV, BillBreaker calculates the exact savings for each habit change.',
  },
  tokens: {
    title: 'Prepaid Credit Calculator',
    subtitle: 'See how many days your token or top-up will last at your current daily usage.',
    amountLabel: 'Token or top-up amount',
    daysLastsTitle: 'Your token lasts about',
    topUpAroundLabel: 'Top up around',
    comparisonTitle: 'How long your token lasts',
    currentUsageLabel: 'Current usage',
    withSavingsLabel: 'With all savings applied',
  },
  settings: {
    title: 'Settings',
    subtitle: 'Manage your tariff rate, backup power costs, bill calibration, and saved data.',
    countryCurrencyTitle: 'Country & Currency',
    tariffTitle: 'Electricity Tariff & Meter',
    powerSupplyTitle: 'Grid Supply & Backup Power',
    calibrationTitle: 'Bill Calibration',
    calibrationDescription:
      'Enter your last real monthly electricity bill so all appliance estimates scale to match what you actually paid.',
    dataSectionTitle: 'Household Data & Reset',
    aboutTitle: 'About BillBreaker',
    aboutDescription:
      'BillBreaker is a free, offline-capable household energy tool built to help households across Africa and around the world see which appliances consume their electricity budget and which practical changes save the most money.',
    resetConfirmTitle: 'Reset all BillBreaker data?',
    resetConfirmText:
      'This will remove your saved appliances, custom rates, applied savings, and calibration from this device.',
    resetBtn: 'Reset all data',
  },
  validation: {
    ratePositive: 'Electricity rate must be greater than 0.',
    hoursRange: 'Hours per day must be between 0 and 24.',
    quantityMin: 'Quantity must be at least 1.',
    wattagePositive: 'Wattage must be greater than 0.',
    gridHoursRange: 'Grid supply hours must be between 0 and 24.',
    dutyCycleRange: 'Duty cycle must be between 0.05 and 1.0.',
    fuelPriceNonNegative: 'Fuel price cannot be negative.',
    litersPerHourPositive: 'Generator fuel use (liters/hr) must be greater than 0.',
    realBillPositive: 'Real bill amount must be greater than 0 to calibrate.',
  },
} as const;
