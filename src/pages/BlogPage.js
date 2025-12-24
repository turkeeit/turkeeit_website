import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { HOST } from "../utils/host";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${HOST}/api/blogs`)
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((err) => console.log("Blog fetch error", err));
  }, []);

  return (
    <>
      <Header />
      <div className="container py-4">
        <h3 className="fw-bold mb-4">Our Blogs</h3>
        <div className="row">
          {blogs.map((b) => (
            <div className="col-md-4 mb-3" key={b.id}>
              <div
                className="card p-3 shadow-sm rounded-4"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/blog-details/" + b.id)}
              >
                <h5>{b.title}</h5>
                <p className="text-muted">{b.description}</p>
                <small className="text-primary">{b.city}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
