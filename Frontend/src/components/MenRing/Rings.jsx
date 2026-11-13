import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaBalanceScale } from "react-icons/fa";
import DesktopFilter from "../filters/DesktopFilter";
import MobileFilter from "../filters/MobileFilter";
import { formatPkr, formatUsd } from "../../lib/currency";
import { apiUrl, assetUrl } from "../../lib/api";
import ProductPagination from "../common/ProductPagination";

const Rings = () => {
  const [rings, setRings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
    ...new Set(rings.map((item) => item.category).filter(Boolean)),
  ];

  useEffect(() => {
    const fetchRings = async () => {
      try {
        const res = await fetch(apiUrl("/api/menrings"));
        const json = await res.json();

        const data = Array.isArray(json)
          ? json
          : Array.isArray(json.data)
            ? json.data
            : [];

        setRings(data);
      } catch (err) {
        setError("Failed to load rings");
      } finally {
        setLoading(false);
      }
    };

    fetchRings();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const filteredProducts = useMemo(() => {
    let temp = [...rings];

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
      temp = temp.filter(
        (item) =>
          item.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.minPrice) {
      temp = temp.filter((item) => item.price >= Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      temp = temp.filter((item) => item.price <= Number(filters.maxPrice));
    }

    if (filters.sort === "low") temp.sort((a, b) => a.price - b.price);
    if (filters.sort === "high") temp.sort((a, b) => b.price - a.price);
    if (filters.sort === "az") temp.sort((a, b) => a.name.localeCompare(b.name));
    if (filters.sort === "za") temp.sort((a, b) => b.name.localeCompare(a.name));
    if (filters.sort === "newest") {
      temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return temp;
  }, [rings, filters]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const currentRings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const addToCart = (product) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login first");
      return;
    }

    const cartKey = `cart_${user._id}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const existingIndex = cart.findIndex((item) => item._id === product._id);

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
      });
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));

    window.dispatchEvent(new Event("cartUpdated"));

    alert("Added to cart 🛒");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading Rings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div>

   
    <div className="max-w-7xl mx-auto mt-16 px-4">
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

      <div className="max-w-7xl mx-auto grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-8 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-12 2xl:grid-cols-5">
        {currentRings.map((ring) => (
          <div
            key={ring._id}
            className="catalog-product-card group"
          >
            <Link to={`/product/menrings/${ring._id}`}>
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
                <div   className="
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
                {(ring.soldOut || ring.stockquantity <= 0) && (
                  <span className="absolute left-3 top-[120px] md:left-5 md:top-[190px] bg-red-600 text-white text-[10px] md:text-sm px-3 py-1 rounded-full z-20">
                    Sold Out
                  </span>
                )}

                <div className="catalog-product-card__frame">
                  <img
                    src={
                      ring.image?.startsWith("http")
                        ? ring.image
                        : assetUrl(ring.image)
                    }
                    alt={ring.name}
                    className="catalog-product-card__product-image"
                  />
                </div>
              </div>
            </Link>

            <div   className="
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
                  ">{ring.name}</h3>
              <p  className="
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
                {formatUsd(ring.price)}
              </p>
              <p className="catalog-product-card__pkr-price">{formatPkr(ring.price)}</p>
              <Link to={`/product/menrings/${ring._id}`} state={{ item: ring }}  className="
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

export default Rings;
