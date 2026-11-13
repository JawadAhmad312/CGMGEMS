import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaBalanceScale } from "react-icons/fa";
import MobileFilter from "../filters/MobileFilter";
import DesktopFilter from "../filters/DesktopFilter";
import { apiUrl } from "../../lib/api";
import { formatPkr, formatUsd } from "../../lib/currency";



function Stone() {
  const [products, setProducts] = useState([]);


  /* -------- FILTER STATES -------- */
 const [filters, setFilters] = useState({
  search: "",
  category: "All",
  availability: "all",
  sort: "default",
  minPrice: "",
  maxPrice: "",
});
  /* -------- PAGINATION -------- */
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const categories = [
    "All",
    ...new Set(products.map((item) => item.category).filter(Boolean)),
  ];
  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
   fetch(apiUrl("/api/stone"))
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to load stones");
        }
        return Array.isArray(data)
          ? data
          : Array.isArray(data.stones)
            ? data.stones
            : Array.isArray(data.data)
              ? data.data
              : [];
      })
      .then(data => setProducts(data))
      .catch(() => setProducts([]));

   const user = JSON.parse(localStorage.getItem("user"));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);
  /* ---------------- ADD TO CART ---------------- */
const addToCart = (product) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Please login first");
    return;
  }

  const cartKey = `cart_${user._id}`;

  let cart =
    JSON.parse(localStorage.getItem(cartKey)) || [];

  const existingIndex = cart.findIndex(
    (item) => item._id === product._id
  );

  if (existingIndex !== -1) {
    cart[existingIndex] = {
      ...cart[existingIndex],
      quantity: cart[existingIndex].quantity + 1,
    };
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  localStorage.setItem(
    cartKey,
    JSON.stringify(cart)
  );

  window.dispatchEvent(
    new Event("cartUpdated")
  );

  alert("Added to cart 🛒");
};



  /* ---------------- FILTER LOGIC ---------------- */
  let filteredProducts = [...products];

  // availability
  if (filters.search) {
    filteredProducts = filteredProducts.filter((p) =>
      p.name?.toLowerCase().includes(filters.search.toLowerCase())
    );
  }

  if (filters.availability === "inStock") {
  filteredProducts = filteredProducts.filter(
    p => p.stockquantity > 0
  );
}

