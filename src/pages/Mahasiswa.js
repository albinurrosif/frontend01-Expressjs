import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const token = localStorage.getItem('token');

// ini cara instannya tanpa perlu meng set token pada setiap handle
// axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

function Mahasiswa() {
  console.log(token);
  const [mhs, setMhs] = useState([]);
  const [jrs, setJrsn] = useState([]);
  const url = 'http://localhost:3000/static/';
  useEffect(() => {
    fectData();
  }, []);
  const fectData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response1 = await axios.get('http://localhost:3000/api/mhs', { headers });
      const response2 = await axios.get('http://localhost:3000/api/jurusan', { headers });
      const data1 = response1.data.data;
      const data2 = response2.data.data;
      setMhs(data1);
      setJrsn(data2);
    } catch (error) {
      // Tangani kesalahan permintaan data
      console.error('Gagal mengambil data:', error);
    }
  };

  const [showAddModal, setShowAddModal] = useState(false); // State untuk modal penambahan
  const [showEditModal, setShowEditModal] = useState(false); // State untuk modal pengeditan

  const handleShowAddModal = () => {
    setShowAddModal(true);
    setShowEditModal(false); // Pastikan modal pengeditan ditutup saat membuka modal penambahan
  };
  const handleCloseAddModal = () => {
    setShowAddModal(false); // Menggunakan setShowAddModal
    setEditData(null);
  };

  const [nama, setNama] = useState('');
  const [nrp, setNrp] = useState('');
  const [id_jurusan, setIdJurusan] = useState('');
  const [gambar, setGambar] = useState(null);
  const [swa_foto, setSwaFoto] = useState(null);
  const [validation, setValidation] = useState({});
  const navigate = useNavigate();

  const handleNamaChange = (e) => {
    setNama(e.target.value);
  };
  const handleNrpChange = (e) => {
    setNrp(e.target.value);
  };
  const handleIdJurusanChange = (e) => {
    setIdJurusan(e.target.value);
  };
  const handleGambarChange = (e) => {
    const file = e.target.files[0];
    setGambar(file);
  };
  const handleSwaFotoChange = (e) => {
    const file = e.target.files[0];
    setSwaFoto(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('nama', nama);
    formData.append('nrp', nrp);
    formData.append('id_jurusan', id_jurusan);
    formData.append('gambar', gambar);
    formData.append('swa_foto', swa_foto);

    try {
      await axios.post('http://localhost:3000/api/mhs/store', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/mhs');
      fectData();
      setShowAddModal(false);
    } catch (error) {
      console.error('Kesalahan:', error);
      setValidation(error.response.data);
    }
  };

  // edit start
  const [editData, setEditData] = useState({
    id: null,
    nama: '',
    nrp: '',
    id_jurusan: '',
  });

  const handleClose = () => {
    setEditData(null); // Reset editData when the modal is closed
  };

  const handleShowEditModal = (data) => {
    setEditData(data); // Atur data yang akan diedit
    setShowEditModal(true); // Buka modal pengeditan
    setShowAddModal(false); // Pastikan modal penambahan ditutup saat membuka modal pengeditan
  };
  const handleCloseEditModal = () => {
    setShowEditModal(false); // Menggunakan setShowEditModal
    setEditData(null);
  };

  const handleEditDataChange = (field, value) => {
    setEditData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('id', editData.id);
    formData.append('nama', editData.nama);
    formData.append('nrp', editData.nrp);
    formData.append('id_jurusan', editData.id_jurusan);

    if (editData.gambar) {
      formData.append('gambar', editData.gambar);
    }

    if (editData.swa_foto) {
      formData.append('swa_foto', editData.swa_foto);
    }

    try {
      await axios.patch(`http://localhost:3000/api/mhs/update/${editData.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/mhs');
      fectData();
      setShowEditModal(false);
    } catch (error) {
      console.error('Kesalahan:', error);
      setValidation(error.response.data);
    }
  };

  // edit end

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3000/api/mhs/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log('Data berhasil dihapus');
        // Hapus item dari array data mhs
        const updatedMhs = mhs.filter((item) => item.id !== id);
        setMhs(updatedMhs); // Perbarui state dengan data yang sudah diperbarui
      })
      .catch((error) => {
        console.error('Gagal menghapus data:', error);
        alert('Gagal menghapus data. Silakan coba lagi atau hubungi administrator.');
      });
  };

  return (
    <Container>
      <Row>
        <Col>
          <h2>Data Mahasiswa</h2>
          <Button variant="primary" onClick={handleShowAddModal}>
            Tambah{' '}
          </Button>
        </Col>
      </Row>
      <Row>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Nama</th>
              <th scope="col">Jurusan</th>
              <th scope="col">#</th>
              <th scope="col">#</th>
              <th scope="col">#</th>
            </tr>
          </thead>
          <tbody>
            {mhs.map((mh, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>{mh.nama}</td>
                <td>{mh.jurusan}</td>
                <td>
                  <img src={url + mh.gambar} height="100" />
                </td>
                <td>
                  <img src={url + mh.swa_foto} height="100" />
                </td>
                <td>
                  {' '}
                  <button onClick={() => handleShowEditModal(mh)} className="btn btn-sm btn-info">
                    {' '}
                    Edit{' '}
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDelete(mh.id)} className="btn btn-sm btn-danger">
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Row>

      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nama:</label>
              <input type="text" className="form-control" value={nama} onChange={handleNamaChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">NRP:</label>
              <input type="text" className="form-control" value={nrp} onChange={handleNrpChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Jurusan:</label>
              <select className="form-select" value={id_jurusan} onChange={handleIdJurusanChange}>
                {jrs.map((jr) => (
                  <option key={jr.id_j} value={jr.id_j}>
                    {jr.nama_jurusan}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Gambar:</label>
              <input type="file" className="form-control" accept="image/*" onChange={handleGambarChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Swa Foto:</label>
              <input type="file" className="form-control" accept="image/*" onChange={handleSwaFotoChange} />
            </div>
            <button onClick={handleClose} type="submit" className="btn btn-primary">
              Kirim
            </button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <label className="form-label">Nama:</label>
              <input type="text" className="form-control" value={editData ? editData.nama : ''} onChange={(e) => handleEditDataChange('nama', e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">NRP:</label>
              <input type="text" className="form-control" value={editData ? editData.nrp : ''} onChange={(e) => handleEditDataChange('nrp', e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Jurusan:</label>
              <select className="form-select" value={editData ? editData.id_jurusan : ''} onChange={(e) => handleEditDataChange('id_jurusan', e.target.value)}>
                {jrs.map((jr) => (
                  <option key={jr.id_j} value={jr.id_j}>
                    {jr.nama_jurusan}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Gambar:</label>
              <input
                type="file"
                className="form-control"
                // value={editData ? editData.gambar : ''}
                accept="image/*"
                onChange={(e) => handleEditDataChange('gambar', e.target.files[0])}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Swa Foto:</label>
              <input
                type="file"
                className="form-control"
                // value={editData ? editData.swa_foto : ''}
                accept="image/*"
                onChange={(e) => handleEditDataChange('swa_foto', e.target.files[0])}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Simpan Perubahan
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Mahasiswa;
