import CURATED from './questions_curated.js';
import AUTO from './questions_auto.js';

/*
  بنك الأسئلة الموحّد (QCM) — القانون رقم 58.25 المتعلق بالمسطرة المدنية
  كل سؤال: cat / q / options[4] / a / exp
  الخيار الصحيح موضوع دائماً في options[0] ويُخلط عشوائياً عند التوليد.
*/
export const QUESTIONS = [...CURATED, ...AUTO];
