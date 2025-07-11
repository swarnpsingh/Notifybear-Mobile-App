import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (token: string, key: string = 'authToken') => {
  try {
    await AsyncStorage.setItem(key, token);
  } catch (e) {
    console.error("Failed to save token", e);
  }
};

export const getToken = async (key: string = 'authToken'): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    console.error("Failed to fetch token", e);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (e) {
    console.error("Failed to remove token", e);
  }
};
