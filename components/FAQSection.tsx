"use client";

import { useState } from "react";
import { FAQS } from "@/lib/data";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="faq-section" id="faq">
      <h2>Common Questions</h2>
      <div className="faq-list">
        {FAQS.map((faq, index) => (
          <div key={faq.question} className={`faq-item ${openIndex === index ? "active" : ""}`}>
            <button
              type="button"
              className="faq-toggle"
              aria-expanded={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              {faq.question}
            </button>
            <div className="faq-content">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="logo-text">BulkMart</span>
          <span className="logo-tag">Wholesale</span>
        </div>
        <div className="footer-info">
          <p>📞 011-16000099</p>
          <p>✉️ support@bulkmart.my</p>
          <p>🕐 09:00 AM - 05:00 PM</p>
        </div>
        <p className="footer-note">Invoice will be available when the order is completed.</p>
        <div className="footer-links">
          <a href="#">Terms of service</a>
          <a href="#">Privacy policy</a>
        </div>
        <p className="footer-copy">© BulkMart Sdn Bhd. All rights reserved.</p>
      </div>
    </footer>
  );
}
