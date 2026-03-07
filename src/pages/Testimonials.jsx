import React from "react";
import "../styles/testimonials.css";

const testimonials = [
    {
        name: "Rahim Uddin",
        text: "I found an O- donor within 15 minutes through Donor Link.",
    },
    {
        name: "Fatima Khan",
        text: "This platform helped my father during surgery.",
    },
    {
        name: "Imran Ahmed",
        text: "Donating blood here made me feel proud to save lives.",
    },
];

export default function Testimonials() {
    return (
        <section className="testimonials">
            <h2>Lives Saved Stories</h2>

            <div className="testimonial-grid">
                {testimonials.map((t, i) => (
                    <div className="testimonial-card" key={i}>
                        <p>"{t.text}"</p>
                        <h4>- {t.name}</h4>
                    </div>
                ))}
            </div>
        </section>
    );
}