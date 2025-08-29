import React, { Component } from "react";
import Newscomponent from "./Newscomponent"; // Component for displaying individual news cards
import { Spinner } from "./Spinner"; // Spinner component for showing loading animation
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component"; // Library for infinite scrolling

export class News extends Component {
  // Default props in case parent component doesn’t provide these values
  static defaultProps = {
    pageSize: 20, // Number of news per page
    category: "general", // Default category
    author: "Unknown", // Default author if missing
    date: "1/1/2025", // Default date if missing
    totalResults: 0, // Initially no results
  };

  // Type-checking for props
  static propTypes = {
    pageSize: PropTypes.number,
    category: PropTypes.string,
    author: PropTypes.string,
    date: PropTypes.number,
  };

  // Helper function to capitalize first letter of category
  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  constructor(props) {
    super(props); // Call parent constructor (mandatory for class components)
    this.state = {
      articles: [], // Stores fetched articles
      loading: false, // Controls spinner state
      page: 1, // Current page number
    };
    // Set dynamic document title based on category
    document.title = `${this.capitalizeFirstLetter(
      this.props.category
    )}-RippleNews`;
  }

  // Function to fetch data for the first time
  async update() {
    this.props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=pk&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true }); // Show spinner
    let data = await fetch(url); // Fetch data from API
    this.props.setProgress(30);
    let parsedData = await data.json(); // Convert response to JSON
    this.props.setProgress(70);
    console.log(parsedData);
    this.setState({
      articles: parsedData.articles, // Replace old articles with new ones
      loading: false, // Stop spinner
      totalResults: parsedData.totalResults, // Store total results for infinite scroll
    });
    this.props.setProgress(100);
    console.log("pehle load ho gaya"); // Debug log
  }

  // Lifecycle method: runs once when component mounts
  async componentDidMount() {
    this.update();
  }

  // Function to load more data when scrolling
  fetchMoreData = async () => {
    // Increase page number first, then fetch
    this.setState({ page: this.state.page + 1 }, async () => {
      const url = `https://newsapi.org/v2/top-headlines?country=pk&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
      let data = await fetch(url); // Fetch next page
      let parsedData = await data.json(); // Convert to JSON
      console.log(parsedData);
      this.setState({
        // Append new articles to the old ones
        articles: this.state.articles.concat(parsedData.articles),
        totalResults: parsedData.totalResults, // Keep updating total results
      });
    });
    console.log("dusra load ho gaya"); // Debug log
  };

  render() {
    return (
      <div>
        <div className="container my-3">
          {/* Page Heading */}
          <h1 className="text-center" style={{ margin: "40px 0px" }}>
            Ripple News Top {this.capitalizeFirstLetter(this.props.category)}
            Headlines
          </h1>

          {/* Show spinner only when loading */}
          {this.state.loading && <Spinner />}

          {/* Infinite Scroll wrapper */}
          <InfiniteScroll
            dataLength={this.state.articles.length} // Current number of articles
            next={this.fetchMoreData} // Function to call for more data
            hasMore={this.state.articles.length < this.state.totalResults} // Stop when all articles loaded
            loader={<Spinner />} // Show spinner while fetching new data
          >
            <div className="container">
              <div className="row">
                {/* Render news cards only when not loading */}
                {!this.state.loading &&
                  this.state.articles.map((element) => {
                    return (
                      <div className="col-md-4" key={element.url}>
                        <Newscomponent
                          title={element.title} // News title
                          description={element.description} // News description
                          imgUrl={element.urlToImage} // Image
                          newsUrl={element.url} // News link
                          author={element.author} // News author
                          date={element.publishedAt} // Publish date
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
  }
}

export default News;
