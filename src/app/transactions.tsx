import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AllTransactionsScreen() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]); 
  const [isSelectionMode, setIsSelectionMode] = useState(false); 
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const savedTxs = await AsyncStorage.getItem('@transactions');
        if (savedTxs) {
          setTransactions(JSON.parse(savedTxs));
        }
      };
      loadData();
    }, [])
  );

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      const newSelected = selectedIds.filter((item) => item !== id);
      setSelectedIds(newSelected);
      if (newSelected.length === 0) setIsSelectionMode(false);
    } else {
      setSelectedIds([...selectedIds, id]);
      setIsSelectionMode(true);
    }
  };

  const handleDeleteSelected = () => {
    Alert.alert(
      "Delete Selected",
      `Are you sure you want to delete ${selectedIds.length} transaction(s)?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            const updatedTxs = transactions.filter((tx) => !selectedIds.includes(tx.id));
            setTransactions(updatedTxs);
            await AsyncStorage.setItem('@transactions', JSON.stringify(updatedTxs));
            
            setSelectedIds([]);
            setIsSelectionMode(false);
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={[styles.header, isSelectionMode && { backgroundColor: '#FEF2F2' }]}>
        {isSelectionMode ? (
          <>
            <TouchableOpacity onPress={() => { setSelectedIds([]); setIsSelectionMode(false); }} style={styles.backBtn}>
              <Ionicons name="close" size={24} color="#EF4444" />
            </TouchableOpacity>
            <Text style={[styles.pageTitle, { color: '#EF4444' }]}>{selectedIds.length} Selected</Text>
            <TouchableOpacity onPress={handleDeleteSelected} style={styles.deleteHeaderBtn}>
              <Ionicons name="trash-outline" size={24} color="#EF4444" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color="#0A2540" />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>All Transactions</Text>
            <View style={{ width: 24 }} />
          </>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.transactionList}>
          {transactions.length === 0 ? (
            <Text style={{ textAlign: 'center', padding: 20, color: '#94A3B8' }}>No transactions found.</Text>
          ) : (
            transactions.map((tx: any, index: number) => {
              const isSelected = selectedIds.includes(tx.id);

              return (
                <TouchableOpacity 
                  key={tx.id} 
                  style={[
                    styles.transactionItem, 
                    index === transactions.length - 1 && { borderBottomWidth: 0 },
                    isSelected && { backgroundColor: '#F0FDF4' }
                  ]}
                  onLongPress={() => toggleSelection(tx.id)}
                  onPress={() => {
                    if (isSelectionMode) toggleSelection(tx.id);
                  }}
                  activeOpacity={0.7}
                >
                  {isSelectionMode && (
                    <View style={styles.checkbox}>
                      <Ionicons 
                        name={isSelected ? "checkmark-circle" : "ellipse-outline"} 
                        size={24} 
                        color={isSelected ? "#10B981" : "#94A3B8"} 
                      />
                    </View>
                  )}

                  <View style={[styles.txIcon, { backgroundColor: tx.type === 'income' ? '#D1FAE5' : '#FEF3C7' }]}>
                    <MaterialCommunityIcons name={tx.type === 'income' ? 'cash' : 'cart'} size={20} color={tx.type === 'income' ? '#047857' : '#D97706'} />
                  </View>
                  
                  <View style={styles.txDetails}>
                    <Text style={styles.txTitle}>{tx.category}</Text>
                    <Text style={styles.txDate}>{new Date(tx.date).toLocaleString()}</Text>
                  </View>

                  <View style={styles.rightSide}>
                    <Text style={[styles.txAmount, { color: tx.type === 'income' ? '#10B981' : '#EF4444' }]}>
                      {tx.type === 'income' ? '+' : '-'} Rs. {tx.amount.toFixed(2)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backBtn: { padding: 5 },
  deleteHeaderBtn: { padding: 5 },
  pageTitle: { fontSize: 18, fontWeight: '800', color: '#0A2540' },
  scrollContent: { padding: 20 },
  transactionList: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 5 },
  transactionItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', borderRadius: 10 },
  checkbox: { marginRight: 10 },
  txIcon: { width: 45, height: 45, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  txDetails: { flex: 1 },
  txTitle: { fontSize: 15, fontWeight: '700', color: '#0A2540' },
  txDate: { fontSize: 12, color: '#94A3B8', marginTop: 3 },
  rightSide: { alignItems: 'flex-end', justifyContent: 'center' },
  txAmount: { fontSize: 14, fontWeight: '700' },
});