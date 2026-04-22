export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-foreground">ElectionGuide Bot</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Educational content. Always verify dates with the{" "}
              <a href="https://eci.gov.in" target="_blank" rel="noreferrer" className="font-medium text-primary underline-offset-2 hover:underline">
                Election Commission of India
              </a>.
            </p>
          </div>
          <div className="flex h-2 w-32 overflow-hidden rounded-full">
            <div className="flex-1 bg-saffron" />
            <div className="flex-1 bg-background" />
            <div className="flex-1 bg-india-green" />
          </div>
        </div>
      </div>
    </footer>
  );
}
