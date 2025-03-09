import { useEffect, useState } from "react";
import axios from "axios";
import "./Edit.css";
import Dropdown from "react-bootstrap/Dropdown";
import swal from "sweetalert";
const EditAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    kelurahan: "",
    kecamatan: "",
    kabupaten: "",
    provinsi: "",
    detail: "",
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.REACT_APP_API_URL}/api/delivery-addresses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAddresses(response.data.data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        swal("Gagal memuat daftar alamat.");
      }
    };

    fetchAddresses();
  }, []);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setFormData({
      nama: address.nama,
      kelurahan: address.kelurahan,
      kecamatan: address.kecamatan,
      kabupaten: address.kabupaten,
      provinsi: address.provinsi,
      detail: address.detail,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAddress) {
      swal("Pilih alamat untuk diedit.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.REACT_APP_API_URL}/api/delivery-addresses/${
          selectedAddress._id
        }`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      swal("Good job!", "Alamat sudah diperbarui", "success");
    } catch (error) {
      console.error("Error updating address:", error);
      swal("Terjadi kesalahan saat memperbarui alamat.");
    }
  };

  const handleDelete = async () => {
    if (!selectedAddress) {
      swal("Pilih alamat yang ingin dihapus.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.REACT_APP_API_URL}/api/delivery-addresses/${
          selectedAddress._id
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      swal("Good job!", "Alamat sudah dihapus", "success");
      setAddresses((prevAddresses) =>
        prevAddresses.filter((addr) => addr._id !== selectedAddress._id)
      );
      setSelectedAddress(null);
      setFormData({
        nama: "",
        kelurahan: "",
        kecamatan: "",
        kabupaten: "",
        provinsi: "",
        detail: "",
      });
    } catch (error) {
      console.error("Error deleting address:", error);
      swal("Terjadi kesalahan saat menghapus alamat.");
    }
  };

  return (
    <div className="edit-address">
      <h4 style={{ textAlign: "center" }}>Edit Alamat</h4>
      <div>
        <Dropdown className="custom-dropdown">
          <Dropdown.Toggle id="dropdown-address" className="btn-blue">
            {selectedAddress
              ? `${selectedAddress.nama}, ${selectedAddress.kelurahan}, ${selectedAddress.kecamatan}`
              : "Pilih Alamat"}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {addresses.map((addr) => (
              <Dropdown.Item
                key={addr._id}
                onClick={() => handleAddressSelect(addr)}
              >
                {addr.nama}, {addr.kelurahan}, {addr.kecamatan}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {selectedAddress && (
        <>
          <form onSubmit={handleSubmit}>
            {Object.keys(formData).map((key) => (
              <div className="form-group" key={key}>
                <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                <input
                  type={key === "detail" ? "textarea" : "text"}
                  name={key}
                  className="form-control"
                  value={formData[key]}
                  onChange={handleInputChange}
                  required
                />
              </div>
            ))}
            <button type="submit" className="btn btn-blue">
              Simpan Perubahan
            </button>
          </form>

          <button className="btn btn-danger mt-3" onClick={handleDelete}>
            Hapus Alamat
          </button>
        </>
      )}
    </div>
  );
};

export default EditAddress;
