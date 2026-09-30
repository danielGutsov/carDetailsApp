import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "bg" | "en";

const translations = {
  en: {
    appTitle: "Vehicle Reminder",
    loading: "Loading…",
    somethingWrong: "Something went wrong",

    signInSubtitle: "Sign in to your account",
    createAccountSubtitle: "Create your account",
    usernameEmail: "Username (email)",
    password: "Password",
    signIn: "Sign in",
    signingIn: "Signing in…",
    noAccountYet: "No account yet?",
    createOne: "Create one",
    createAccount: "Create account",
    creatingAccount: "Creating account…",
    alreadyHaveAccount: "Already have an account?",

    adminView: "Admin view",
    accounts: "Accounts",
    logOut: "Log out",
    normal: "Normal",
    excel: "Excel",
    addVehicle: "Add vehicle",

    allVehiclesAdmin: "All vehicles (admin)",
    backToMyVehicles: "Back to my vehicles",
    allVehicles: "All vehicles",
    accountsAdmin: "Accounts (admin)",
    noVehiclesAnyAccount: "No vehicles have been added by any account yet.",
    owner: "Owner",
    email: "Email",
    admin: "Admin",
    joined: "Joined",
    vehiclesCount: "Vehicles",
    yes: "Yes",

    brandModel: "Brand / Model",
    brand: "Brand",
    model: "Model",
    civilLiability: "Civil liability",
    comprehensiveInsurance: "Comprehensive insurance",
    inspection: "Inspection",
    fireExtinguisher: "Fire extinguisher",
    oilChange: "Oil change",
    kilometers: "Kilometers",
    tyresCount: "Tyres (count)",
    tyres: "Tyres",
    tyresShort: "Tyres (S/W/A)",
    summer: "Summer",
    winter: "Winter",
    allSeason: "All-season",
    from: "From",
    to: "To",
    km: "km",

    editVehicle: "Edit vehicle",
    addVehicleTitle: "Add vehicle",
    delete: "Delete",
    confirmDelete: "Confirm delete?",
    keepIt: "Keep it",
    cancel: "Cancel",
    save: "Save",
    saving: "Saving…",

    noVehiclesYet: 'No vehicles yet. Press "+" to add your first one.',
  },
  bg: {
    appTitle: "Автомобилни напомняния",
    loading: "Зареждане…",
    somethingWrong: "Възникна грешка",

    signInSubtitle: "Влезте в акаунта си",
    createAccountSubtitle: "Създайте своя акаунт",
    usernameEmail: "Потребителско име (имейл)",
    password: "Парола",
    signIn: "Вход",
    signingIn: "Влизане…",
    noAccountYet: "Нямате акаунт?",
    createOne: "Създайте",
    createAccount: "Създай акаунт",
    creatingAccount: "Създаване на акаунт…",
    alreadyHaveAccount: "Вече имате акаунт?",

    adminView: "Админ изглед",
    accounts: "Акаунти",
    logOut: "Изход",
    normal: "Нормален",
    excel: "Excel",
    addVehicle: "Добави автомобил",

    allVehiclesAdmin: "Всички автомобили (админ)",
    backToMyVehicles: "Към моите автомобили",
    allVehicles: "Всички автомобили",
    accountsAdmin: "Акаунти (админ)",
    noVehiclesAnyAccount: "Все още няма добавени автомобили от нито един акаунт.",
    owner: "Собственик",
    email: "Имейл",
    admin: "Админ",
    joined: "Регистриран",
    vehiclesCount: "Автомобили",
    yes: "Да",

    brandModel: "Марка / Модел",
    brand: "Марка",
    model: "Модел",
    civilLiability: "Гражданска отговорност",
    comprehensiveInsurance: "Каско",
    inspection: "Технически преглед",
    fireExtinguisher: "Валидност пожарогасител",
    oilChange: "Последна смяна на масло",
    kilometers: "Километри",
    tyresCount: "Гуми (бройка)",
    tyres: "Гуми",
    tyresShort: "Гуми (Л/З/В)",
    summer: "Летни",
    winter: "Зимни",
    allSeason: "Всесезонни",
    from: "От",
    to: "До",
    km: "км",

    editVehicle: "Редактиране на автомобил",
    addVehicleTitle: "Добавяне на автомобил",
    delete: "Изтрий",
    confirmDelete: "Потвърди изтриването?",
    keepIt: "Запази го",
    cancel: "Отказ",
    save: "Запази",
    saving: "Запазване…",

    noVehiclesYet: 'Все още няма автомобили. Натиснете "+", за да добавите първия.',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

const STORAGE_KEY = "lang";

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
} | null>(null);

function readStoredLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "bg") return stored;
  } catch {
    // ignore — localStorage may be unavailable
  }
  return "bg";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang]);

  function setLang(next: Lang) {
    setLangState(next);
  }

  function t(key: TranslationKey): string {
    return translations[lang][key];
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

const errorTranslations: Record<string, string> = {
  "Password must be at least 8 characters": "Паролата трябва да е поне 8 символа",
  "Invalid email or password": "Грешен имейл или парола",
  "An account with that email already exists": "Вече има акаунт с този имейл",
  "Brand is required": "Марката е задължителна",
  "Model is required": "Моделът е задължителен",
  "Vehicle not found": "Автомобилът не е намерен",
  "User not found": "Потребителят не е намерен",
  "Not authenticated": "Не сте влезли в системата",
  "Invalid or expired session": "Невалидна или изтекла сесия",
  "Admin access required": "Изисква се администраторски достъп",
};

export function translateError(message: string, lang: Lang): string {
  if (lang === "en") return message;
  return errorTranslations[message] ?? message;
}
