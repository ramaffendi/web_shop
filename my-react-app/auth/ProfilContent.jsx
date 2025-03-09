const ProfileContent = ({
  user,
  newAddress,
  onAddressChange,
  onAddressSubmit,
  onEditProfile,
}) => {
  return (
    <div className="profile-content">
      <h2>Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>

      <form onSubmit={onAddressSubmit} className="address-form mt-4">
        <h4>Tambah alamat baru</h4>
        {Object.keys(newAddress).map((field) => (
          <div key={field} className="form-group mb-3">
            <label htmlFor={field} className="form-label">
              {field.charAt(0).toUpperCase() + field.slice(1)}:
            </label>
            <input
              type="text"
              id={field}
              name={field}
              className="form-control"
              placeholder={`Masukkan ${field}`}
              value={newAddress[field]}
              onChange={onAddressChange}
            />
          </div>
        ))}

        <div className="button-group mt-3">
          <button type="submit" className="btn btn-secondary me-2">
            Tambah alamat
          </button>
          <button
            type="button"
            onClick={() => onEditProfile(user._id)}
            className="btn btn-secondary"
          >
            Edit Profile dan Alamat
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileContent;
