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

function UserDetails() {
  const [user, setUser] = useState<User>({} as User);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const response = await api.get(`users/${params?.id}`);
      setUser(response.data);
    } catch (err) {
      setError('Failed to fetch user details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchUser();
  }, [params.id]);

  const onBackButtonClick = () => {
    router.push('/');
  };

  const onEditButtonClick = () => {
    router.push(`${params?.id}/edit`);
  };
 
  const onDeleteButtonClick = async () => {
    try {
      await api.delete(`users/${params.id}`);
      toast.success('User deleted successfully!');
      router.push('/');
    } catch (err) {
      toast.error('Failed to delete user. Please try again later.');
    }
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
            {user.firstName} {user.lastName}
          </h1>
          <p className={Style.userTitle}>{user.company.title}</p>
        </div>
<section className={Style.dataWrapper}>

        <div className={Style.userInfo}>
          <h3>Contact Information</h3>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Birth Date:</strong> {user.birthDate}</p>
        </div>

        <div className={Style.userInfo}>
          <h3>Address</h3>
          <p><strong>Street:</strong> {user.address.address}</p>
          <p><strong>City:</strong> {user.address.city}</p>
          <p><strong>State:</strong> {user.address.state}</p>
          <p><strong>Postal Code:</strong> {user.address.postalCode}</p>
          <p><strong>Country:</strong> {user.address.country}</p>
        </div>

        <div className={Style.userInfo}>
          <h3>Company</h3>
          <p><strong>Name:</strong> {user.company.name}</p>
          <p><strong>Title:</strong> {user.company.title}</p>
        </div>
</section>

        {/* Buttons */}
        <div className={Style.buttonContainer}>
          <button onClick={onEditButtonClick} className={Style.editButton}>
            Edit
          </button>
          <button onClick={onDeleteButtonClick} className={Style.deleteButton}>
            Delete
          </button>
          <button onClick={onBackButtonClick} className={Style.backButton}>
            Go Back
          </button>
        </div>
      </div>
    </main>
  );
}

export default withAuth(UserDetails);