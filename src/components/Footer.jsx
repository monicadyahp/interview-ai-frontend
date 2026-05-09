import React from 'react';

const Footer = () => {
    return (
        <footer className="footer-new">
            <div className="footer-new__container container">
                <div className="footer-new__content">
                    <div className="footer-new__brand">
                        <h2 className="footer-new__title">Interview-AI</h2>
                        <p className="footer-new__link">Solusi cerdas persiapan karir masa depan.</p>
                    </div>
                </div>
                <div className="footer-new__bottom">
                    <p className="footer-new__copy">&#169; 2026 Interview-AI. All rights reserved.</p>
                </div>
            </div>
            <div className="footer-watermark">AI</div>
        </footer>
    );
};

export default Footer;