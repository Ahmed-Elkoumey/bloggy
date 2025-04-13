'use client';

import withAuth from '@/components/WithAuth';
import { useAuth } from '@/hooks/UseAuth';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import Style from './page.module.css';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: {
    color: string;
    type: string;
  };
  address: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    country: string;
  };
  university: string;
  bank: {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
  };
  company: {
    department: string;
    name: string;
    title: string;
    address: {
      address: string;
      city: string;
      state: string;
      postalCode: string;
      coordinates: {
        lat: number;
        lng: number;
      };
      country: string;
    };
  };
  crypto: {
    coin: string;
    wallet: string;
    network: string;
  };
  role: string;
}

function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('auth/me');
        setProfile(response.data);
      } catch (err) {
        setError('Failed to fetch profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const onBackButtonClick = () => {
    router.push('/');
  };

  if (loading) {
    return <div className={Style.loading}>Loading profile...</div>;
  }

  if (error) {
    return <div className={Style.error}>{error}</div>;
  }

  return (
    <div className={Style.container}>
      <header className={Style.header}>
        <h1>Profile</h1>
        <button onClick={logout} className={Style.logoutButton}>
          Logout
        </button>
      </header>

      <div className={Style.profileContainer}>
        <div className={Style.profileHeader}>
          <img
            src={profile?.image || '/default-profile.png'}
            alt="Profile"
            className={Style.profilePicture}
          />
          <h2 className={Style.username}>
            {profile?.firstName} {profile?.lastName}
          </h2>
          <p className={Style.bio}>{profile?.role}</p>
        </div>

        <div className={Style.stats}>
          <div className={Style.stat}>
            <span className={Style.statNumber}>{profile?.age}</span>
            <span className={Style.statLabel}>Age</span>
          </div>
          <div className={Style.stat}>
            <span className={Style.statNumber}>{profile?.height} cm</span>
            <span className={Style.statLabel}>Height</span>
          </div>
          <div className={Style.stat}>
            <span className={Style.statNumber}>{profile?.weight} kg</span>
            <span className={Style.statLabel}>Weight</span>
          </div>
        </div>

        <div className={Style.userInfo}>
          <h3>Personal Information</h3>
          <p><strong>Email:</strong> {profile?.email}</p>
          <p><strong>Phone:</strong> {profile?.phone}</p>
          <p><strong>Birth Date:</strong> {profile?.birthDate}</p>
          <p><strong>Blood Group:</strong> {profile?.bloodGroup}</p>
          <p><strong>Eye Color:</strong> {profile?.eyeColor}</p>
          <p><strong>Hair:</strong> {profile?.hair.color} {profile?.hair.type}</p>
        </div>

        <div className={Style.userInfo}>
          <h3>Address</h3>
          <p><strong>Street:</strong> {profile?.address.address}</p>
          <p><strong>City:</strong> {profile?.address.city}</p>
          <p><strong>State:</strong> {profile?.address.state}</p>
          <p><strong>Postal Code:</strong> {profile?.address.postalCode}</p>
          <p><strong>Country:</strong> {profile?.address.country}</p>
        </div>

        <div className={Style.userInfo}>
          <h3>Company</h3>
          <p><strong>Name:</strong> {profile?.company.name}</p>
          <p><strong>Department:</strong> {profile?.company.department}</p>
          <p><strong>Title:</strong> {profile?.company.title}</p>
          <p><strong>Address:</strong> {profile?.company.address.address}, {profile?.company.address.city}, {profile?.company.address.state}</p>
        </div>

        <div className={Style.userInfo}>
          <h3>Bank & Crypto</h3>
          <p><strong>Card Number:</strong> {profile?.bank.cardNumber}</p>
          <p><strong>Card Expire:</strong> {profile?.bank.cardExpire}</p>
          <p><strong>Currency:</strong> {profile?.bank.currency}</p>
          <p><strong>Crypto Wallet:</strong> {profile?.crypto.wallet}</p>
          <p><strong>Network:</strong> {profile?.crypto.network}</p>
        </div>
      <div className={Style.buttonContainer}>
      <button onClick={onBackButtonClick} className={Style.backButton}>
            Go Back
          </button>
</div>
      </div>

    </div>
  );
}

export default withAuth(ProfilePage);