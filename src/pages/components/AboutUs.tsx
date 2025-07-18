import { useBusinessInfo } from "@/pages/components/BusinessInfoContext";

const AboutUs = () => {
  const { businessInfo, loading } = useBusinessInfo();
  console.log(businessInfo)
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-6">
        About {businessInfo?.name}
      </h1>
      <p className="text-lg mb-4">
        {businessInfo?.description}
      </p>
      {/* <p className="text-lg mb-4">
        {businessInfo?.mission ||
          "Our mission is to provide beautiful, functional items that reflect African elegance and creativity. Each product is made with care and detail to ensure customer satisfaction."}
      </p> */}
      {/* <p className="text-lg">
        {businessInfo?.vision ||
          "Whether you're looking for a thoughtful gift or something to brighten your daily routine, we've got you covered."}
      </p> */}
    </div>
  );
};

export default AboutUs;
