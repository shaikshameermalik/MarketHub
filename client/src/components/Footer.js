import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Footer() {
    return (
        <footer className="bg-dark text-light py-4 mt-5">
            <div className="container">
                <div className="row">

                    {/* About Section */}
                    <div className="col-md-4 mb-4">
                        <h5 className="text-warning">About MarketHub</h5>
                        <p className="text-light-50">Your one-stop destination for all your shopping needs. We offer quality products with amazing deals.</p>
                    </div>

                    {/* Quick Links */}
                    <div className="col-md-4 mb-4">
                        <h5 className="text-warning">Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><a href="/terms" className="text-light text-decoration-none">Terms & Conditions</a></li>
                            <li><a href="/privacy-policy" className="text-light text-decoration-none">Privacy Policy</a></li>
                            <li><a href="/contact-us" className="text-light text-decoration-none">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div className="col-md-4 mb-4">
                        <h5 className="text-warning">Follow Us</h5>
                        <a href="#" className="text-light me-3"><i className="bi bi-facebook"></i></a>
                        <a href="#" className="text-light me-3"><i className="bi bi-instagram"></i></a>
                        <a href="#" className="text-light me-3"><i className="bi bi-linkedin"></i></a>
                        <a href="#" className="text-light me-3"><i className="bi bi-twitter"></i></a>
                    </div>

                    {/* Newsletter Subscription */}
                    <div className="col-12">
                        <h5 className="text-warning">Subscribe to Our Newsletter</h5>
                        <form className="d-flex">
                            <input type="email" className="form-control me-2" placeholder="Enter your email" />
                            <button className="btn btn-warning">Subscribe</button>
                        </form>
                    </div>

                </div>
                <div className="text-center mt-4">
                    <p className="mb-0">&copy; 2025 MarketHub. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
