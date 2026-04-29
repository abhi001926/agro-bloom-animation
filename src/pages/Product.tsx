import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function Product() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  /* 🔥 FETCH */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(data);
    });

    return () => unsub();
  }, []);

  /* 🔍 FILTER */
  const filterData = (data) => {
    return data.filter((item) => {
      const matchSearch = (item.pName || "")
        .toLowerCase()
        .includes(search.toLowerCase());

      const type = item.isRental ? "lease" : "sale";

      const matchFilter =
        filterType === "all" || type === filterType;

      return matchSearch && matchFilter;
    });
  };

  /* 📊 TAB DATA */
  const getData = () => {
    if (activeTab === "products") {
      return filterData(
        products.filter((p) => p.status !== "rejected")
      );
    }

    if (activeTab === "rejected") {
      return filterData(
        products.filter((p) => p.status === "rejected")
      );
    }
  };

  /* ✅ APPROVE */
  const approve = async (item) => {
    try {
      await updateDoc(doc(db, "products", item.id), {
        isVerified: true,
        status: "approved",
      });
    } catch (e) {
      console.error(e);
    }
  };

  /* ❌ REJECT */
  const reject = async (item) => {
    try {
      await updateDoc(doc(db, "products", item.id), {
        status: "rejected",
      });
    } catch (e) {
      console.error(e);
    }
  };

  /* 🧩 CARD */
  const renderCard = (item) => {
    const type = item.isRental ? "lease" : "sale";

    return (
      <div
        key={item.id}
        onClick={() => setSelectedProduct(item)}
        className="bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 hover:shadow-xl transition cursor-pointer"
      >
        <img
          src={
            item.pImage && item.pImage.startsWith("http")
              ? item.pImage
              : "https://via.placeholder.com/300"
          }
          className="w-full h-40 object-cover"
        />

        <div className="p-4">
          <h3 className="text-lg font-semibold">
            {item.pName}
          </h3>

          <p className="text-sm text-gray-500">
            {item.pDesc
              ? item.pDesc.slice(0, 60) + "..."
              : "No description"}
          </p>

          <p className="font-bold mt-2">
            ₹{item.pPrice} {item.pUnit}
          </p>

          <span
            className={`inline-block px-2 py-1 text-xs rounded mt-2 ${
              type === "lease"
                ? "bg-yellow-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {type}
          </span>

          {/* 🔥 APPROVE / REJECT BUTTON */}
          {item.status !== "rejected" && !item.isVerified && (
            <div
              className="mt-3 flex gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={() => approve(item)}
              >
                Approve
              </button>

              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => reject(item)}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        🌾 Digital Krishi - Products
      </h2>

      {/* SEARCH + FILTER */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search product..."
          className="border p-2 rounded w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All</option>
          <option value="sale">Sale</option>
          <option value="lease">Lease</option>
        </select>
      </div>

      {/* TABS */}
      <div className="flex gap-4 mb-6">
        {["products", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg ${
              activeTab === tab
                ? "bg-green-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getData().map((item) => renderCard(item))}
      </div>

      {/* MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md rounded-xl p-4 relative">

            <button
              className="absolute top-2 right-3 text-xl"
              onClick={() => setSelectedProduct(null)}
            >
              ❌
            </button>

            <img
              src={selectedProduct.imageUrl || "https://via.placeholder.com/300"}
              className="w-full h-48 object-cover rounded-lg"
            />

            <h2 className="text-lg font-bold mt-2">
              {selectedProduct.pName}
            </h2>

            <p className="text-gray-600 mt-2">
              {selectedProduct.pDesc}
            </p>

            <p className="font-bold mt-2">
              ₹{selectedProduct.pPrice} {selectedProduct.pUnit}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}