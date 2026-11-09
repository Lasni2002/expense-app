import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.logoIcon}>
        <MaterialCommunityIcons name="wallet" size={18} color="#FFF" />
      </View>
      <View>
        <Text style={styles.logoText}>MYWALLET</Text>
        <Text style={styles.pageTitle}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10,
    marginBottom: 20, 
  },
  logoIcon: { 
    backgroundColor: '#0A2540', 
    padding: 8, 
    borderRadius: 10 
  },
  logoText: { 
    fontSize: 10, 
    fontWeight: '700', 
    color: '#64748B', 
    letterSpacing: 1 
  },
  pageTitle: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: '#0A2540' 
  },
});