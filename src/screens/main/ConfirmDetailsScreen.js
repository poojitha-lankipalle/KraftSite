import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { COLORS } from '../../theme/colors';

export default function ConfirmDetailsScreen({ navigation }) {
  const { user } = useAuth();
  const { items, totalPrice } = useCart();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [focused, setFocused] = useState(null);

  const update = (key) => (value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const { fullName, email, phone, address, city, state, pincode } = form;
    if (!fullName || !email || !phone || !address || !city || !state || !pincode) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return false;
    }
    if (phone.length < 10) {
      Alert.alert('Invalid phone', 'Please enter a valid 10-digit phone number.');
      return false;
    }
    if (pincode.length !== 5) {
      Alert.alert('Invalid pincode', 'Please enter a valid 6-digit pincode.');
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (!validate()) return;
    navigation.navigate('Payment', { shippingDetails: form });
  };

const shipping = totalPrice > 75 ? 0 : 9.99;
const tax = parseFloat((totalPrice * 0.08).toFixed(2));
const grandTotal = parseFloat((totalPrice + shipping + tax).toFixed(2));

  const fields = [
    {
      key: 'fullName',
      label: 'Full Name',
      placeholder: 'Your full name',
      capitalize: 'words',
      keyboard: 'default',
    },
    {
      key: 'email',
      label: 'Email',
      placeholder: 'your@email.com',
      capitalize: 'none',
      keyboard: 'email-address',
    },
    {
      key: 'phone',
      label: 'Phone Number',
      placeholder: '10-digit mobile number',
      capitalize: 'none',
      keyboard: 'phone-pad',
    },
    {
      key: 'address',
      label: 'Street Address',
      placeholder: 'House no, Street, Area',
      capitalize: 'sentences',
      keyboard: 'default',
    },
    {
      key: 'city',
      label: 'City',
      placeholder: 'Your city',
      capitalize: 'words',
      keyboard: 'default',
    },
    {
      key: 'state',
      label: 'State',
      placeholder: 'Your state',
      capitalize: 'words',
      keyboard: 'default',
    },
    {
      key: 'pincode',
      label: 'Pincode',
      placeholder: '5-digit pincode',
      capitalize: 'none',
      keyboard: 'number-pad',
    },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shipping Details</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Steps */}
        <View style={styles.steps}>
          {['Details', 'Payment', 'Confirm'].map((step, index) => (
            <View key={step} style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  index === 0 && styles.stepCircleActive,
                ]}
              >
                <Text
                  style={[
                    styles.stepNumber,
                    index === 0 && styles.stepNumberActive,
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  index === 0 && styles.stepLabelActive,
                ]}
              >
                {step}
              </Text>
              {index < 2 && <View style={styles.stepLine} />}
            </View>
          ))}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Form */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>📦 Delivery Address</Text>

            {fields.map(({ key, label, placeholder, capitalize, keyboard }) => (
              <View key={key}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                  style={[
                    styles.input,
                    focused === key && styles.inputFocused,
                  ]}
                  placeholder={placeholder}
                  placeholderTextColor={COLORS.textLight}
                  autoCapitalize={capitalize}
                  keyboardType={keyboard}
                  value={form[key]}
                  onChangeText={update(key)}
                  onFocus={() => setFocused(key)}
                  onBlur={() => setFocused(null)}
                />
              </View>
            ))}
          </View>

          {/* Order Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>🧾 Order Summary</Text>
            {items.map((item) => (
              <View key={item.product.id} style={styles.summaryRow}>
                <Text style={styles.summaryName} numberOfLines={1}>
                  {item.product.name}
                </Text>
                <Text style={styles.summaryQty}>×{item.quantity}</Text>
                <Text style={styles.summaryPrice}>
                  ${(item.product.price * item.quantity).toLocaleString()}
                </Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text
                style={[
                  styles.summaryPrice,
                  shipping === 0 && { color: COLORS.green },
                ]}
              >
                {shipping === 0 ? 'FREE' : `${shipping}`}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>GST (18%)</Text>
              <Text style={styles.summaryPrice}>
                ${tax.toLocaleString()}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>
                ${grandTotal.toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Continue Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.continueBtnText}>
              Continue to Payment →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: COLORS.brown,
  },
  backBtn: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.brownLight,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 20,
    color: COLORS.cream,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.cream,
  },
  steps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 4,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.beige,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: COLORS.terracotta,
    borderColor: COLORS.terracotta,
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  stepNumberActive: {
    color: COLORS.white,
  },
  stepLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  stepLabelActive: {
    color: COLORS.terracotta,
    fontWeight: '700',
  },
  stepLine: {
    width: 24,
    height: 2,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },
  formCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.brown,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMedium,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textDark,
    backgroundColor: COLORS.paper,
    marginBottom: 14,
  },
  inputFocused: {
    borderColor: COLORS.terracotta,
    backgroundColor: COLORS.white,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.brown,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryName: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textMedium,
  },
  summaryQty: {
    fontSize: 13,
    color: COLORS.textLight,
    marginRight: 8,
  },
  summaryPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.brown,
  },
  summaryLabel: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textMedium,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  grandTotalLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.brown,
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.terracotta,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  continueBtn: {
    backgroundColor: COLORS.terracotta,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});