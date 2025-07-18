import { createContext, useContext, useEffect, useState } from "react";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";

const BusinessInfoContext = createContext(null);

export const useBusinessInfo = () => useContext(BusinessInfoContext);

export const BusinessInfoProvider = ({ children }) => {
  const [info, setInfo] = useState(null);
  const id = "BDPGvyvz8w0mAI8PIPjw";

  useEffect(() => {
    const fetchAllDocs = async () => {
      const snapshot = await getDocs(collection(db, "businessInfo"));
      snapshot.docs.forEach(doc => {
        console.log("Doc ID:", doc.id, "Data:", doc.data());
      });
    };
    
    fetchAllDocs();

    const fetchInfo = async () => {
      try {
        const docRef = doc(db, "businessInfo", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setInfo({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such document!");
          setInfo(null);
        }
      } catch (error) {
        console.error("Error fetching business info:", error);
        setInfo(null);
      }
    };

    fetchInfo();
  }, [id]);

  return (
<BusinessInfoContext.Provider value={{ businessInfo: info }}>
{children}
    </BusinessInfoContext.Provider>
  );
};
