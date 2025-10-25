
import React, { useState, useCallback } from 'react';
import { generateAppDescription } from '../services/geminiService.ts';
import type { App } from '../types.ts';
import { Category } from '../types.ts';
import SparklesIcon from './icons/SparklesIcon.tsx';

interface UploadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (newApp: Omit<App, 'id' | 'installed' | 'apkUrl' | 'apk'> & { iconFile: File, apkFile: File }) => void;
}

const UploadAppModal: React.FC<UploadAppModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [appName, setAppName] = useState('');
  const [category, setCategory] = useState<Category>(Category.Utilities);
  const [description, setDescription] = useState('');
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [apkFile, setApkFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIconFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setIconPreview(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setApkFile(e.target.files[0]);
    }
  };

  const handleGenerateDescription = useCallback(async () => {
    if (!appName) {
      setError('Vui lòng nhập tên ứng dụng trước.');
      return;
    }
    setError('');
    setIsGenerating(true);
    try {
      const generatedDesc = await generateAppDescription(appName, category);
      setDescription(generatedDesc);
    } catch (err) {
      setError('Lỗi khi tạo mô tả.');
    } finally {
      setIsGenerating(false);
    }
  }, [appName, category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName || !iconFile || !description || !apkFile) {
      setError('Vui lòng điền đầy đủ thông tin, chọn icon và tệp APK.');
      return;
    }
    onUpload({ name: appName, category, description, icon: iconFile.name, iconFile, apkFile });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setAppName('');
    setCategory(Category.Utilities);
    setDescription('');
    setIconFile(null);
    setIconPreview(null);
    setApkFile(null);
    setError('');
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg shadow-2xl p-8 w-full max-w-lg mx-4">
        <h2 className="text-2xl font-bold mb-6 text-cyan-300">Tải lên ứng dụng của bạn</h2>
        {error && <p className="bg-red-500/20 text-red-300 p-3 rounded-md mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="appName" className="block text-sm font-medium text-slate-300">Tên ứng dụng</label>
            <input type="text" id="appName" value={appName} onChange={(e) => setAppName(e.target.value)} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" required />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-300">Danh mục</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value as Category)} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" required>
              {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300">Mô tả</label>
            <div className="relative">
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" required />
              <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="absolute bottom-2 right-2 p-1.5 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors">
                {isGenerating ? 
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 
                  <SparklesIcon className="w-5 h-5" />
                }
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-slate-300">Biểu tượng (Icon)</label>
            <div className="mt-1 flex items-center space-x-4">
              {iconPreview ? <img src={iconPreview} alt="Icon preview" className="w-16 h-16 rounded-md object-cover" /> : <div className="w-16 h-16 rounded-md bg-slate-700 flex items-center justify-center text-slate-500">Preview</div>}
              <input type="file" id="icon" onChange={handleIconChange} accept="image/*" className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-500" required />
            </div>
          </div>
           <div>
            <label htmlFor="apkFile" className="block text-sm font-medium text-slate-300">Tệp APK</label>
             <div className="mt-1 flex items-center">
                <input type="file" id="apkFile" onChange={handleApkChange} accept=".apk" className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-500" required />
             </div>
             {apkFile && <p className="text-xs text-slate-400 mt-2">Đã chọn: {apkFile.name}</p>}
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white">Tải lên</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadAppModal;
