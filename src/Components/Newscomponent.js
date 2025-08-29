import React from "react";

const Newscomponent = (props) => {
  let { title, description, imgUrl, newsUrl, author, date } = props;
  return (
    <div>
      <div className="card  card news-card shadow p-3 mb-5 border-0 rounded">
        <img
          src={
            imgUrl
              ? imgUrl
              : "https://images.freeimages.com/images/large-previews/9a5/newspapers-1-1315378.jpg?fmt=webp&w=500"
          }
          className="card-img-top"
          alt="..."
        />
        <div className="card-body">
          <h5 className="card-title">{title}...</h5>
          <p className="card-text">{description}...</p>
          <p className="card-text">
            <small className="text-body-secondary">
              By {author ? author : "Unknown"} on {new Date(date).toGMTString()}
            </small>
          </p>
          <a href={newsUrl} target="blank" className="btn btn-dark btn-sm">
            Read More
          </a>
        </div>
      </div>
    </div>
  );
};

export default Newscomponent;
