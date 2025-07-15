import { StyleSheet, Text, View } from 'react-native'
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Add Creator type
export type Creator = {
    id: string;
    name: string;
    avatar: string;
    platform: string;
};

// Update User type to include selectedCreators
export type User = {
    _id: string;
    email: string;
    name: string;
    photo: string;
    googleId: string;
    selectedCreators?: Creator[];
}

type UserContextType = {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>; // set the user
    loadUserFromStorage: () => Promise<void>; // load the user from storage
    fetchSelectedCreators: (userId: string) => Promise<Creator[]>;
}

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    loadUserFromStorage: async () => {},
    fetchSelectedCreators: async () => [],
})

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const loadUserFromStorage = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (userId) {
                const response = await fetch(`http://192.168.0.108:4000/api/user/get-user?userId=${userId}`);
                const data = await response.json();
                if (data.success) {
                    setUser(data.user);
                }
            }
        } catch (error) {
            console.error('Error loading user from storage:', error);
        }
    };

    // Move fetchSelectedCreators here
    const fetchSelectedCreators = useCallback(async (userId: string) => {
        try {
            const response = await fetch(`http://192.168.0.108:4000/api/user/get-selected-creators?userId=${userId}`);
            const data = await response.json();
            if (data.success && data.creators) {
                setUser(prev => prev ? { ...prev, selectedCreators: data.creators } : prev);
                return data.creators;
            }
        } catch (err) {
            console.error('Failed to fetch selected creators:', err);
        }
        return [];
    }, []);

    useEffect(() => {
        loadUserFromStorage();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loadUserFromStorage, fetchSelectedCreators }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext);



