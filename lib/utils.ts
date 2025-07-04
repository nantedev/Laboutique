import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from 'query-string';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}

interface ZodErrorType {
  name: 'ZodError';
  errors: {
    [key: string]: {
      message: string | unknown;
    };
  };
  message: string;
}

interface PrismaError {
  name: 'PrismaClientKnownRequestError';
  code: string;
  meta?: {
    target?: string[];
  };
  message: string;
}

interface GenericError {
  name?: string;
  message: string;
}

export type ErrorType = ZodErrorType | PrismaError | GenericError;

export function formatError(error: ErrorType): string {
  if (error.name === 'ZodError') {
    // Handle Zod error
    const fieldErrors = Object.keys((error as ZodErrorType).errors).map((field) => {
      const message = (error as ZodErrorType).errors[field].message;
      return typeof message === 'string' ? message : JSON.stringify(message);
    });

    return fieldErrors.join('. ');
  } else if (
    error.name === 'PrismaClientKnownRequestError' &&
    (error as PrismaError).code === 'P2002'
  ) {
    // Handle Prisma error
    const target = (error as PrismaError).meta?.target;
    const field = target ? target[0] : 'Field';
    return `${field.charAt(0).toUpperCase() + field.slice(1)} existe déjà`;
  } else {
    // Handle other errors
    return typeof error.message === 'string'
      ? error.message
      : JSON.stringify(error.message);
  }
}

export const round2 = (value: number | string) => {
  if (typeof value === 'number') {
    return Math.round((value + Number.EPSILON) * 100) / 100; // avoid rounding errors
  } else if (typeof value === 'string') {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error('value is not a number nor a string');
  }
};

const CURRENCY_FORMATTER = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
});

export function formatCurrency(amount: number | string | null) {
  if (typeof amount === 'number') {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === 'string') {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else {
    return 'NaN';
  }
}

// Shorten ID
export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: false, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: false, // use 12-hour clock (true) or 24-hour clock (false)
  };
const formattedDateTime: string = new Date(dateString).toLocaleString(
    'fr-FR',
    dateTimeOptions
);
const formattedDate: string = new Date(dateString).toLocaleString(
    'fr-FR',
    dateOptions
);
const formattedTime: string = new Date(dateString).toLocaleString(
    'fr-FR',
    timeOptions
);  
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

// Form Pagination Links
export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) {
  const query = qs.parse(params);

  query[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query,
    },
    { skipNull: true }
  );
}

//  Format Numbers
const NUMBER_FORMATTER = new Intl.NumberFormat('en-US');
export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}