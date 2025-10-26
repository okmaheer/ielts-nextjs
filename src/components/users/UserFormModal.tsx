'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Select from '../form/Select';
import { ChevronDownIcon } from '@/icons';
import {
  userService,
  type User,
  type CreateUserData,
  type UpdateUserData,
} from '../../../lib/services/userService';
import { toast } from 'react-hot-toast';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: User | null;
  mode: 'create' | 'edit';
}

export default function UserFormModal({
  isOpen,
  onClose,
  onSuccess,
  user,
  mode,
}: UserFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    country: '',
    duration: '',
    status: '1',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Duration options matching Laravel
  const durationOptions = [
    { value: '', label: 'Select Duration' },
    { value: '1', label: '15 Days' },
    { value: '2', label: '1 Month' },
    { value: '3', label: '2 Month' },
    { value: '4', label: '3 Month' },
  ];

  const statusOptions = [
    { value: '', label: 'Select Status' },
    { value: '0', label: 'Inactive' },
    { value: '1', label: 'Active' },
  ];

  // Load countries and user data
  useEffect(() => {
    const loadData = async () => {
      try {
        const countriesList = await userService.getCountries();
        setCountries(countriesList);

        if (mode === 'edit' && user) {
          setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            password: '',
            country: user.country || '',
            duration: user.duration?.toString() || '',
            status: user.status?.toString() || '1',
          });
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load countries';
        console.error('Failed to load countries:', error);
        toast.error(errorMessage);
      }
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen, mode, user]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        country: '',
        duration: '',
        status: '1',
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.duration) newErrors.duration = 'Duration is required';
    if (!formData.status) newErrors.status = 'Status is required';

    // Password is required only for create mode
    if (mode === 'create' && !formData.password) {
      newErrors.password = 'Password is required';
    }

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'create') {
        const data: CreateUserData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          country: formData.country,
          duration: formData.duration,
          status: formData.status, // Keep as string
        };
        await userService.createUser(data);
        toast.success('User created successfully');
      } else {
        const data: UpdateUserData = {
          user_id: typeof user!.id === 'bigint' ? Number(user!.id) : user!.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          duration: formData.duration,
          status: formData.status, // Keep as string
          // Only include password if it's provided
          ...(formData.password && { password: formData.password }),
        };

        await userService.updateUser(data);
        toast.success('User updated successfully');
      }

      onSuccess();
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to save user';
      console.error('Failed to save user:', error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const countryOptions = [
    { value: '', label: 'Select Country' },
    ...countries.map(country => ({ value: country, label: country })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[700px] p-5 lg:p-8"
    >
      <form onSubmit={handleSubmit}>
        <h4 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white/90">
          {mode === 'create' ? 'Create New User' : 'Edit User'}
        </h4>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          {/* Name */}
          <div className="col-span-1">
            <Label>
              User Name <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              name="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div className="col-span-1">
            <Label>
              Contact Number <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              name="phone"
              placeholder="Enter Phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div className="col-span-1">
            <Label>
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Country */}
          <div className="col-span-1">
            <Label>
              Country <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Select
                options={countryOptions}
                placeholder="Select Country"
                value={formData.country}
                onChange={value => handleSelectChange('country', value)}
                className={`dark:bg-dark-900 ${
                  errors.country ? 'border-red-500' : ''
                }`}
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
            {errors.country && (
              <p className="mt-1 text-sm text-red-500">{errors.country}</p>
            )}
          </div>

          {/* Password */}
          <div className="col-span-1">
            <Label>
              Password{' '}
              {mode === 'create' && <span className="text-red-500">*</span>}
              {mode === 'edit' && (
                <span className="text-sm text-gray-500">
                  (Leave blank to keep current)
                </span>
              )}
            </Label>
            <Input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Duration */}
          <div className="col-span-1">
            <Label>
              Duration <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Select
                options={durationOptions}
                placeholder="Select Duration"
                value={formData.duration}
                onChange={value => handleSelectChange('duration', value)}
                className={`dark:bg-dark-900 ${
                  errors.duration ? 'border-red-500' : ''
                }`}
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
            {errors.duration && (
              <p className="mt-1 text-sm text-red-500">{errors.duration}</p>
            )}
          </div>

          {/* Status */}
          <div className="col-span-1 sm:col-span-2">
            <Label>
              Status <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Select
                options={statusOptions}
                placeholder="Select Status"
                value={formData.status}
                onChange={value => handleSelectChange('status', value)}
                className={`dark:bg-dark-900 ${
                  errors.status ? 'border-red-500' : ''
                }`}
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
            {errors.status && (
              <p className="mt-1 text-sm text-red-500">{errors.status}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end w-full gap-3 mt-8">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                Please wait...
              </>
            ) : mode === 'create' ? (
              'Create User'
            ) : (
              'Update User'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
