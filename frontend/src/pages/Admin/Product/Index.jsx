import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import DataTable from "react-data-table-component";
import { products as initialProducts } from "../../../data/productData";
import SearchInput from "../../../components/layouts/ProductSearch";
import { generateColumns } from "../Product/Column";
import Create from "../Product/Create";
import Delete from "../Product/Delete";
import Edit from "../Product/Edit";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPath";
import { FaFilter } from "react-icons/fa";

const Index = () => {
  const [data, setData] = useState(initialProducts);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchField, setSearchField] = useState("all");

  // Fetch data dari API
  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.PRODUCT.GET_PRODUCT);
      const fetchedData = Array.isArray(res?.data?.data) ? res.data.data : [];
      setData(fetchedData);
      setFilteredData(fetchedData);
    } catch (err) {
      console.error("Error fetching products:", err);
      setData([]);
      setFilteredData([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Pencarian
  useEffect(() => {
    if (!Array.isArray(data)) {
      setFilteredData([]);
      return;
    }

    const result = data.filter((product) => {
      if (searchField === "all") {
        return Object.values(product).some((val) => val?.toString().toLowerCase().includes(searchQuery.toLowerCase()));
      } else {
        const fieldValue = product[searchField];
        return fieldValue?.toString().toLowerCase().includes(searchQuery.toLowerCase());
      }
    });

    setFilteredData(result);
  }, [searchQuery, data, searchField]);

  // Hapus produk
  const handleDeleteClick = (product) => setProductToDelete(product);
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await axiosInstance.delete(API_PATHS.PRODUCT.DELETE_PRODUCT(productToDelete.id));
      setData(data.filter((item) => item.id !== productToDelete.id));
      setFilteredData(filteredData.filter((item) => item.id !== productToDelete.id));
      setProductToDelete(null);
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  // Edit
  const handleEditClick = (product) => setEditingProduct(product);

  const columns = generateColumns(Array.isArray(data) && data.length > 0 ? data[0] : {}, handleDeleteClick, handleEditClick);

  return (
    <div>
      <div className="transition-all duration-300">
        <DashboardLayout>
          <div className="p-6 min-h-full">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-white">Product</h1>
            </div>

            <div className="flex flex-col bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                {/*Pencarian */}
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden w-full max-w-md">
                  <FaFilter size={20} className="ml-2 text-gray-500" />
                  <select value={searchField} onChange={(e) => setSearchField(e.target.value)} className="p-2 text-sm border-r-2 border-gray-300 outline-none text-gray-700">
                    <option value="all">All</option>
                    <option value="sku">Kode Barang</option>
                    <option value="name">Nama</option>
                    <option value="item_name">Jenis Barang</option>
                    <option value="unit_name">Satuan</option>
                    <option value="price">Harga Beli</option>
                    <option value="price_sell">Harga Jual</option>
                  </select>
                  <div className="flex items-center px-2 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input type="text" className="w-full p-2 text-sm outline-none" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>

                {/*Add Product */}
                <button onClick={() => setIsModalOpen(true)} className="cursor-pointer bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 whitespace-nowrap">
                  + Add Product
                </button>
              </div>

              {/* Data Table Produk */}
              {Array.isArray(filteredData) && filteredData.length > 0 ? <DataTable columns={columns} data={filteredData} pagination highlightOnHover /> : <div className="text-center text-gray-500 p-4">Tidak ada data produk.</div>}
            </div>
          </div>
        </DashboardLayout>
      </div>
      <Create
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchProducts();
        }}
      />
      <Delete isOpen={!!productToDelete} onClose={() => setProductToDelete(null)} onConfirm={handleConfirmDelete} />
      <Edit
        isOpen={!!editingProduct}
        onClose={() => {
          setEditingProduct(null);
          fetchProducts();
        }}
        productData={editingProduct}
        isEdit={true}
      />
    </div>
  );
};

export default Index;
