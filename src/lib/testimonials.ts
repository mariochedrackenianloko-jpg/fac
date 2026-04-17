// Static testimonials for Hero
export const testimonials = [
  { rating: 5, name: "Aminata K.", location: "Abidjan" },
  { rating: 5, name: "Fatou S.", location: "Dakar" },
  // Add more
];
export async function getTestimonials() {
  // Static or API
  return testimonials;
}
