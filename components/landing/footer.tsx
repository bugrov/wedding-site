export function LandingFooter() {
  return (
    <footer className="border-t border-black/10 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 text-center text-sm text-(--color-text)/70">
        <p>
          Свяжитесь напрямую: +7 (999) 796-84-38 ·{" "}
          <a href="https://t.me/average_pudge_enjoyer" className="underline underline-offset-4">
            Telegram
          </a>
        </p>
        <p>
          © {new Date().getFullYear()} Wedding Press ·{" "}
          <a href="/privacy" className="underline underline-offset-4">
            Политика конфиденциальности
          </a>
        </p>
      </div>
    </footer>
  );
}
