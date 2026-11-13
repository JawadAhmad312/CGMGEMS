import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBalanceScale, FaHeart } from "react-icons/fa";
import { formatPkr, formatUsd } from "../../lib/currency";

function Card() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/stone");

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await res.json();
        setListings(data);
      } catch (err) {
        console.error(
          "Unable to load featured stones:",
          err.message
        );
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="mt-10 grid grid-cols-2 gap-5 sm:gap-8 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-12 2xl:grid-cols-5">

      {listings
        .filter((item) => item.stockquantity > 0)
        .slice(0, 5)
        .map((item) => (

          <Link
            key={item._id}
            to={`/product/stone/${item._id}`}
            state={{ item }}
           className="
  group
  relative
  block
  h-[360px]
  w-full
  overflow-visible
  border
  border-[#dfe3e3]
  bg-white
  no-underline
  transition-all
  duration-200
  ease-in-out
  hover:z-50
  
"
          >

            {/* ==================================================
                HOVER CARD BACKGROUND
            ================================================== */}

           <div className="
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
    group-hover:bottom-[-50px]
    group-hover:shadow-[0_4px_15px_rgba(0,0,0,0.15)]
  "
/>

            <div className="relative z-10 h-full w-full">

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


              {/* ==================================================
                  IMAGE AREA
              ================================================== */}

              <div
                className="
                  absolute
                  left-[17px]
                  right-[17px]
                  top-[20px]
                  h-[220px]
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


              {/* ==================================================
                  PRODUCT INFORMATION
              ================================================== */}

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

          </Link>

        ))}

    </div>
  );
}

export default Card;