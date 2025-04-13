'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import Style from './page.module.css';
import withAuth from '@/components/WithAuth';
import toast from 'react-hot-toast';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  phone: string;
  birthDate: string;
  address: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  company: {
    name: string;
    title: string;
  };
}

function EditUserPage() {
  const [user, setUser] = useState<User>({} as User);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`users/${params.id}`);
        setUser(response.data);
      } catch (err) {
        setError('Failed to fetch user details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      address: {
        ...prevUser.address,
        [name]: value,
      },
    }));
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      company: {
        ...prevUser.company,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`users/${params.id}`, user);
      toast.success('User updated successfully!');
      router.push(`/user/${params.id}`);
    } catch (err) {
        toast.error('Failed to update user. Please try again later.');
      setError('Failed to update user. Please try again later.');
    }
  };

  const onBackButtonClick = () => {
    router.push(`/user/${params.id}`);
  };

  if (loading) {
    return <div className={Style.loading}>Loading user details...</div>;
  }

  if (error) {
    return <div className={Style.error}>{error}</div>;
  }

  return (
    <main className={Style.wrapper}>
      <div className={Style.container}>
        <div className={Style.userHeader}>
          <img
            src={user.image}
            alt={`${user.firstName} ${user.lastName}`}
            className={Style.userImage}
          />
          <h1 className={Style.title}>
            Edit {user.firstName} {user.lastName}
          </h1>
          <p className={Style.userTitle}>{user.company.title}</p>
        </div>

        <form onSubmit={handleSubmit} className={Style.form}>
          <section className={Style.dataWrapper}>
            <div className={Style.userInfo}>
              <h3>Contact Information</h3>
              <label>
                <strong>First Name:</strong>
                <input
                  type="text"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleInputChange}
                  className={Style.inputField}
                />
              </label>
              <label>
                <strong>Last Name:</strong>
                <input
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleInputChange}
                  className={Style.inputField}
                />
              </label>
              <label>
                <strong>Email:</strong>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleInputChange}
                  className={Style.inputField}
                />
              </label>
              <label>
                <strong>Phone:</strong>
                <input
                  type="text"
                  name="phone"
                  value={user.phone}
                  onChange={handleInputChange}
                  className={Style.inputField}
                />
              </label>
              <label>
                <strong>Birth Date:</strong>
                <input
                  type="text"
                  name="birthDate"
                  value={user.birthDate}
                  onChange={handleInputChange}
                  className={Style.inputField}
                />
              </label>
            </div>

            <div className={Style.userInfo}>
              <h3>Address</h3>
              <label>
                <strong>Street:</strong>
                <input
                  type="text"
                  name="address"
                  value={user.address.address}
                  onChange={handleAddressChange}
                  className={Style.inputField}
                />
              </label>
              <label>
                <strong>City:</strong>
                <input
                  type="text"
                  name="city"
                  value={user.address.city}
                  onChange={handleAddressChange}
                  className={Style.inputField}
                />
              </label>
              <label>
                <strong>State:</strong>
                <input
                  type="text"
                  name="state"
                  value={user.address.state}
                  onChange={handleAddressChange}
                  className={Style.inputField}
                />
              </label>
              <label>
                <strong>Postal Code:</strong>
                <input
                  type="text"
                  name="postalCode"
                  value={user.address.postalCode}
                  onChange={handleAddressChange}
                  className={Style.inputField}
                />
              </label>
              <label>
                <strong>Country:</strong>
                <input
                  type="text"
                  name="country"
                  value={user.address.country}
                  onChange={handleAddressChange}
                  className={Style.inputField}
                />
              </label>
            </div>

            <div className={Style.userInfo}>
              <h3>Company</h3>
              <label>
                <strong>Name:</strong>
                <input
                  type="text"
                  name="name"
                  value={user.company.name}
                  onChange={handleCompanyChange}
                  className={Style.inputField}
                />
              </label>
              <label>
                <strong>Title:</strong>
                <input
                  type="text"
                  name="title"
                  value={user.company.title}
                  onChange={handleCompanyChange}
                  className={Style.inputField}
                />
              </label>
            </div>
          </section>

          <div className={Style.buttonContainer}>
            <button type="submit" className={Style.submitButton}>
              Save Changes
            </button>
            <button
              type="button"
              onClick={onBackButtonClick}
              className={Style.backButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default withAuth(EditUserPage);