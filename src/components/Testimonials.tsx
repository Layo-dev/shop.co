import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah M.",
      verified: true,
      rating: 5,
      review: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations."
    },
    {
      name: "Alex K.",
      verified: true,
      rating: 5,
      review: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions."
    },
    {
      name: "James L.",
      verified: true,
      rating: 5,
      review: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends."
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">OUR HAPPY CUSTOMERS</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 h-full flex flex-col">
              {/* Rating */}
              <div className="flex items-center mb-3 sm:mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      i < testimonial.rating 
                        ? "text-yellow-400 fill-current" 
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Review */}
              <p className="text-muted-foreground mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base flex-grow">
                "{testimonial.review}"
              </p>

              {/* Reviewer info */}
              <div className="flex items-center">
                <h4 className="font-semibold text-sm sm:text-base">{testimonial.name}</h4>
                {testimonial.verified && (
                  <span className="ml-2 text-green-500 text-sm">✓</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;