if (filters.availability === "outStock") {
  filteredProducts = filteredProducts.filter(
    p => p.stockquantity <= 0
  );
}
  if (filters.category !== "All") {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.category?.toLowerCase() === filters.category.toLowerCase()
    );
  }
  // price filter
  filteredProducts = filteredProducts.filter(p => {
    return (
      ( filters.minPrice === "" || p.price >= Number(filters.minPrice)) &&
      ( filters.maxPrice === "" || p.price <= Number(filters.maxPrice))
    );
  });

  // sorting
  if (filters.sort === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (filters.sort === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (filters.sort === "az") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (filters.sort === "za") {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
  }

  /* -------- PAGINATION -------- */
  const lastIndex = currentPage * productsPerPage;
  const firstIndex = lastIndex - productsPerPage;

  const currentProducts = filteredProducts.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
   <div>

   
    <div className="max-w-7xl mx-auto mt-16 px-4 ">

      {/* 🔥 FILTER BAR */}
      {/* 🔥 FILTER BAR (NECKLACE STYLE) */}
      {/* 🔥 FILTER BAR (UPDATED) */}
      <DesktopFilter
  filters={filters}
  setFilters={setFilters}
  categories={categories}
  totalProducts={filteredProducts.length}
/>
      <MobileFilter

filters={filters}

setFilters={setFilters}

categories={categories}

totalProducts={
filteredProducts.length
}

/>
     
      {/* PRODUCT GRID */}
     <div
  className="max-w-7xl mx-auto grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-8 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-12 2xl:grid-cols-5"
>

        {currentProducts.map((item) => (

          <div
            key={item._id}
           className="catalog-product-card group"
          >

           {(item.soldOut || item.stockquantity <= 0) && (
  <span
     className="
  absolute
  left-3
  top-[120px]
  md:left-5
  md:top-[190px]
  bg-red-600
  text-white
  text-[10px]
  md:text-sm
  px-3
  py-1
  rounded-full
  z-20
"
  >
    Sold Out
  </span>
)}

            

            <Link to={`/product/stone/${item._id}`} >
             <div
  className="
    absolute
    left-[-10px]
    right-[-10px]
    top-[-1px]
    bottom-[-1px]
    bg-white
    border
    border-[#dfe3e3]
    transition-all
    duration-200
    ease-out
    group-hover:bottom-[-10px]
    group-hover:shadow-[0_4px_15px_rgba(0,0,0,0.15)]
  "
/>
              <div className="catalog-product-card__image">
                     <div
                className="
                  absolute
                  right-0
                  top-0
                  z-30
                  flex
                  h-[64px]
                  items-center
                  justify-between
                  px-[30px]
                "
              >

  
                {/* COMPARE */}

                <button
                  type="button"
                  title="Compare product"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="
                    flex
                    h-[25px]
                    w-[25px]
                    items-right 
                    justify-right
                    border-0
                    bg-transparent
                    p-0
                    text-[#303030]
                  "
                >
                  <FaBalanceScale
                    className="
                      h-[21px]
                      w-[21px]
                    "
                  />
                </button>

              </div>
                <div
                className="
                  absolute
                  left-[17px]
                  right-[17px]
                  top-[30px]
                  h-[160px]
                  overflow-hidden
                "
              >

                <div
                  className="
                    relative
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center
                    bg-white
                  "
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="
                      h-full
                      w-full
                      object-contain
                      object-center
                      transition-transform
                      duration-300
                      ease-out
                      group-hover:scale-[1.02]
                    "
                  />

                </div>

              </div>
              </div>
            </Link>

             <div
                className="
                  absolute
                  left-0
                  right-0
                  top-[240px]
                  flex
                  flex-col
                  items-center
                  px-[20px]
                  text-center
                "
              >

                {/* PRODUCT NAME */}

                <h3
                  className="
                    m-0
                    flex
                    w-full
                    items-center
                    justify-center
                    overflow-hidden
                    text-center
                    text-[17px]
                    font-medium
                    text-[#111]
                    transition-colors
                    duration-200
                    group-hover:text-[#6c5631]
                  "
                >
                  <span className="line-clamp-2">
                    {item.name} - {item.weight}crt
                  </span>
                </h3>

                {/* USD */}

                <p
                  className="
                    m-0
                    flex
                    h-[34px]
                    w-full
                    items-center
                    justify-center
                    text-[23px]
                    font-semibold
                    leading-[34px]
                    text-[#111]
                  "
                >
                  {formatUsd(item.price)}
                </p>


                {/* PKR */}

                <p
                  className="
                    m-0
                    flex
                    h-[25px]
                    w-full
                    items-center
                    justify-center
                    gap-[5px]
                    text-[15px]
                    font-normal
                    leading-[25px]
                    text-[#333]
                  "
                >

                  {formatPkr(item.price)}

                  <span
                    className="
                      flex
                      h-[15px]
                      w-[15px]
                      items-center
                      justify-center
                      rounded-full
                      bg-[#282828]
                      text-[10px]
                      font-bold
                      text-white
                    "
                  >
                    ?
                  </span>

                </p>


                {/* ==================================================
                    VIEW DETAILS
                    HIDDEN -> VISIBLE ON HOVER
                ================================================== */}

                <span
                  className="
                    mt-[10px]
                    flex
                    h-[40px]
                    w-full
                    items-center
                    justify-center
                    border
                    border-[#333]
                    bg-white
                    text-[15px]
                    font-medium
                    uppercase
                    text-[#111]
                    opacity-0
                    invisible
                    translate-y-[6px]
                    transition-all
                    text-black
                    hover:bg-black
                    hover:text-white
                    duration-200
                    ease-out
                    group-hover:visible
                    group-hover:translate-y-0
                    group-hover:opacity-100
                  "
                >
                  VIEW DETAILS
                </span>

              </div>

          </div>

        ))}

      </div>

     
    </div>
    {/* ============================================================
    PAGINATION
============================================================ */}

{totalPages > 1 && (
  <div className="relative mt-16 w-full border-y border-[#e5e5e5]">

    <div className="flex h-[76px] items-center justify-center">

      <div className="flex items-center">

        {/* PAGE NUMBERS */}

        {(() => {
          const pages = [];

          // Show first pages
          if (totalPages <= 7) {
            for (let page = 1; page <= totalPages; page++) {
              pages.push(
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
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
                    font-normal
                    text-[#111]
                    transition-colors
                    duration-200
                    hover:text-[#666]

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

            /*
              ====================================================
              LARGE NUMBER OF PAGES

              Example:

              1  2  3  4  5  6  7  ...  14
              ====================================================
            */

            const addPage = (page) => {
              pages.push(
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
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
                    font-normal
                    text-[#111]
                    transition-colors
                    duration-200
                    hover:text-[#666]

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

            // First 7 pages
            for (let page = 1; page <= 7; page++) {
              addPage(page);
            }

            // Ellipsis
            pages.push(
              <span
                key="ellipsis"
                className="
                  mx-[8px]
                  flex
                  h-[35px]
                  items-center
                  text-[16px]
                  text-[#222]
                "
              >
                ...
              </span>
            );

            // Last page
            addPage(totalPages);
          }

          return pages;
        })()}


        {/* ======================================================
            DIVIDER
        ====================================================== */}

        <span
          className="
            mx-[16px]
            h-[30px]
            w-px
            bg-[#d8d8d8]
          "
        />


        {/* ======================================================
            NEXT
        ====================================================== */}

        <button
          type="button"
          onClick={() =>
            setCurrentPage((prev) =>
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
            transition-opacity
            duration-200
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
}

export default Stone;
