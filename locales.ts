export const translations = {
  en: {
    // Header
    appName: 'Flight Tracker',
    // Search Form
    findYourAdventure: 'Find Your Next Adventure',
    searchInstructions: 'Enter your travel details below to find real-time flight options powered by AI and Google Search.',
    origin: 'Origin',
    originPlaceholder: 'e.g., San Francisco',
    destination: 'Destination',
    destinationPlaceholder: 'e.g., Tokyo',
    depart: 'Depart',
    return: 'Return',
    oneWay: 'One-way',
    roundTrip: 'Round trip',
    adults: 'Adults (15+)',
    children: 'Children (<15)',
    search: 'Search',
    // Results
    loadingMessage: 'Searching for the best flights...',
    loadingSubMessage: 'Our AI is scanning the skies for you!',
    readyForTakeoff: 'Ready for Takeoff?',
    readyForTakeoffMessage: 'Your journey begins here. Use the search form above to find your perfect flight.',
    noFlightsFound: 'No flights found for your search criteria. Try adjusting your dates or destinations.',
    errorFetching: 'Sorry, we hit turbulence trying to fetch flights. Please try again.',
    flightDataFormatError: 'The flight data returned was in an unexpected format. Please try your search again.',
    aiTrafficError: 'Failed to fetch real-time flight data. The AI may be experiencing heavy traffic.',
    bookingDisclaimer: "Please verify flight details on the airline's website before booking. Prices and availability are subject to change.",
    dataSourcedFrom: 'Data Sourced From',
    // Flight Card
    direct: 'Direct',
    stop: 'Stop',
    stops: 'Stops',
    bookFlight: 'Book Flight',
    bookFlightWith: 'Book flight with',
    // Footer
    footer: 'Powered by Google Gemini. Flight data grounded in Google Search.',
  },
  ar: {
    // Header
    appName: 'متتبع الرحلات',
    // Search Form
    findYourAdventure: 'ابحث عن مغامرتك القادمة',
    searchInstructions: 'أدخل تفاصيل سفرك أدناه للعثور على خيارات رحلات في الوقت الفعلي مدعومة بالذكاء الاصطناعي وبحث Google.',
    origin: 'المغادرة',
    originPlaceholder: 'مثال: سان فرانسيسكو',
    destination: 'الوجهة',
    destinationPlaceholder: 'مثال: طوكيو',
    depart: 'تاريخ المغادرة',
    return: 'تاريخ العودة',
    oneWay: 'ذهاب فقط',
    roundTrip: 'ذهاب وعودة',
    adults: 'بالغون (+15)',
    children: 'أطفال (<15)',
    search: 'بحث',
    // Results
    loadingMessage: 'جاري البحث عن أفضل الرحلات...',
    loadingSubMessage: 'يقوم الذكاء الاصطناعي لدينا بمسح الأجواء من أجلك!',
    readyForTakeoff: 'جاهز للإقلاع؟',
    readyForTakeoffMessage: 'رحلتك تبدأ هنا. استخدم نموذج البحث أعلاه للعثور على رحلتك المثالية.',
    noFlightsFound: 'لم يتم العثور على رحلات لمعايير البحث الخاصة بك. حاول تعديل التواريخ أو الوجهات.',
    errorFetching: 'عذراً، واجهنا بعض الاضطرابات أثناء محاولة جلب الرحلات. يرجى المحاولة مرة أخرى.',
    flightDataFormatError: 'بيانات الرحلة المستلمة كانت بتنسيق غير متوقع. يرجى تجربة البحث مرة أخرى.',
    aiTrafficError: 'فشل في جلب بيانات الرحلات في الوقت الفعلي. قد يواجه الذكاء الاصطناعي ضغطًا كبيرًا.',
    bookingDisclaimer: 'يرجى التحقق من تفاصيل الرحلة على موقع شركة الطيران قبل الحجز. الأسعار والتوافر عرضة للتغيير.',
    dataSourcedFrom: 'البيانات مأخوذة من',
    // Flight Card
    direct: 'مباشرة',
    stop: 'توقف',
    stops: 'توقفات',
    bookFlight: 'احجز الرحلة',
    bookFlightWith: 'احجز رحلة مع',
    // Footer
    footer: 'مدعوم بواسطة Google Gemini. بيانات الرحلات مستندة إلى بحث Google.',
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations['en'];

export function useTranslations(lang: Language) {
  return function t(key: TranslationKey): string {
    return translations[lang][key] || translations['en'][key];
  }
}