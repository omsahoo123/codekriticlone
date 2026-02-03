import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { api } from '@/utils/api';
import { Upload, X } from 'lucide-react';

export function PhotoUpload({ onUploadSuccess, currentPhoto }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(currentPhoto || null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error('Invalid file type. Allowed: JPG, PNG, WebP');
        return;
      }

      // Validate file size (5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File too large. Max size: 5MB');
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/team/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Photo uploaded successfully!');
      onUploadSuccess(response.data.photo_url);
      setFile(null);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Upload failed';
      toast.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(currentPhoto || null);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-slate-300 mb-2 block">Team Photo</Label>
        <div className="flex items-center gap-3">
          <Input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={uploading}
            className="input-ocean"
          />
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="btn-primary whitespace-nowrap"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Max size: 5MB • Formats: JPG, PNG, WebP
        </p>
      </div>

      {preview && (
        <div className="relative w-full max-w-xs">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-cyan-500/30"
          />
          {file && (
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 p-1 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
