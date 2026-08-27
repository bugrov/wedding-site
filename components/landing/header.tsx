export function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-(--color-background)/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <span className="text-sm font-semibold tracking-wide uppercase">Wedding Press</span>
        <nav className="hidden items-center gap-6 text-sm sm:flex">
          <a href="#how-it-works" className="hover:text-(--color-accent-text)">
            Как это работает
          </a>
        </nav>
        <a
          href="#configurator"
          className="rounded-full bg-(--color-primary) px-4 py-2 text-sm font-medium text-(--color-background) transition hover:opacity-90"
        >
          Оставить заявку
        </a>
      </div>
    </header>
  );
}
