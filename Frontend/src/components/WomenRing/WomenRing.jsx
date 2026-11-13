import { useEffect, useState, useMemo } from "react";
import { FaBalanceScale } from "react-icons/fa";
import { useNavigate, useLocation, Link } from "react-router-dom";
import MobileFilter from "../filters/MobileFilter";
import { formatPkr, formatUsd } from "../../lib/currency";
import DesktopFilter from "../filters/DesktopFilter";
import ProductPagination from "../common/ProductPagination";
import { apiUrl, assetUrl } from "../../lib/api";

const WomenRing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
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
    ...new Set(products.map((item) => item.category).filter(Boolean)),
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromURL = params.get("category");

    if (categoryFromURL) {
      setFilters((prev) => ({
        ...prev,
        category: categoryFromURL
      }));
    }
  }, [location.search]);
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

  /* 🔥 LISTEN GLOBAL WISHLIST */
  useEffect(() => {
   const handleUpdate = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    setWishlist([]);
    return;
  }

  const wishlistKey = `wishlist_${user._id}`;

  const stored =
    JSON.parse(localStorage.getItem(wishlistKey)) || [];

  setWishlist(stored);
};
    window.addEventListener("wishlistUpdated", handleUpdate);
    return () => window.removeEventListener("wishlistUpdated", handleUpdate);
  }, []);



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch(apiUrl("/api/womenrings"));
        const json = await res.json();

        const data = Array.isArray(json)
          ? json
          : Array.isArray(json.data)
            ? json.data
            : Array.isArray(json.womenrings)
              ? json.womenrings
              : [];

        if (!res.ok) {
          throw new Error(json.message || "Failed to load rings");
        }

        setProducts(data);
      } catch (err) {
        setError("Failed to load rings");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  /* 🔥 FAST WISHLIST LOOKUP */
  const wishlistIds = useMemo(() => {
    return new Set(wishlist.map((item) => item._id));
  }, [wishlist]);

  /* ================= FILTER ================= */
  let filteredProducts = [...products];

  if (filters.search) {
    filteredProducts = filteredProducts.filter((p) =>
      p.name?.toLowerCase().includes(filters.search.toLowerCase())
    );
  }

  if (filters.availability === "inStock") {
    filteredProducts = filteredProducts.filter((p) => p.stockquantity > 0);
  } else if (filters.availability === "outStock") {
    filteredProducts = filteredProducts.filter((p) => p.stockquantity <= 0);
  }

  if (filters.category !== "All") {
    filteredProducts = filteredProducts.filter(
      (p) => p.category?.toLowerCase() === filters.category.toLowerCase()
    );
  }

  filteredProducts = filteredProducts.filter((p) => {
    return (
      (filters.minPrice === "" || p.price >= Number(filters.minPrice)) &&
      (filters.maxPrice === "" || p.price <= Number(filters.maxPrice))
    );
  });

  if (filters.sort === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (filters.sort === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (filters.sort === "az") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (filters.sort === "za") {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
  }

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  /* ================= CART ================= */
  const addToCart = (product) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Please login first");
    navigate("/login");
    return;
  }

  const cartKey = `cart_${user._id}`;

  let cart =
    JSON.parse(localStorage.getItem(cartKey)) || [];

  const existingIndex = cart.findIndex(
    (item) => item._id === product._id
  );

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
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



        {currentProducts.map((product) => (

          <div
            key={product._id}
              className="catalog-product-card group"
          >

            {/* IMAGE */}
            
             <Link
  to={`/product/womenrings/${product._id}`}
>
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

    {/* SOLD OUT */}
    {(product.soldOut || product.stockquantity <= 0) && (
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
        Sold out
      </span>
    )}
    <div className="catalog-product-card__frame">
 <img
                    src={assetUrl(product.image)}
                    alt={product.name}
                      className="catalog-product-card__product-image"
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
                  ">
                {product.name}
              </h3>
              <p   className="
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
                {formatUsd(product.price)}
              </p>
              <p className="catalog-product-card__pkr-price">{formatPkr(product.price)}</p>
              <Link to={`/product/womenrings/${product._id}`} state={{ item: product }}  className="
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

export default WomenRing;
