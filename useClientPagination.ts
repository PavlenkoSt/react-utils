import { useMemo, useState } from "react";

export const useClientPaginarion = <ItemType>({
  items,
  step = 10,
}: {
  items: ItemType[];
  step?: number;
}) => {
  const [pageNumber, setPageNumber] = useState(1);

  const itemsPortion = useMemo(() => {
    if (!items.length) return [];

    const start = pageNumber <= 0 ? 0 : (pageNumber - 1) * step;
    const end = pageNumber * step;

    return items.slice(start, end);
  }, [items, pageNumber, step]);

  const totalPages = Math.ceil(items.length / step);

  const showPagination = totalPages > 1;

  return {
    pageNumber,
    setPageNumber,
    itemsPortion,
    showPagination,
    totalPages,
  };
};
