import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, Image, Button } from 'react-native';
import { colors } from '../constants/theme';
import { useAppContext } from '../contexts/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';
import Typo from '../components/Typo';
import TopNav2 from '../components/TopNav2';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

function Home({ navigation }: HomeProps) {
  const { subscriptions, twitchFollows, fetchYouTubeSubscriptions, setSubscriptions } = useAppContext();

  console.log('Home screen - subscriptions count:', subscriptions.length);
  console.log('Home screen - subscriptions:', subscriptions);
  console.log('Home screen - twitch follows count:', twitchFollows.length);
  console.log('Home screen - twitch follows:', twitchFollows);

  const handleLogout = async () => {
    try {
      await GoogleSignin.signOut();
      setSubscriptions([]); // Clear subscriptions on logout
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView>
        <TopNav2 title="Home" />
        <View style={styles.container}>
          {/* YouTube Subscriptions */}
          {subscriptions.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>YouTube Subscriptions</Text>
              {subscriptions.map((item) => (
                <View key={item.id} style={styles.card}>
                  <Image
                    source={{ uri: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url }}
                    style={styles.logo}
                  />
                  <View style={styles.info}>
                    <Text style={styles.title}>{item.snippet.title}</Text>
                    <Text style={styles.desc}>{item.snippet.description}</Text>
                  </View>
                </View>
              ))}
            </>
          )}

          {/* Twitch Follows */}
          {twitchFollows.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Twitch Follows</Text>
              {twitchFollows.map((item) => (
                <View key={item.broadcaster_id} style={styles.card}>
                  <Image
                    source={{ uri: item.broadcaster_login ? `https://static-cdn.jtvnw.net/jtv_user_pictures/${item.broadcaster_login}-profile_image-300x300.png` : undefined }}
                    style={styles.logo}
                  />
                  <View style={styles.info}>
                    <Text style={styles.title}>{item.broadcaster_name}</Text>
                    <Text style={styles.desc}>Following since {new Date(item.followed_at).toLocaleDateString()}</Text>
                  </View>
                </View>
              ))}
            </>
          )}

          {subscriptions.length === 0 && twitchFollows.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No subscriptions or follows found</Text>
              <Text style={styles.emptySubtext}>Try connecting platforms and logging back in</Text>
            </View>
          )}
          <Button title="Logout" onPress={handleLogout} />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.neutral900,
    alignItems: 'stretch',
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
