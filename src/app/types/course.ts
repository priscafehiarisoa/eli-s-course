// Shape returned by /api/courses (with includes)
export type DbCourseTranslation = {
  id: string;
  courseId: string;
  locale: string;
  title: string;
  description: string;
};

export type DbCourseModule = {
  id: string;
  courseId: string;
  order: number;
  titleDe: string;
  descriptionDe: string;
};

export type DbCourse = {
  id: string;
  slug: string;
  level: string;
  image: string;
  price: string;
  maxCapacity: number;
  startDate: string;
  scheduleDays: string;
  scheduleTime: string;
  translations: DbCourseTranslation[];
  modules: DbCourseModule[];
  _count: { enrollments: number };
};

// Helpers
export function getCourseTitle(course: DbCourse, locale: string): string {
  return (
    course.translations.find((t) => t.locale === locale)?.title ||
    course.translations.find((t) => t.locale === "en")?.title ||
    course.slug
  );
}

export function getCourseDescription(course: DbCourse, locale: string): string {
  return (
    course.translations.find((t) => t.locale === locale)?.description ||
    course.translations.find((t) => t.locale === "en")?.description ||
    ""
  );
}
