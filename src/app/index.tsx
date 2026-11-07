import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Top Logo & Name */}
        <View style={styles.header}>
          {/* මෙතන ඔයාගේ ලෝගෝ එක දාන්න පුළුවන්. දැනට අයිකන් එකක් දාලා තියෙනවා */}
          <View style={styles.logoIcon}>
            <Ionicons name="wallet" size={24} color="#FFF" />
          </View>
          <View>
            <Text style={styles.logoText}>MyWallet</Text>
            <Text style={styles.logoSubText}>SMART WEALTH & EXPENSES</Text>
          </View>
        </View>

        {/* Hero Image / Illustration */}
        <View style={styles.imageContainer}>
          {/* මෙතන ඔයාගේ Wallet පින්තූරය (3D) එක දාන්න. දැනට ලොකු අයිකන් එකක් දාලා තියෙනවා */}
          <View style={styles.illustrationBox}>
            <MaterialCommunityIcons name="wallet-outline" size={100} color="#003580" />
            {/* රන්වන් පාට කාසි */}
            <View style={[styles.coin, { top: -10, right: 20, backgroundColor: '#FFD700' }]}>
              <Text style={styles.coinText}>Rs</Text>
            </View>
            <View style={[styles.coin, { top: 20, left: -10, backgroundColor: '#FFC107' }]}>
              <Text style={styles.coinText}>$</Text>
            </View>
          </View>
        </View>

        {/* Titles */}
        <Text style={styles.title}>Welcome to MyWallet</Text>
        <Text style={styles.subtitle}>Manage your money smartly</Text>
        <Text style={styles.description}>
          Track expenses, budget in Sri Lankan Rupees (LKR), and achieve financial clarity effortlessly.
        </Text>

        {/* Features Grid */}
        <View style={styles.grid}>
          <View style={styles.card}>
            <View style={styles.cardIconBox}>
              <Ionicons name="document-text" size={20} color="#003580" />
            </View>
            <Text style={styles.cardTitle}>Daily Expense Tracking</Text>
            <Text style={styles.cardSub}>Effortless logging in LKR</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardIconBox}>
              <MaterialCommunityIcons name="piggy-bank" size={20} color="#003580" />
            </View>
            <Text style={styles.cardTitle}>Smart Budgets</Text>
            <Text style={styles.cardSub}>Automated monthly goals</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardIconBox}>
              <Ionicons name="stats-chart" size={20} color="#003580" />
            </View>
            <Text style={styles.cardTitle}>Real-time Insights</Text>
            <Text style={styles.cardSub}>Clear spending trends</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardIconBox}>
              <Ionicons name="shield-checkmark" size={20} color="#003580" />
            </View>
            <Text style={styles.cardTitle}>100% Secure</Text>
            <Text style={styles.cardSub}>Private, protected data</Text>
          </View>
        </View>

        {/* Get Started Button */}
        <TouchableOpacity style={styles.button} onPress={onComplete}>
          <Text style={styles.buttonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="#000" style={{ marginLeft: 8 }} />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 30,
    marginTop: 10,
  },
  logoIcon: {
    backgroundColor: '#0A2540', // තද නිල් පාට
    padding: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0A2540',
  },
  logoSubText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#888',
    letterSpacing: 1,
  },
  imageContainer: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationBox: {
    width: 160,
    height: 140,
    backgroundColor: '#F0F4F8',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  coin: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  coinText: {
    fontWeight: 'bold',
    color: '#0A2540',
    fontSize: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0A2540',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D4AF37', // Gold color
    marginTop: 5,
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  card: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardIconBox: {
    backgroundColor: '#E0E7FF',
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A2540',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  button: {
    backgroundColor: '#FFD700', // Gold Button
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
});