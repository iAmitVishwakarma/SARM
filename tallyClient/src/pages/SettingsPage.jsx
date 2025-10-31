import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth(); // Get current user
  const [formData, setFormData] = useState({
    shopName: '',
    email: '',
    address: '',
    gstin: '',
  });
  const [loading, setLoading] = useState(true);

  // Load user data into the form
  useEffect(() => {
    if (user) {
      setFormData({
        shopName: user.shopName || '',
        email: user.email || '',
        address: user.address || '',
        gstin: user.gstin || '',
      });
      setLoading(false);
    } else if (!authLoading) {
      // Handle case where user data failed to load
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Call the new PUT route we created
      const { data } = await axios.put('/api/auth/profile', formData);
      alert('Profile Updated Successfully!');
      // Update local state with new data
      setFormData(data);
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || 'Could not update profile.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">Settings</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="shopName"
            name="shopName"
            label="Shop Name"
            value={formData.shopName}
            onChange={handleChange}
            required
          />
          <Input
            id="email"
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            id="gstin"
            name="gstin"
            label="GSTIN (Optional)"
            value={formData.gstin}
            onChange={handleChange}
          />
          <Input
            id="address"
            name="address"
            label="Shop Address (Optional)"
            value={formData.address}
            onChange={handleChange}
          />
          {/* We'll skip password change for now to keep it simple */}
          
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              className="!w-auto"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}