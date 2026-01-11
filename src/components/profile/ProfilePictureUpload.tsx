import React, { useState } from "react";
import { Camera, Trash2, Upload, X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { getApiUrl } from "../../config/api";

interface ProfilePictureUploadProps {
  currentPicture?: string | null;
  onUploadSuccess: () => void;
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentPicture,
  onUploadSuccess,
}) => {
  const { token } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("File selected:", file.name, file.type, file.size);

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(file.type) || !allowedExtensions.includes(fileExtension)) {
      toast.error("Invalid file type. Only JPG, PNG, and GIF images are allowed.");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File too large. Maximum size is 5MB.");
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setShowModal(true);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    console.log("Starting upload...");
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("profilePicture", selectedFile);

      console.log("Uploading to:", getApiUrl("/user/upload-profile-picture"));
      console.log("Token:", token ? "Present" : "Missing");
      
      const response = await axios.post(getApiUrl("/user/upload-profile-picture"), formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response:", response.data);
      toast.success("Profile picture uploaded successfully!");
      setShowModal(false);
      setSelectedFile(null);
      setPreview(null);
      onUploadSuccess();
    } catch (error: any) {
      console.error("Upload error:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to upload profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(getApiUrl("/user/delete-profile-picture"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Profile picture deleted successfully!");
      onUploadSuccess();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete profile picture");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  const getImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    // Remove /api from the URL for uploads (uploads are served at root level)
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const baseUrl = apiUrl.replace(/\/api$/, '');
    const fullUrl = `${baseUrl}${path}`;
    console.log("ProfilePictureUpload - Image URL:", fullUrl);
    return fullUrl;
  };

  return (
    <>
      <div className="flex items-center gap-4">
        {/* Current Picture Display */}
        <div className="relative w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-200">
          {currentPicture && getImageUrl(currentPicture) ? (
            <>
              <img
                src={getImageUrl(currentPicture)}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("ProfilePictureUpload - Image failed to load:", getImageUrl(currentPicture));
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const icon = document.createElement('div');
                    icon.innerHTML = '<svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>';
                    parent.appendChild(icon.firstChild!);
                  }
                }}
              />
            </>
          ) : (
            <Camera className="w-8 h-8 text-gray-400" />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div
              className="inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
            >
              <Upload className="w-4 h-4" />
              {currentPicture ? "Change Picture" : "Upload Picture"}
            </div>
          </label>

          {currentPicture && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-red-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:ring-gray-700"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? "Deleting..." : "Remove Picture"}
            </button>
          )}
        </div>
      </div>

      {/* Upload Preview Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" 
          style={{ zIndex: 9999 }}
          onClick={handleCancel}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Upload Profile Picture</h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview */}
            {preview && (
              <div className="mb-4 flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-48 h-48 rounded-full object-cover border-2 border-gray-200"
                />
              </div>
            )}

            {/* File Info */}
            {selectedFile && (
              <div className="mb-4 text-sm text-gray-600">
                <p>File: {selectedFile.name}</p>
                <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleCancel();
                }}
                disabled={isUploading}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleUpload();
                }}
                disabled={isUploading}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
