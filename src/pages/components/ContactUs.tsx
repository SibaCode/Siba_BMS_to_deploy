import { useBusinessInfo } from "@/pages/components/BusinessInfoContext";

const ContactUs = () => {
  const { businessInfo, loading } = useBusinessInfo();
  console.log(businessInfo)
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <p className="text-lg mb-4">We'd love to hear from you! Feel free to reach out via the details below:</p>
      <ul className="text-lg space-y-3">
        <li><strong>Email:</strong> {businessInfo?.email || "Loading..."}</li>
        <li><strong>Phone:</strong> {businessInfo?.phone || "Loading..."}</li>
        <li><strong>Location:</strong> {businessInfo?.location || "Loading..."}</li>
        <li><strong>Operating Hours:</strong> {businessInfo?.hours || "Loading..."}</li>
      </ul>
    </div>
  );
};

export default ContactUs;
