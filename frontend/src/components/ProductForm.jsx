import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import AddCategory from "../pages/Admin/Product/AddCategory";
import AddUnit from "../pages/Admin/Product/AddUnit";

const ProductForm = ({ formData, onChange, onSubmit, onCancel, isEdit }) => {
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [openUnitModal, setOpenUnitModal] = useState(false);
  const profit = (formData.price_sell || 0) - (formData.price || 0);

  const formatRupiah = (angka) => {
    if (!angka) return "";
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseRupiah = (value) => {
    return parseInt(value.replace(/[^\d]/g, "")) || 0;
  };

  useEffect(() => {
    axiosInstance.get(API_PATHS.CATEGORY.GET_CATEGORY).then((res) => setCategories(res.data.data));
    axiosInstance.get(API_PATHS.UNIT.GET_UNIT).then((res) => setUnits(res.data.data));
  }, [openCategoryModal, openUnitModal]);

  return (
    <>
      <form onSubmit={onSubmit} className="p-4 space-y-3">
        <div className="flex flex-col">
          <label className="text-sm font-normal">Kode Barang</label>
          <input name="sku" value={formData.sku} onChange={onChange} className="bg-gray-50 text-gray-500 text-sm p-3 rounded-lg focus:outline-gray-500" placeholder="Masukan Kode Barang Anda" required />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-normal">Nama Barang</label>
          <input name="name" value={formData.name} onChange={onChange} className="bg-gray-50 text-gray-500 text-sm p-3 rounded-lg focus:outline-gray-500" placeholder="Masukan Nama Barang Anda" required />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-normal">Jenis Barang</label>
          <div className="flex gap-2">
            <select name="item_id" value={formData.item_id} onChange={onChange} className="bg-gray-50 text-gray-500 w-full text-sm p-3 rounded-lg focus:outline-gray-500" required>
              <option disabled value="">
                Pilih Jenis Barang
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => setOpenCategoryModal(true)} className="text-xl text-gray-800 bg-gray-50 py-2 px-4 rounded-lg hover:bg-gray-200">
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-normal">Satuan</label>
          <div className="flex gap-2">
            <select name="unit_id" value={formData.unit_id} onChange={onChange} className="bg-gray-50 text-gray-500 w-full text-sm p-3 rounded-lg focus:outline-gray-500" required>
              <option disabled value="">
                Pilih Satuan Barang
              </option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => setOpenUnitModal(true)} className="text-xl text-gray-800 bg-gray-50 py-2 px-4 rounded-lg hover:bg-gray-200">
              +
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <label className="text-sm font-normal">Stok Barang</label>
            <input type="number" name="stock" value={formData.stock || ""} onChange={onChange} className="bg-gray-50 text-gray-500 text-sm p-3 rounded-lg focus:outline-gray-500" placeholder="0" required disabled={isEdit} />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-normal">Harga Beli</label>
            <input
              name="price"
              value={`Rp. ${formatRupiah(formData.price || 0)}`}
              onChange={(e) =>
                onChange({
                  target: {
                    name: "price",
                    value: parseRupiah(e.target.value),
                  },
                })
              }
              className="bg-gray-50 text-gray-500 text-sm p-3 rounded-lg focus:outline-gray-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-normal">Harga Jual</label>
            <input
              name="price_sell"
              value={`Rp. ${formatRupiah(formData.price_sell || 0)}`}
              onChange={(e) =>
                onChange({
                  target: {
                    name: "price_sell",
                    value: parseRupiah(e.target.value),
                  },
                })
              }
              className="bg-gray-50 text-gray-500 text-sm p-3 rounded-lg focus:outline-gray-500"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-normal">Profit</label>
            <input value={`Rp. ${formatRupiah(profit)}`} readOnly className="bg-gray-50 text-gray-500 text-sm p-3 rounded-lg focus:outline-gray-500" required />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-normal">Stok Minimal</label>
          <input type="number" name="min_stock" value={formData.min_stock || ""} onChange={onChange} className="bg-gray-50 text-gray-500 text-sm p-3 rounded-lg focus:outline-gray-500" placeholder="0" required />
        </div>

        {/* <div className="flex flex-col">
          <label className="text-sm font-normal">Tanggal Expired</label>
          <input type="date" name="expired_date" value={formData.expired_date || ""} onChange={onChange} className="bg-gray-50 text-gray-500 text-sm p-3 rounded-lg focus:outline-gray-500" />
        </div> */}

        <div className="flex justify-between gap-4 mt-4">
          <button type="button" onClick={onCancel} className="px-4 w-full py-2 border rounded-md hover:bg-gray-100 cursor-pointer">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 w-full bg-indigo-500 text-white rounded-md hover:bg-indigo-600 cursor-pointer">
            Save
          </button>
        </div>
      </form>

      <AddCategory isOpen={openCategoryModal} onClose={() => setOpenCategoryModal(false)} />
      <AddUnit isOpen={openUnitModal} onClose={() => setOpenUnitModal(false)} />
    </>
  );
};

export default ProductForm;
