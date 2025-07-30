"use client"

import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { User, Mail, Camera, X, Save, Upload, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface User {
  fullName?: string;
  email?: string;
  avatar_url?: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

interface FormData {
  fullName: string;
  email: string;
  avatarFile: File | null;
  avatarPreview: string;
}

interface Errors {
  fullName?: string;
  email?: string;
  avatar?: string;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user }) => {
  
  const [formData, setFormData] = useState<FormData>({
    fullName: user?.fullName || '',
    email: user?.email || '',
    avatarFile: null,
    avatarPreview: user?.avatar_url || ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof Errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          avatar: 'Please select a valid image file'
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          avatar: 'Image size must be less than 5MB'
        }));
        return;
      }

      setErrors(prev => ({
        ...prev,
        avatar: ''
      }));

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        avatarFile: file,
        avatarPreview: previewUrl
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const postData = new FormData();
    postData.append('fullName', formData.fullName);
    postData.append('email', formData.email);
    
    if (formData.avatarFile) {
      postData.append('avatar', formData.avatarFile);
    }

    try {
      const response = await fetch('/api/users/update-user', {
        method: 'POST',
        body: postData
      });

      if (response.ok) {
        toast.success('Profile updated successfully');
        onClose();
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).style.display = 'none';
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 rounded-full">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Edit Profile</h2>
              <p className="text-blue-100">Update your personal information</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Avatar Section */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r bg-white flex items-center justify-center overflow-hidden cursor-pointer"
                   onClick={triggerFileInput}>
                {formData.avatarPreview ? (
                  <img
                    src={formData.avatarPreview}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={handleAvatarError}
                  />
                ) : (
                  
                <div className="absolute h-full w-full rounded-full inset-0 bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <Image
                    src={user?.avatar_url!}
                    alt="profile_image"
                    width={100}
                    height={100}
                    className='rounded-full'
                  />
                </div>
              )}
              </div>
              {formData.avatarPreview && (
                <button
                  type="button"
                  onClick={() => setShowAvatarPreview(!showAvatarPreview)}
                  className="absolute -bottom-2 -right-2 p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                >
                  {showAvatarPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
            </div>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {/* Upload button */}
            <button
              type="button"
              onClick={triggerFileInput}
              className="mt-3 flex items-center justify-center space-x-2 px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors mx-auto"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Image</span>
            </button>
            
            {errors.avatar && (
              <p className="mt-1 text-sm text-red-600">{errors.avatar}</p>
            )}
            
            <p className="mt-1 text-xs text-gray-500">
              JPG, PNG, GIF up to 5MB
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 mr-2 text-gray-500" />
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 mr-2 text-gray-500" />
              Email Address
            </label>
            <input
            disabled={true}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Avatar Preview */}
          {showAvatarPreview && formData.avatarPreview && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Avatar Preview</h4>
              <div className="flex justify-center">
                <img
                  src={formData.avatarPreview}
                  alt="Avatar Preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  onError={() => setShowAvatarPreview(false)}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;