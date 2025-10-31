import { Link } from "react-router-dom";

const BrowseByStyle = () => {
  const styles = [
    {
      title: "Casual",
      image: "/src/assets/Casual.jpeg",
      position: "top-left"
    },
    {
      title: "Formal", 
      image: "/src/assets/Formal.jpeg",
      position: "top-right"
    },
    {
      title: "Party",
      image: "/src/assets/Party.jpeg", 
      position: "bottom-left"
    },
    {
      title: "Gym",
      image: "/src/assets/Gym.jpeg",
      position: "bottom-right"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">BROWSE BY DRESS STYLE</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Casual - takes 1 column */}
          <Link to="/casual" className="glass-card rounded-3xl overflow-hidden group cursor-pointer relative block">
            <img
              src={styles[0].image}
              alt={styles[0].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <h3 className="absolute top-6 left-6 text-2xl font-bold text-white">
              {styles[0].title}
            </h3>
          </Link>

          {/* Right side - Formal takes full height */}
          <Link to="/formal" className="lg:col-span-2 glass-card rounded-3xl overflow-hidden group cursor-pointer relative block">
            <img
              src={styles[1].image}
              alt={styles[1].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <h3 className="absolute top-6 left-6 text-2xl font-bold text-white">
              {styles[1].title}
            </h3>
          </Link>

          {/* Bottom section for mobile - Party and Gym */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6 col-span-full">
            <Link to="/party" className="glass-card rounded-3xl overflow-hidden group cursor-pointer relative h-48 block">
              <img
                src={styles[2].image}
                alt={styles[2].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <h3 className="absolute top-4 left-4 text-xl font-bold text-white">
                {styles[2].title}
              </h3>
            </Link>
            <Link to="/gym" className="glass-card rounded-3xl overflow-hidden group cursor-pointer relative h-48 block">
              <img
                src={styles[3].image}
                alt={styles[3].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <h3 className="absolute top-4 left-4 text-xl font-bold text-white">
                {styles[3].title}
              </h3>
            </Link>
          </div>

          {/* Desktop layout for Party and Gym */}
          <div className="hidden lg:block lg:col-span-2 grid-cols-2 gap-6 h-72">
            <div className="grid grid-cols-2 gap-6 h-full">
              <Link to="/party" className="glass-card rounded-3xl overflow-hidden group cursor-pointer relative block">
                <img
                  src={styles[2].image}
                  alt={styles[2].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <h3 className="absolute top-6 left-6 text-2xl font-bold text-white">
                  {styles[2].title}
                </h3>
              </Link>
              <Link to="/gym" className="glass-card rounded-3xl overflow-hidden group cursor-pointer relative block">
                <img
                  src={styles[3].image}
                  alt={styles[3].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <h3 className="absolute top-6 left-6 text-2xl font-bold text-white">
                  {styles[3].title}
                </h3>
              </Link>
            </div>
          </div>
          
          <Link to="/gym" className="hidden lg:block glass-card rounded-3xl overflow-hidden group cursor-pointer relative">
            <img
              src={styles[3].image}
              alt={styles[3].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <h3 className="absolute top-6 left-6 text-2xl font-bold text-white">
              {styles[3].title}
            </h3>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BrowseByStyle;