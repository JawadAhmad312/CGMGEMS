const ProductPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 0) {
    return null;
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      {totalPages > 1 && (
  <div
    className="
      relative
      left-1/2
      mt-16
      w-screen
      -translate-x-1/2
      border-y
      border-[#e5e5e5]
    "
  >
    <div className="flex h-[76px] items-center justify-center">

      <div className="flex items-center">

        {/* PAGE NUMBERS */}
        {(() => {
          const pages = [];

          if (totalPages <= 7) {
            for (let page = 1; page <= totalPages; page++) {
              pages.push(
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`
                    relative
                    mx-[9px]
                    flex
                    h-[35px]
                    min-w-[20px]
                    items-center
                    justify-center
                    border-0
                    bg-transparent
                    px-0
                    text-[16px]
                    text-[#111]

                    ${
                      currentPage === page
                        ? "font-medium after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[4px] after:bg-black"
                        : ""
                    }
                  `}
                >
                  {page}
                </button>
              );
            }
          } else {
            const addPage = (page) => {
              pages.push(
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`
                    relative
                    mx-[9px]
                    flex
                    h-[35px]
                    min-w-[20px]
                    items-center
                    justify-center
                    border-0
                    bg-transparent
                    px-0
                    text-[16px]
                    text-[#111]

                    ${
                      currentPage === page
                        ? "font-medium after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[4px] after:bg-black"
                        : ""
                    }
                  `}
                >
                  {page}
                </button>
              );
            };

            for (let page = 1; page <= 7; page++) {
              addPage(page);
            }

            pages.push(
              <span
                key="ellipsis"
                className="mx-[8px] flex h-[35px] items-center text-[16px]"
              >
                ...
              </span>
            );

            addPage(totalPages);
          }

          return pages;
        })()}

        {/* DIVIDER */}
        <span className="mx-[16px] h-[30px] w-px bg-[#d8d8d8]" />

        {/* NEXT */}
        <button
          type="button"
          onClick={() =>
            onPageChange((prev) =>
              Math.min(prev + 1, totalPages)
            )
          }
          disabled={currentPage === totalPages}
          className="
            flex
            h-[35px]
            items-center
            border-0
            bg-transparent
            px-0
            text-[16px]
            font-semibold
            uppercase
            text-[#222]
            hover:opacity-60
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          NEXT
        </button>

      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ProductPagination;
