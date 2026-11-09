import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/bottomNavBar';

export default function AddTransactionScreen() {
  const router = useRouter();
  
  // Transaction States
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  
  // Categories State
  const [expenseCategories, setExpenseCategories] = useState(['Food', 'Transport', 'Bills', 'Shopping', 'Health']);
  const [incomeCategories, setIncomeCategories] = useState(['Salary', 'Business', 'Investment', 'Gift']);
  const [category, setCategory] = useState('Food');

  // Modal State for Adding New Category
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Keypad numbers
  const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];

  const handleKeyPress = (key: string) => {
    if (key === '⌫') {
      setAmount(amount.slice(0, -1));
    } else {
      if (key === '.' && amount.includes('.')) return;
      setAmount(amount + key);
    }
  };

  // Add New Category Function
  const handleAddNewCategory = () => {
    if (newCategoryName.trim() === '') {
      Alert.alert("Error", "Please enter a category name.");
      return;
    }
    
    const newCat = newCategoryName.trim();
    
    if (type === 'expense') {
      setExpenseCategories([...expenseCategories, newCat]);
    } else {
      setIncomeCategories([...incomeCategories, newCat]);
    }
    
    // Automatically select the new category
    setCategory(newCat);
    
    // Reset and close modal
    setNewCategoryName('');
    setIsModalVisible(false);
  };

  const handleSave = async () => {
    if (!amount || amount === '0' || amount === '0.00') {
      Alert.alert("Error", "Please enter a valid amount.");
      return;
    }

    try {
      const newTransaction = {
        id: Date.now().toString(),
        type: type,
        amount: parseFloat(amount),
        category: category,
        date: new Date().toISOString(),
      };

      const existingData = await AsyncStorage.getItem('@transactions');
      const transactions = existingData ? JSON.parse(existingData) : [];
      await AsyncStorage.setItem('@transactions', JSON.stringify([newTransaction, ...transactions]));

      Alert.alert("Success", "Transaction saved successfully!");
      router.push('/home' as any);
    } catch (error) {
      Alert.alert("Error", "Failed to save transaction.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.pageTitle}>{type === 'expense' ? 'Add Expense' : 'Add Income'}</Text>
        </View>

        {/* Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleBtn, type === 'expense' && styles.toggleActiveRed]}
            onPress={() => { setType('expense'); setCategory('Food'); }}
          >
            <Ionicons name="arrow-up" size={16} color={type === 'expense' ? '#EF4444' : '#94A3B8'} />
            <Text style={[styles.toggleText, type === 'expense' && styles.toggleTextActiveRed]}>Expense</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.toggleBtn, type === 'income' && styles.toggleActiveGreen]}
            onPress={() => { setType('income'); setCategory('Salary'); }}
          >
            <Ionicons name="arrow-down" size={16} color={type === 'income' ? '#10B981' : '#94A3B8'} />
            <Text style={[styles.toggleText, type === 'income' && styles.toggleTextActiveGreen]}>Income</Text>
          </TouchableOpacity>
        </View>

        {/* Amount */}
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>ENTER AMOUNT</Text>
          <View style={styles.amountBox}>
            <Text style={styles.currencySymbol}>Rs</Text>
            <Text style={styles.amountValue}>{amount || '0.00'}</Text>
          </View>
        </View>

        {/* Categories Header with Add New Button */}
        <View style={styles.categoryHeader}>
          <Text style={styles.sectionTitle}>Select Category</Text>
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <Text style={styles.addNewText}>+ Add New</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.categoryGrid}>
          {(type === 'expense' ? expenseCategories : incomeCategories).map((cat) => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Keypad */}
        <View style={styles.keypadContainer}>
          {keypad.map((key) => (
            <TouchableOpacity key={key} style={styles.keypadBtn} onPress={() => handleKeyPress(key)}>
              <Text style={styles.keypadText}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
          <Text style={styles.saveBtnText}>{type === 'expense' ? 'Save Transaction' : 'Record Income'}</Text>
        </TouchableOpacity>

      </ScrollView>
      
      <BottomNav />

      {/* Custom Modal for Adding New Category */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Category</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Education, Fuel, Gifts..."
              placeholderTextColor="#94A3B8"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              autoFocus={true}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalCancelBtn]} 
                onPress={() => { setIsModalVisible(false); setNewCategoryName(''); }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalAddBtn]} 
                onPress={handleAddNewCategory}
              >
                <Text style={styles.modalAddText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' }, 
  scrollContent: { padding: 20, paddingBottom: 120 },
  header: { marginBottom: 20 }, 
  pageTitle: { fontSize: 22, fontWeight: '800', color: '#0A2540' },
  toggleContainer: { flexDirection: 'row', backgroundColor: '#EEF2FF', borderRadius: 20, padding: 5, marginBottom: 25 },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 16, gap: 6 },
  toggleActiveRed: { backgroundColor: '#FFFFFF', elevation: 2 }, 
  toggleActiveGreen: { backgroundColor: '#FFFFFF', elevation: 2 },
  toggleText: { fontSize: 14, fontWeight: '600', color: '#94A3B8' }, 
  toggleTextActiveRed: { color: '#EF4444' }, 
  toggleTextActiveGreen: { color: '#10B981' },
  amountContainer: { alignItems: 'center', marginBottom: 25 }, 
  amountLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', marginBottom: 10 },
  amountBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', paddingHorizontal: 20, paddingVertical: 15, borderRadius: 20, minWidth: '80%', justifyContent: 'center' },
  currencySymbol: { fontSize: 22, fontWeight: '800', color: '#0A2540', marginRight: 8 }, 
  amountValue: { fontSize: 28, fontWeight: '800', color: '#0A2540' },
  
  categoryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#0A2540' }, 
  addNewText: { fontSize: 13, color: '#4F46E5', fontWeight: '700' },
  
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  categoryChip: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  categoryChipActive: { backgroundColor: '#0A2540', borderColor: '#0A2540' }, 
  categoryText: { fontSize: 13, fontWeight: '600', color: '#64748B' }, 
  categoryTextActive: { color: '#FFFFFF' },
  keypadContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  keypadBtn: { width: '30%', backgroundColor: '#F1F5F9', height: 60, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }, 
  keypadText: { fontSize: 22, fontWeight: '600', color: '#0A2540' },
  saveBtn: { flexDirection: 'row', backgroundColor: '#0A2540', height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10 }, 
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

  /* Modal Styles */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFFFFF', width: '85%', borderRadius: 20, padding: 25, elevation: 10 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0A2540', marginBottom: 15 },
  modalInput: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, height: 50, paddingHorizontal: 15, fontSize: 15, color: '#0A2540', marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  modalBtn: { flex: 1, height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  modalCancelBtn: { backgroundColor: '#F1F5F9' },
  modalAddBtn: { backgroundColor: '#0A2540' },
  modalCancelText: { color: '#64748B', fontWeight: '700', fontSize: 15 },
  modalAddText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});