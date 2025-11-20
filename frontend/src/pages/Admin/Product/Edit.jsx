import React, { useState, useEffect } from "react";
import ProductForm from "../../../components/ProductForm";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPath";
import toast from "react-hot-toast";

const Edit = ({ isOpen, onClose, productData, isEdit }) => {
  const [formData, setFormData] = useState(productData || {});

  useEffect(() => {
    setFormData(productData || {});
  }, [productData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("price") || name.includes("stock") || name.includes("unit") ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(API_PATHS.PRODUCT.UPDATE_PRODUCT(productData.id), formData);
      toast.success("Produk berhasil diubah!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengubah produk.");
    }
  };

  if (!isOpen || !productData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow w-[400px] max-h-[90vh]">
        <div className="p-3 border-b border-gray-500 text-lg text-gray-800 font-semibold flex justify-between items-center">
          Form Barang
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
            ×
          </button>
        </div>
        <ProductForm formData={formData} onChange={handleChange} onSubmit={handleSubmit} onCancel={onClose} isEdit={isEdit} />
      </div>
    </div>
  );
};

export default Edit;
