import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Alert, Spinner } from "react-bootstrap";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showAddReview, setShowAddReview] = useState(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(res.data);

                const reviewRes = await axios.get(`http://localhost:5000/api/reviews/${id}`);
                setReviews(reviewRes.data);
            } catch (err) {
                setError("Failed to load product details or reviews.");
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    const handleAddReview = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/auth");
                return;
            }

            await axios.post("http://localhost:5000/api/reviews/add", {
                productId: id,
                rating,
                comment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccessMessage("✅ Review added successfully!");
            setRating(1);
            setComment("");
            setShowAddReview(false);

            const res = await axios.get(`http://localhost:5000/api/reviews/${id}`);
            setReviews(res.data);
        } catch (err) {
            setError("Failed to add review. Please try again.");
        }
    };

    if (loading) return <Spinner animation="border" variant="primary" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <img 
                        src={product.image || "https://via.placeholder.com/300"} 
                        alt={product.name} 
                        className="img-fluid rounded shadow-sm" 
                    />
                </div>
                <div className="col-md-6">
                    <h2>{product.name}</h2>
                    <h4 className="text-success">${product.price}</h4>
                    <p>{product.description}</p>

                    <Button 
                        variant="primary" 
                        onClick={() => setShowAddReview(!showAddReview)}
                    >
                        {showAddReview ? "Close Review Box" : "➕ Add a Review"}
                    </Button>

                    {showAddReview && (
                        <div className="mt-3">
                            {successMessage && <Alert variant="success">{successMessage}</Alert>}

                            <div className="form-group">
                                <label>Rating (1-5)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                />
                            </div>

                            <div className="form-group mt-2">
                                <label>Comment</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                ></textarea>
                            </div>

                            <Button 
                                className="mt-3" 
                                variant="success" 
                                onClick={handleAddReview}
                            >
                                Submit Review
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-5">
                <h4>Customer Reviews</h4>
                {reviews.map((review) => (
                    <div className="card mb-3" key={review._id}>
                        <div className="card-body">
                            <h5 className="card-title">Rating: {review.rating}/5</h5>
                            <p className="card-text">{review.comment}</p>
                            <p className="text-muted">by {review.customerId.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductDetails;
