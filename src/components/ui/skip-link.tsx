/**
 * Skip to Main Content Link
 * Accessibility feature for keyboard navigation
 */

export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-6 focus:py-3 focus:bg-indigo-600 focus:text-white focus:font-semibold focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
    >
      Bỏ qua đến nội dung chính
    </a>
  );
}

