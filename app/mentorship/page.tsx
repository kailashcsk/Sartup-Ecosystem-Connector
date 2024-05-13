"use client";
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Check, Plus } from 'lucide-react';

const bgColors = {
  'FOUNDER': '#1e40af',
  'PARTNER': '#1e40af',
  'INVESTOR': '#1e40af',
  'MENTOR': '#1e40af',
}

const Page = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/fetchAllUsers');
        const data = await response.json();
        console.log('Data:', data.data)

        // following
        const followedUsers = JSON.parse(localStorage.getItem('followedUsers')) || [];
        data.data.forEach(user => {
          if (followedUsers.includes(user.id)) {
            user.following = true;
          }
        });

        setUsers(data.data);
      } catch (error) {
        console.log('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRoleFilter = (role) => {
    if (selectedRole === role) {
      setSelectedRole('');
      return;
    }
    setSelectedRole(role);
  };

  const filteredUsers = users.filter((user) => {
    const isMatchingSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase());

    const isMatchingRole = selectedRole === '' || user.role === selectedRole;

    return isMatchingSearch && isMatchingRole;
  });

  const followUser = async (userId) => {
    // write to local storage
    const followedUsers = JSON.parse(localStorage.getItem('followedUsers')) || [];
    if (followedUsers.includes(userId)) {
      return;
    }
    followedUsers.push(userId);
    localStorage.setItem('followedUsers', JSON.stringify(followedUsers));

    // update UI
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        user.following = true;
      }
      return user;
    });
    setUsers(updatedUsers);
  }

  const unFollowUser = async (userId) => {
    // write to local storage
    const followedUsers = JSON.parse(localStorage.getItem('followedUsers')) || [];
    const updatedFollowedUsers = followedUsers.filter(id => id !== userId);
    localStorage.setItem('followedUsers', JSON.stringify(updatedFollowedUsers));

    // update UI
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        user.following = false;
      }
      return user;
    });
    setUsers(updatedUsers);
  }

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="col-span-3">
        <div className="flex justify-center mb-4">
          <Input
            type="text"
            placeholder="Search Founders, Investors, Mentors..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-[800px] p-6"
            style={{
              borderRadius: '2.5rem',
            }}
          />
        </div>
        <div className="flex justify-center mb-4 space-x-2">
          <Button
            variant={selectedRole === 'FOUNDER' ? 'default' : 'outline'}
            onClick={() => handleRoleFilter('FOUNDER')}
            className='rounded-xl'
          >
            Founder
          </Button>
          <Button
            variant={selectedRole === 'INVESTOR' ? 'default' : 'outline'}
            onClick={() => handleRoleFilter('INVESTOR')}
            className='rounded-xl'
          >
            Investor
          </Button>
          <Button
            variant={selectedRole === 'MENTOR' ? 'default' : 'outline'}
            onClick={() => handleRoleFilter('MENTOR')}
            className='rounded-xl'
          >
            Mentor
          </Button>
          <Button
            variant={selectedRole === 'PARTNER' ? 'default' : 'outline'}
            onClick={() => handleRoleFilter('PARTNER')}
            className='rounded-xl'
          >
            Partner
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredUsers.map((user) => (
            <Card
              key={user.id}
              style={{
                borderRadius: '1rem',
                cursor: 'pointer',
                transition: 'transform 0.3s ease-in-out',
              }}
              className="hover:scale-105"
            >
              <CardHeader>
                <div className="flex justify-center">
                  <Avatar style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    border: '4px solid #1d4ed8',
                  }}>
                    <AvatarImage src={user.profileImage} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center flex flex-col items-center justify-center">
                  <CardTitle>{user.name}</CardTitle>
                  <Badge variant="secondary" className={`w-fit mt-3`} style={{
                    backgroundColor: bgColors[user.role],
                  }}>{user.role}</Badge>
                  <Button variant="default" className="mt-4" style={{
                    borderRadius: '2.5rem',
                    background: user.following ? '#86efac' : '#60a5fa',
                  }}
                    onClick={() => user.following ? unFollowUser(user.id) : followUser(user.id)}
                  >
                    {
                      !user.following ? <Plus className="w-4 h-4 mr-2" /> : <Check className="w-4 h-4 mr-2" />
                    }
                    {
                      user.following ? 'Following' : 'Follow'
                    }
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Page;

