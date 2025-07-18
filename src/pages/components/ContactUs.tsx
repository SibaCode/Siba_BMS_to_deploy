import { useBusinessInfo } from "@/pages/components/BusinessInfoContext";

const ContactUs = () => {
  const info = useBusinessInfo();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <p className="text-lg mb-4">We'd love to hear from you! Feel free to reach out via the details below:</p>
      <ul className="text-lg space-y-3">
        <li><strong>Email:</strong> {info?.email || "Loading..."}</li>
        <li><strong>Phone:</strong> {info?.phone || "Loading..."}</li>
        <li><strong>Location:</strong> {info?.location || "Loading..."}</li>
        <li><strong>Operating Hours:</strong> {info?.hours || "Loading..."}</li>
      </ul>
    </div>
  );
};

export default ContactUs;
