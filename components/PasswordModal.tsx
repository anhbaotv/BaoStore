import React, { useState } from 'react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CORRECT_PASSWORD = 'baostore'; // Hardcoded password

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setError('');
      resetForm();
      onSuccess();
    } else {
      setError('Mật khẩu không chính xác. Vui lòng thử lại.');
    }
  };

  const handleClose = () => {
      resetForm();
      onClose();
  }
  
  const resetForm = () => {
    setPassword('');
    setError('');
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg shadow-2xl p-8 w-full max-w-sm mx-4">
        <h2 className="text-2xl font-bold mb-4 text-cyan-300">Yêu cầu quyền truy cập</h2>
        <p className="text-slate-400 mb-6">Vui lòng nhập mật khẩu để tải lên ứng dụng.</p>
        
        {error && <p className="bg-red-500/20 text-red-300 p-3 rounded-md mb-4 text-sm">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">Mật khẩu</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" 
              required 
              autoFocus
            />
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={handleClose} className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white">Xác nhận</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;