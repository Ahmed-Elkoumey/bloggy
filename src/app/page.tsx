'use client';

import withAuth from '@/components/WithAuth';
import { useAuth } from '@/hooks/UseAuth';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import Style from './page.module.css';
import { useRouter } from 'next/navigation';
import Pagination from '@/components/Pagination';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  address: {
    city: string;
    state: string;
  };
  company: {
    name: string;
    title: string;
  };
}

function UsersPage() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pagingLoading, setPagingLoading] = useState<boolean>(false);
  const router = useRouter();
  const limit = 8; // Number of users per page


   const fetchUsers = async () => {
      try {
        const skip = (currentPage - 1) * limit;
        const response = await api.get(
          `users?limit=${limit}&skip=${skip}`
        );
        setUsers(response.data.users);
        setPagingLoading(false);
        setTotalPages(Math.ceil(response.data.total / limit));
      } catch (err) {
        setError('Failed to fetch users. Please try again later.');
      } finally {
        setPagingLoading(false);
        setLoading(false);
      }
    };
  useEffect(() => {

    fetchUsers();
  }, [currentPage]);


  const handlePageChange = (page: number) => {
    setPagingLoading(true);
    setCurrentPage(page);
    
  };


  if (loading) {
    return <div className={Style.loading}>Loading users...</div>;
  }

  if (error) {
    return <div className={Style.error}>{error}</div>;
  }

  const getUserDetails = (id: number) => {
    router.push(`/user/${id}`);
  };

  return (
    <div className={Style.container}>
      <header className={Style.header}>
        <h1>Welcome, {user?.username}!</h1>
       <div className={Style.btnsWrap}>
        <button onClick={()=> router.push('profile')} className={Style.profileButton}>
          Profile
        </button>
        <button onClick={logout} className={Style.logoutButton}>
          Logout
        </button>
       </div>
      </header>

      <div className={Style.usersGrid}>
        {users.map((user) => (
          <div key={user.id} className={Style.userCard}>
            <img
              src={user.image}
              alt={`${user.firstName} ${user.lastName}`}
              className={Style.userImage}
            />
            <h2 className={Style.userName}>
              {user.firstName} {user.lastName}
            </h2>
            <p className={Style.userEmail}>{user.email}</p>
            <p className={Style.userLocation}>
              {user.address.city}, {user.address.state}
            </p>
            <p className={Style.userCompany}>
              {user.company.title} at {user.company.name}
            </p>
            <button
              className={Style.detailsBtn}
              onClick={() => getUserDetails(user.id)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        limit={limit}
        loading={pagingLoading}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default withAuth(UsersPage);