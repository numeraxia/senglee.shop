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
