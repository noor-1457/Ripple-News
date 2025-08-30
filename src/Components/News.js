import React, { useEffect, useState } from "react";
import Newscomponent from "./Newscomponent"; // Component for displaying individual news cards
import Spinner from "./Spinner"; // Spinner component for showing loading animation
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component"; // Library for infinite scrolling

const News = (props) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Helper function to capitalize first letter of category
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // ✅ Helper function to remove duplicates by URL
  const removeDuplicates = (news) => {
    const seen = new Set();
    return news.filter((news) => {
      if (seen.has(news.url)) {
        return false;
      }
      seen.add(news.url);
      return true;
    });
  };

  // Function to fetch data for the first time
  const update = async () => {
    props.setProgress(10);
    const url = `https://api.worldnewsapi.com/search-news?api-key=28346d4af8ee4b9a8da7473e060c74e0&text=${
      props.category
    }&source-country=PK&number=${props.pageSize}&offset=${
      page * props.pageSize
    }`;
    setLoading(true); // Show spinner
    let data = await fetch(url); // Fetch data from API
    props.setProgress(30);
    let parsedData = await data.json(); // Convert response to JSON
    props.setProgress(70);
    // ✅ remove duplicates
    setNews(removeDuplicates(parsedData.news));
    console.log(parsedData);
    setNews(parsedData.news);
    setTotalResults(parsedData.available);
    setLoading(false);
    props.setProgress(100);
    console.log("pehle load ho gaya"); // Debug log
  };

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)}-RippleNews`;
    update();
  }, []);

  const fetchMoreData = async () => {
    // API call with updated page
    const url = `https://api.worldnewsapi.com/search-news?api-key=28346d4af8ee4b9a8da7473e060c74e0&text=${
      props.category
    }&source-country=PK&number=${props.pageSize}&offset=${
      page * props.pageSize
    }`;

    setPage(page + 1);
    let data = await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData);

    // ✅ append new + remove duplicates
    setNews((prevNews) => removeDuplicates([...prevNews, ...parsedData.news]));

    setTotalResults(parsedData.available);
    setLoading(false);
    console.log("dusra load ho gaya"); // Debug log
  };

  return (
    <div>
      <div className="container my-3">
        {/* Page Heading */}
        <h1
          className="text-center "
          style={{ margin: "40px 0px", marginTop: "90px" }}
        >
          Ripple News Top {capitalizeFirstLetter(props.category)}
          Headlines
        </h1>

        {/* Show spinner only when loading */}
        {loading && <Spinner />}

        {/* Infinite Scroll wrapper */}
        <InfiniteScroll
          dataLength={news.length} // Current number of news
          next={fetchMoreData} // Function to call for more data
          hasMore={news.length < news.length == 0} // Stop when all news loaded
          loader={news.length < news.length === 0 && <Spinner />} // Show spinner while fetching new data
        >
          <div className="container">
            <div className="row">
              {/* Render news cards only when not loading */}
              {!loading &&
                news.map((element) => {
                  return (
                    <div className="col-md-4" key={element.url}>
                      <Newscomponent
                        title={element.title ? element.title : "No Title"} // News title
                        description={element.summary.slice(0, 100)} // News summary
                        imgUrl={element.image} // Image
                        newsUrl={element.url} // News link
                        author={element.author} // News author
                        date={element.publish_date} // Publish date
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};
// Default props in case parent component doesn’t provide these values
News.defaultProps = {
  pageSize: 20, // Number of news per page
  category: "general", // Default category
  author: "Unknown", // Default author if missing
  date: "1/1/2025", // Default date if missing
  totalResults: 0, // Initially no results
};

// Type-checking for props
News.propTypes = {
  pageSize: PropTypes.number,
  category: PropTypes.string,
  author: PropTypes.string,
  date: PropTypes.number,
};

export default News;
