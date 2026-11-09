import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, G } from 'react-native-svg';
import BottomNav from '../components/bottomNavBar';

const COLOR_PALETTE = [
  '#FFD700', // Gold
  '#4F46E5', // Indigo/Blue
  '#10B981', // Green
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#EC4899', // Pink
];

const CATEGORY_COLORS: any = {
  Food: '#FFD700',
  Transport: '#4F46E5',
  Bills: '#10B981',
  Shopping: '#EF4444',
  Health: '#8B5CF6',
};

export default function StatsScreen() {
  const [expense, setExpense] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const savedTxs = await AsyncStorage.getItem('@transactions');
        if (savedTxs) {
          const parsedTxs = JSON.parse(savedTxs);
          let exp = 0;
          const catMap: any = {};
          
          parsedTxs.forEach((tx: any) => {
            if (tx.type === 'expense') {
              exp += tx.amount;
              catMap[tx.category] = (catMap[tx.category] || 0) + tx.amount;
            }
          });
          
          setExpense(exp);
          
          // කැටගරි ලැයිස්තුව හදන කොටස (අලුත් පාට එකතු කරන විදිය)
          const catArray = Object.keys(catMap).map((key, index) => {
            const assignedColor = CATEGORY_COLORS[key] || COLOR_PALETTE[index % COLOR_PALETTE.length];
            
            return { 
              name: key, 
              amount: catMap[key],
              color: assignedColor 
            };
          });
          
          setCategories(catArray.sort((a, b) => b.amount - a.amount));
        }
      };
      loadData();
    }, [])
  );

  const radius = 50;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;

  // එක කැටගරි එකකට අදාළ කෑල්ල හදන function එක
  const renderPieSlice = (cat: any, index: number, previousPercentage: number) => {
    if (expense === 0) return null;
    
    const percentage = cat.amount / expense;
    const strokeDashoffset = circumference - percentage * circumference;
    
    const rotation = (previousPercentage * 360);

    return (
      <Circle
        key={index}
        cx="80"
        cy="80"
        r={radius}
        stroke={cat.color}
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="butt"
        rotation={rotation}
        origin="80, 80"
      />
    );
  };

  // කලින් කෑලි වල ප්‍රතිශතය එකතු කරගන්න
  let previousPercentage = 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.pageTitle}>Expense Breakdown</Text>

        {/* Total Expense Card */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>TOTAL EXPENSE</Text>
          <Text style={styles.totalAmount}>Rs. {expense.toFixed(2)}</Text>
        </View>

        {/* Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Category Distribution</Text>
          <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <Svg width="160" height="160" viewBox="0 0 160 160">
              <G rotation="-90" origin="80, 80">
                {/* පසුබිම් වටය */}
                <Circle cx="80" cy="80" r={radius} stroke="#E2E8F0" strokeWidth={strokeWidth} fill="transparent" />
                
                {/* එක එක කැටගරි වලට අදාළ කෑලි */}
                {categories.map((cat, index) => {
                  const slice = renderPieSlice(cat, index, previousPercentage);
                  previousPercentage += cat.amount / expense;
                  return slice;
                })}
              </G>
            </Svg>
            <View style={styles.chartCenterText}>
              {/* මෙතන තමයි දැන් හරි ගාණ විතරක් පේන්නේ */}
              <Text style={styles.chartCenterAmount}>
                Rs. {expense > 0 ? expense.toFixed(2) : '0.00'}
              </Text>
            </View>
          </View>

          {/* Legend / කැටගරි ලැයිස්තුව */}
          <View style={styles.legendContainer}>
            {categories.map((cat, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: cat.color }]} />
                <Text style={styles.legendText}>{cat.name}</Text>
              </View>
            ))}
          </View>

        </View>

        {/* Top Categories List */}
        <Text style={styles.sectionTitle}>Top Categories</Text>
        <View style={styles.listContainer}>
          {categories.length === 0 ? (
            <Text style={{ textAlign: 'center', padding: 20, color: '#94A3B8' }}>No expenses yet.</Text>
          ) : (
            categories.map((cat: any, index: number) => (
              <View key={cat.name} style={[styles.listItem, index === categories.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={[styles.listIcon, { backgroundColor: cat.color + '20' }]}>
                  <Text style={{ color: cat.color, fontWeight: '800' }}>●</Text>
                </View>
                <View style={styles.listDetails}>
                  <Text style={styles.listTitle}>{cat.name}</Text>
                </View>
                <Text style={styles.listAmount}>Rs. {cat.amount.toFixed(2)}</Text>
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
  container: { flex: 1, backgroundColor: '#F8FAFC' }, 
  scrollContent: { padding: 20, paddingBottom: 120 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: '#0A2540', marginBottom: 20 },
  totalCard: { backgroundColor: '#0A2540', borderRadius: 20, padding: 20, marginBottom: 20 },
  totalLabel: { color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  totalAmount: { color: '#FFFFFF', fontSize: 32, fontWeight: '800', marginTop: 10 },
  chartCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0A2540', marginBottom: 10 },
  chartCenterText: { position: 'absolute', alignItems: 'center', justifyContent: 'center', top: 0, bottom: 0, left: 0, right: 0 },
  chartCenterAmount: { fontSize: 16, fontWeight: '800', color: '#0A2540' }, // Font size එක 16ට අඩු කළා
  
  legendContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: '#64748B', fontWeight: '500' },

  listContainer: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 10, marginBottom: 20 },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  listIcon: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  listDetails: { flex: 1 },
  listTitle: { fontSize: 15, fontWeight: '700', color: '#0A2540' },
  listAmount: { fontSize: 15, fontWeight: '700', color: '#EF4444' }
});