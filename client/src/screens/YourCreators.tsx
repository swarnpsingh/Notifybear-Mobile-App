import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import TopNav2 from '../components/TopNav2';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../contexts/UserContext';

function YourCreators() {
  const navigation = useNavigation();
  const { user, fetchSelectedCreators } = useUser();
  // Normalize: ensure each creator has an id (fallback to creatorId if present)
  const selectedCreators = (user?.selectedCreators || []).map(c => ({
    ...c,
    id: c.id || (c as any).creatorId || `${c.platform}-${Math.random()}`,
  }));

  useEffect(() => {
    if (user?._id) {
      fetchSelectedCreators(user._id);
    }
  }, [fetchSelectedCreators, user?._id]);

  return (
    <ScreenWrapper>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }}>
        <TopNav2 title="Your Creators" />
        <View style={{ flex: 1 }}>
          <View style={styles.container}>
            {selectedCreators.length > 0 ? (
              selectedCreators.map(creator => (
                <View key={`${creator.id}-${creator.platform}`} style={styles.card}>
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
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

export default YourCreators;

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
