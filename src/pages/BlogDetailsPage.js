import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import { getBlogById } from "../redux/actions/blogActions";
import { useNavigate } from "react-router-dom";

export default function BlogDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { blogDetails, loading, error } = useSelector(
    (state) => state.blogsData
  );

  useEffect(() => {
    dispatch(getBlogById(id));
  }, [dispatch, id]);

  if (loading) return <p className="text-center mt-5">Loading blog...</p>;
  if (error) return <p className="text-center text-danger mt-5">{error}</p>;
  if (!blogDetails?.content) return null;

  return (
    <>
      <Header />
      <div className="container py-4">
        <button className="btn btn-light mb-3" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h4 className="fw-bold">{blogDetails.title}</h4>
        <p className="text-muted">{blogDetails.description}</p>
        <small className="text-primary">{blogDetails.city}</small>

        <hr />

        <div dangerouslySetInnerHTML={{ __html: blogDetails.content }} />
      </div>
    </>
  );
}
