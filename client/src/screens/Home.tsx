import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, Image } from 'react-native';
import { colors } from '../constants/theme';
import { useAppContext } from '../contexts/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';
import Typo from '../components/Typo';
import TopNav2 from '../components/TopNav2';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';

function Home() {
  const navigation = useNavigation();
  const { selectedCreators, setSubscriptions } = useAppContext();

  const handleLogout = async () => {
    try {
      await GoogleSignin.signOut();
      setSubscriptions([]); // Clear subscriptions on logout
      navigation.navigate('Login' as never);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }}>
        <TopNav2 title="Home" />
        <View style={{ flex: 1 }}>
          <View style={styles.container}>
            {selectedCreators.length > 0 ? (
              selectedCreators.map(creator => (
                <View key={creator.id + creator.platform} style={styles.card}>
                  <Image source={{ uri: creator.avatar }} style={styles.logo} />
                  <View style={styles.info}>
                    <Text style={styles.title}>{creator.name}</Text>
                    <Text style={styles.desc}>{creator.platform}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No creators selected</Text>
            )}
          </View>
          <View style={{ alignItems: 'center', width: '100%', marginBottom: 24 }}>
            <Button onPress={handleLogout}>
              <Typo>Logout</Typo>
            </Button>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

export default Home;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
    alignItems: 'stretch',
    flex: 1,
    marginTop: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
    backgroundColor: '#333',
  },
  info: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  desc: {
    color: '#ccc',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#ccc',
    fontSize: 14,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 20,
  },
});
