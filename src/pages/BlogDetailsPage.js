import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { HOST } from "../utils/host";

export default function BlogDetailsPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetch(`${HOST}/api/blogs/` + id)
      .then((res) => {
        if (!res.ok) throw new Error("Blog not found");
        return res.json();
      })
      .then((data) => setBlog(data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!blog) return <p className="text-center mt-5">Loading...</p>;

  return (
    <>
      <Header />
      <div className="container py-4">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>
    </>
  );
}
