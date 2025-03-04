function Hero() {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center text-center  bg-[#0F1117] px-6">
        <h1 className="text-white text-6xl md:text-7xl font-bold leading-tight">
          Welcome To <span className="text-purple-500">Shreedeep Hostel</span>
        </h1>
        <p className="text-gray-400 py-6 font-medium text-lg md:text-xl max-w-2xl">
          Experience comfortable living with modern amenities and a secure
          environment. Your home away from home.
        </p>
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold text-lg">
          Explore Now
        </button>
      </div>
    );
  }
  
  export default Hero;
  