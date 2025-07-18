import { useBusinessInfo } from "@/pages/components/BusinessInfoContext";

const AboutUs = () => {
  const info = useBusinessInfo();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-6">
        About {info?.name}
      </h1>
      <p className="text-lg mb-4">
        {info?.description}
      </p>
      {/* <p className="text-lg mb-4">
        {info?.mission ||
          "Our mission is to provide beautiful, functional items that reflect African elegance and creativity. Each product is made with care and detail to ensure customer satisfaction."}
      </p> */}
      {/* <p className="text-lg">
        {info?.vision ||
          "Whether you're looking for a thoughtful gift or something to brighten your daily routine, we've got you covered."}
      </p> */}
    </div>
  );
};

export default AboutUs;
