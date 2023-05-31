import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import useHttpClient from '../hooks/useHttpClient';

export default function Products() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  const { sendReq } = useHttpClient();
  let componentMounted = true;

  var convertToTitleCase = (text) => {
    if(text == null) return "Uncategorized";
    const words = text.split('_');
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    const convertedText = capitalizedWords.join(' ');
    return convertedText;
  }

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const responseData = await sendReq(
        `${process.env.REACT_APP_BASE_API_URL}/products`
      );
      const uniqueArray = [...new Set(responseData.map(product => product.category))];
      if (componentMounted) {
        setData(responseData);
        setCategories(uniqueArray);
        setFilter(responseData);
        setLoading(false);
        console.log(filter);
      }
      return () => {
        componentMounted = false;
      };
    };
    getProducts();
  }, [sendReq]);

  const Loading = () => {
    return (
      <>
        <div className="col-md-3">
          <Skeleton height={350} />
        </div>

        <div className="col-md-3">
          <Skeleton height={350} />
        </div>

        <div className="col-md-3">
          <Skeleton height={350} />
        </div>
      </>
    );
  };
  const filterProduct = (cat) => {
    const updatedList = data.filter((x) => x.category === cat);
    setFilter(updatedList);
  };
  const ShowProducts = () => {
    return (
      <>
        <div className="buttons d-flex justify-content-center pb-4">
          <button
            className="btn btn-sm btn-outline-dark me-2"
            onClick={() => setFilter(data)}
          >
            All
          </button>
          {categories.map((category) => {
            return category == null ? (<></>) : (
              <>
                <button
                  className="btn btn-outline-dark me-2"
                  onClick={() => filterProduct(category)}
                >
                  {convertToTitleCase(category)}
                </button>
              </>
            )
          })}
        </div>
        {filter.map((product) => {
          return (
            <>
              <div className="col-md-2 mb-3" key={product.id}>
                <div className="card h-100 pt-1 text-center" key={product.id}>
                  <img
                    src={product.imageUrl}
                    height="180px"
                    className="card-img-top"
                    alt={product.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title mb-0">
                      {product.name}
                    </h5>
                    <p className="card-text lead fw-bold">${product.price}</p>
                    <NavLink
                      to={`/products/${product.id}`}
                      className="btn btn-sm btn-outline-dark"
                    >
                      Buy Now
                    </NavLink>
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </>
    );
  };

  return (
    <>
      <div className="container my-5 py-5 mt-0">
        {/* <div className="row">
          <div className="col-12 mb-5">
            <h1 className="display-6 fw-bolder text-center">Latest Products</h1>
            <hr />
          </div>
        </div> */}
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
}
