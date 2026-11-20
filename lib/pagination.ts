export function pageWindow(count: number, size: number, page?: string | null) {
  const requested = Number(page);
  const totalPages = Math.max(1, Math.ceil(count / size));
  const currentPage = Number.isSafeInteger(requested)
    ? Math.min(totalPages, Math.max(1, requested))
    : 1;
  return { currentPage, totalPages, offset: (currentPage - 1) * size };
}
