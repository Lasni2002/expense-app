import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/bottomNavBar';

export default function HomeScreen() {
  const [userName, setUserName] = useState('User');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const name = await AsyncStorage.getItem('@user_name');
        if (name) setUserName(name);

        const savedTxs = await AsyncStorage.getItem('@transactions');
        if (savedTxs) {
          const parsedTxs = JSON.parse(savedTxs);
          setTransactions(parsedTxs);
          
          let inc = 0, exp = 0;
          parsedTxs.forEach((tx: any) => {
            if (tx.type === 'income') inc += tx.amount;
            if (tx.type === 'expense') exp += tx.amount;
          });
          setIncome(inc);
          setExpense(exp);
        }
      };
      loadData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}><MaterialCommunityIcons name="wallet" size={18} color="#FFF" /></View>
            <View><Text style={styles.logoText}>MYWALLET</Text><Text style={styles.pageTitle}>Home</Text></View>
          </View>
        </View>

        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Hello, {userName}</Text>
          <Text style={styles.subGreeting}>Welcome to MyWallet</Text>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>TOTAL BALANCE ⓘ</Text>
          <Text style={styles.balanceAmount}>Rs. {(income - expense).toFixed(2)}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <View style={[styles.statIcon, { backgroundColor: '#10B981' }]}><Ionicons name="arrow-down" size={16} color="#FFF" /></View>
              <View><Text style={styles.statLabel}>Income</Text><Text style={styles.statValue}>+ Rs. {income.toFixed(2)}</Text></View>
            </View>
            <View style={styles.statBox}>
              <View style={[styles.statIcon, { backgroundColor: '#EF4444' }]}><Ionicons name="arrow-up" size={16} color="#FFF" /></View>
              <View><Text style={styles.statLabel}>Expense</Text><Text style={styles.statValue}>- Rs. {expense.toFixed(2)}</Text></View>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => router.push('/transactions' as any)}><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
        </View>

        <View style={styles.transactionList}>
          {transactions.length === 0 ? (
            <Text style={{ textAlign: 'center', padding: 20, color: '#94A3B8' }}>No transactions yet.</Text>
          ) : (
            transactions.slice(0, 4).map((tx: any, index: number) => (
              <View key={tx.id} style={[styles.transactionItem, index === 3 && { borderBottomWidth: 0 }]}>
                <View style={[styles.txIcon, { backgroundColor: tx.type === 'income' ? '#D1FAE5' : '#FEF3C7' }]}>
                  <MaterialCommunityIcons name={tx.type === 'income' ? 'cash' : 'cart'} size={20} color={tx.type === 'income' ? '#047857' : '#D97706'} />
                </View>
                <View style={styles.txDetails}>
                  <Text style={styles.txTitle}>{tx.category}</Text>
                  <Text style={styles.txDate}>{new Date(tx.date).toLocaleDateString()}</Text>
                </View>
                <Text style={[styles.txAmount, { color: tx.type === 'income' ? '#10B981' : '#EF4444' }]}>
                  {tx.type === 'income' ? '+' : '-'} Rs. {tx.amount.toFixed(2)}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' }, scrollContent: { padding: 20, paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 }, logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoIcon: { backgroundColor: '#0A2540', padding: 8, borderRadius: 10 }, logoText: { fontSize: 10, fontWeight: '700', color: '#64748B' }, pageTitle: { fontSize: 18, fontWeight: '800', color: '#0A2540' },
  greetingContainer: { marginBottom: 20 }, greeting: { fontSize: 24, fontWeight: '800', color: '#0A2540' }, subGreeting: { fontSize: 12, color: '#64748B', marginTop: 4 },
  balanceCard: { backgroundColor: '#0A2540', borderRadius: 24, padding: 20, marginBottom: 25 },
  balanceLabel: { color: '#94A3B8', fontSize: 11, fontWeight: '600' }, balanceAmount: { color: '#FFFFFF', fontSize: 32, fontWeight: '800', marginVertical: 10 },
  statsRow: { flexDirection: 'row', gap: 10 }, statBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 16, gap: 10 },
  statIcon: { padding: 6, borderRadius: 8 }, statLabel: { color: '#94A3B8', fontSize: 11 }, statValue: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }, sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0A2540' }, seeAll: { fontSize: 13, fontWeight: '600', color: '#4F46E5' },
  transactionList: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 5 }, transactionItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  txIcon: { width: 45, height: 45, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 15 }, txDetails: { flex: 1 }, txTitle: { fontSize: 15, fontWeight: '700', color: '#0A2540' }, txDate: { fontSize: 12, color: '#94A3B8', marginTop: 3 }, txAmount: { fontSize: 14, fontWeight: '700' }
});