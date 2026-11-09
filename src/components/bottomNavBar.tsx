import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 15 }]}>
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home' as any)}>
        <Ionicons name="business" size={24} color={pathname === '/home' ? '#0A2540' : '#94A3B8'} />
        <Text style={[styles.navText, pathname === '/home' && styles.navTextActive]}>Home</Text>
      </TouchableOpacity>

      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={() => router.push('/addTransaction' as any)}>
          <Ionicons name="add" size={32} color="#FFD700" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/stats' as any)}>
        <MaterialCommunityIcons name="chart-line" size={24} color={pathname === '/stats' ? '#0A2540' : '#94A3B8'} />
        <Text style={[styles.navText, pathname === '/stats' && styles.navTextActive]}>Stats</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', backgroundColor: '#FFFFFF', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 30, paddingTop: 15, borderTopLeftRadius: 30, borderTopRightRadius: 30, elevation: 10 },
  navItem: { alignItems: 'center', justifyContent: 'center', gap: 4, flex: 1 },
  navText: { fontSize: 11, fontWeight: '600', color: '#94A3B8' },
  navTextActive: { color: '#0A2540' },
  fabContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fab: { backgroundColor: '#0A2540', width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', elevation: 5 },
});