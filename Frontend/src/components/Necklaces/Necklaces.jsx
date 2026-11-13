import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaBalanceScale } from "react-icons/fa";
import DesktopFilter from "../filters/DesktopFilter";
import MobileFilter from "../filters/MobileFilter";
import { formatPkr, formatUsd } from "../../lib/currency";
import { apiUrl, assetUrl } from "../../lib/api";
import ProductPagination from "../common/ProductPagination";

const Necklaces = () => {
  const [necklaces, setNecklaces] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [wishlist, setWishlist] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    availability: "all",
    sort: "default",
    minPrice: "",
    maxPrice: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const categories = [
    "All",
    ...new Set(necklaces.map((item) => item.category).filter(Boolean)),
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);
  /* ---------------- LOAD WISHLIST ---------------- */
 useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    setWishlist([]);
    return;
  }

  const wishlistKey = `wishlist_${user._id}`;

  const stored =
    JSON.parse(localStorage.getItem(wishlistKey)) || [];

  setWishlist(stored);
}, []);

  /* ---------------- CART ---------------- */
  const addToCart = (product) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Please login first");
    return;
  }

  const cartKey = `cart_${user._id}`;

  let cart =
    JSON.parse(localStorage.getItem(cartKey)) || [];

  const existing = cart.find(
    (item) => item._id === product._id
  );

  if (existing) {
    existing.quantity += 1;
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

 
  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchNecklaces = async () => {
      try {
        const res = await fetch(apiUrl("/api/necklace"));
        const json = await res.json();

        const safeArray = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
            ? json.data
            : [];

        setNecklaces(safeArray);
        setFiltered(safeArray);
      } catch (err) {
        console.error("Fetch error:", err);
        setNecklaces([]);
        setFiltered([]);
      }
    };

    fetchNecklaces();
  }, []);

  /* ---------------- FILTER & SORT ---------------- */
  const filteredProducts = useMemo(() => {
    let temp = [...necklaces];

    if (filters.search) {
      temp = temp.filter((item) =>
        item.name?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.availability === "inStock") {
      temp = temp.filter((item) => item.stockquantity > 0);
    } else if (filters.availability === "outStock") {
      temp = temp.filter((item) => item.stockquantity <= 0);
    }

    if (filters.category !== "All") {
      temp = temp.filter((item) =>
        (item.category || item.type || "")
          .toLowerCase()
          .includes(filters.category.toLowerCase())
      );
    }

    if (filters.minPrice)
      temp = temp.filter((item) => item.price >= Number(filters.minPrice));

    if (filters.maxPrice)
      temp = temp.filter((item) => item.price <= Number(filters.maxPrice));

    if (filters.sort === "low") temp.sort((a, b) => a.price - b.price);
    if (filters.sort === "high") temp.sort((a, b) => b.price - a.price);
    if (filters.sort === "az") temp.sort((a, b) => a.name.localeCompare(b.name));
    if (filters.sort === "za") temp.sort((a, b) => b.name.localeCompare(a.name));

    return temp;
  }, [necklaces, filters]);

  /* ---------------- PAGINATION LOGIC ---------------- */

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const currentNecklaces = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;


  return (
    <div>
    <div className="max-w-7xl mx-auto mt-16 px-4 ">
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
        totalProducts={filteredProducts.length}
      />

      {/* PRODUCT GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-8 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-12 2xl:grid-cols-5">
        {currentNecklaces.map((necklace) => (
          <div key={necklace._id} className="catalog-product-card group">
            {(necklace.soldOut || necklace.stockquantity <= 0) && (
              <span className="absolute left-3 top-[120px] md:left-5 md:top-[190px] bg-red-600 text-white text-[10px] md:text-sm px-3 py-1 rounded-full z-20">
                Sold out
              </span>
            )}

            <Link to={`/product/necklace/${necklace._id}`}>
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
    group-hover:bottom-[-30px]
    group-hover:shadow-[0_4px_15px_rgba(0,0,0,0.15)]
  "
/>
              <div className="catalog-product-card__image">
                <div className="
                  absolute
                  right-0
                  top-0
                  z-30
                  flex
                  h-[64px]
                  items-center
                  justify-between
                  px-[30px]
                ">
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
                <div className="catalog-product-card__frame">
                  <img
                    src={
                      necklace.image?.startsWith("http")
                        ? necklace.image
                        : assetUrl(necklace.image)
                    }
                    alt={necklace.name}
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
            </Link>

            <div  className="
                  absolute
                  left-0
                  right-0
                  top-[240px]
                  flex
                  flex-col
                  items-center
                  px-[20px]
                  text-center
                ">
              <h3  className="
                    m-0
                    flex
                    h-[48px]
                    w-full
                    items-center
                    justify-center
                    overflow-hidden
                    text-center
                    text-[17px]
                    font-medium
                    leading-[22px]
                    text-[#111]
                    transition-colors
                    duration-200
                    group-hover:text-[#6c5631]
                  ">
                {necklace.name.split(" ").slice(0, 3).join(" ")}-{necklace.stoneWeight}{necklace.weightUnit}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                <span className="font-bold text-black">Beadsize - </span>{necklace.beadSize}
              </p>
              <div className="flex gap-2 items-start">
                <span className="
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
                  ">
                   {formatUsd(necklace.price)}
                </span>
              </div>
              <p className="catalog-product-card__pkr-price">{formatPkr(necklace.price)}</p>
              <Link to={`/product/necklace/${necklace._id}`} state={{ item: necklace }}  className="
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
                    duration-200
                    ease-out
                    group-hover:visible
                    group-hover:translate-y-0
                    group-hover:opacity-100
                  ">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      
    </div>
    <ProductPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Necklaces;

