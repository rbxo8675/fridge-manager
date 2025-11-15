import { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [items, setItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    qty: 1,
    type: '',
    status: '',
    buy: '',
    expire: '',
    price: 0,
    note: ''
  });

  // MockAPI.io endpoint - user로 변경
  const API_URL = "https://6915287784e8bd126af8d6f6.mockapi.io/user";

  // 페이지 로드 시 데이터 가져오기
  useEffect(() => {
    fetchItems();
  }, []);

  // READ - 항목 목록 가져오기
  const fetchItems = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('API 응답 오류: ' + response.status);
      }
      const data = await response.json();
     
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      setItems([]);
    }
  };

  // CREATE - 항목 추가
  const addItem = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const newItem = await response.json();
      alert('항목이 추가되었습니다: ' + newItem.name);
      setShowAddModal(false);
      resetForm();
      fetchItems();
    } catch (error) {
      console.error('추가 실패:', error);
    }
  };

  // UPDATE - 항목 수정
  const updateItem = async () => {
    try {
      const response = await fetch(`${API_URL}/${currentItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const updatedItem = await response.json();
      alert('항목이 수정되었습니다: ' + updatedItem.name);
      setShowEditModal(false);
      resetForm();
      fetchItems();
    } catch (error) {
      console.error('수정 실패:', error);
    }
  };

  // DELETE - 항목 삭제
  const deleteItem = async (id) => {
    if (!window.confirm(`ID ${id} 항목을 삭제하시겠습니까?`)) return;
    
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      alert('항목이 삭제되었습니다');
      fetchItems();
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  // 수정 모달 열기
  const openEditModal = (item) => {
    setCurrentItem(item);
    setFormData({
      name: item.name,
      qty: item.qty,
      type: item.type,
      status: item.status,
      buy: item.buy,
      expire: item.expire,
      price: item.price,
      note: item.note || ''
    });
    setShowEditModal(true);
  };

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      name: '',
      qty: 1,
      type: '',
      status: '',
      buy: '',
      expire: '',
      price: 0,
      note: ''
    });
  };

  // 폼 입력 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'qty' || name === 'price' ? parseInt(value) || 0 : value
    }));
  };

  // 상태별 Badge 색상
  const getStatusBadge = (status) => {
    switch(status) {
      case "좋음": return "bg-success";
      case "빨리 먹어야 함": return "bg-warning text-dark";
      case "폐기 예정": return "bg-danger";
      default: return "bg-secondary";
    }
  };

  // 숫자 포맷팅
  const formatNumber = (num) => new Intl.NumberFormat("ko-KR").format(num);

  return (
    <div className="App">
      <div className="app-container">
        <h1 className="app-title">
          <i className="ri-fridge-line"></i> 냉장고 관리 시스템 v4.0.0 (React)
        </h1>
        
        <div className="header-section">
          <h5>항목 목록</h5>
          <button className="btn-add-new" onClick={() => setShowAddModal(true)}>
            <i className="ri-add-circle-line"></i> 새 항목 추가
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>이름</th>
                <th>종류</th>
                <th>수량</th>
                <th>상태</th>
                <th>구매일</th>
                <th>소비기한</th>
                <th>가격</th>
                <th>비고</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center text-muted py-4">
                    <i className="ri-inbox-line" style={{fontSize: '3rem'}}></i><br/>
                    등록된 항목이 없습니다. 새 항목을 추가해주세요.
                  </td>
                </tr>
              ) : (
                items.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td><strong>{item.name}</strong></td>
                    <td>{item.type}</td>
                    <td>{item.qty}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.buy}</td>
                    <td>{item.expire}</td>
                    <td>{formatNumber(item.price)}원</td>
                    <td>{item.note || ''}</td>
                    <td className="text-nowrap">
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEditModal(item)}>
                        <i className="ri-edit-2-line"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => deleteItem(item.id)}>
                        <i className="ri-delete-bin-6-line"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5><i className="ri-add-circle-line"></i> 새 항목 추가</h5>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label>상품명 *</label>
                  <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} required/>
                </div>
                <div className="col-md-6">
                  <label>수량 *</label>
                  <input type="number" className="form-control" name="qty" value={formData.qty} onChange={handleInputChange} min="1" required/>
                </div>
                <div className="col-md-6">
                  <label>종류 *</label>
                  <select className="form-select" name="type" value={formData.type} onChange={handleInputChange} required>
                    <option value="">선택</option>
                    <option>냉장</option>
                    <option>냉동</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label>상태 *</label>
                  <select className="form-select" name="status" value={formData.status} onChange={handleInputChange} required>
                    <option value="">선택</option>
                    <option>좋음</option>
                    <option>빨리 먹어야 함</option>
                    <option>폐기 예정</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label>구매일 *</label>
                  <input type="date" className="form-control" name="buy" value={formData.buy} onChange={handleInputChange} required/>
                </div>
                <div className="col-md-6">
                  <label>소비기한 *</label>
                  <input type="date" className="form-control" name="expire" value={formData.expire} onChange={handleInputChange} required/>
                </div>
                <div className="col-md-6">
                  <label>가격(원) *</label>
                  <input type="number" className="form-control" name="price" value={formData.price} onChange={handleInputChange} min="0" required/>
                </div>
                <div className="col-md-6">
                  <label>비고</label>
                  <input type="text" className="form-control" name="note" value={formData.note} onChange={handleInputChange}/>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>취소</button>
              <button className="btn btn-success" onClick={addItem}>
                <i className="ri-save-line"></i> 저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5><i className="ri-edit-2-line"></i> 항목 수정</h5>
              <button className="btn-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label>상품명 *</label>
                  <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} required/>
                </div>
                <div className="col-md-6">
                  <label>수량 *</label>
                  <input type="number" className="form-control" name="qty" value={formData.qty} onChange={handleInputChange} min="1" required/>
                </div>
                <div className="col-md-6">
                  <label>종류 *</label>
                  <select className="form-select" name="type" value={formData.type} onChange={handleInputChange} required>
                    <option value="">선택</option>
                    <option>냉장</option>
                    <option>냉동</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label>상태 *</label>
                  <select className="form-select" name="status" value={formData.status} onChange={handleInputChange} required>
                    <option value="">선택</option>
                    <option>좋음</option>
                    <option>빨리 먹어야 함</option>
                    <option>폐기 예정</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label>구매일 *</label>
                  <input type="date" className="form-control" name="buy" value={formData.buy} onChange={handleInputChange} required/>
                </div>
                <div className="col-md-6">
                  <label>소비기한 *</label>
                  <input type="date" className="form-control" name="expire" value={formData.expire} onChange={handleInputChange} required/>
                </div>
                <div className="col-md-6">
                  <label>가격(원) *</label>
                  <input type="number" className="form-control" name="price" value={formData.price} onChange={handleInputChange} min="0" required/>
                </div>
                <div className="col-md-6">
                  <label>비고</label>
                  <input type="text" className="form-control" name="note" value={formData.note} onChange={handleInputChange}/>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>취소</button>
              <button className="btn btn-primary" onClick={updateItem}>
                <i className="ri-save-line"></i> 수정 저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
