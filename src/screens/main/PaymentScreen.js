import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { useCart } from '../../context/CartContext';
import { COLORS } from '../../theme/colors';

export default function PaymentScreen({ navigation, route }) {
  const { confirmPayment } = useStripe();
  const { items, totalPrice, clearCart } = useCart();
  const { shippingDetails } = route.params;
  const [loading, setLoading] = useState(false);

const shipping = totalPrice > 75 ? 0 : 9.99;
const tax = parseFloat((totalPrice * 0.08).toFixed(2));
const grandTotal = parseFloat((totalPrice + shipping + tax).toFixed(2));

  const handlePayment = async () => {
    setLoading(true);
    try {
      const { error, paymentIntent } = await confirmPayment(
        'pi_3MqFGELkdIwHu7ix0h9TeTGR_secret_test_placeholder',
        {
          paymentMethodType: 'Card',
          paymentMethodData: {
            billingDetails: {
              name: shippingDetails.fullName,
              email: shippingDetails.email,
            },
          },
        }
      );

      if (error && error.code === 'Canceled') {
        setLoading(false);
        return;
      }

      // Demo mode — proceed to shipment
      clearCart();
      navigation.navigate('Shipment', { shippingDetails });
    } catch (e) {
      // Demo fallback
      clearCart();
      navigation.navigate('Shipment', { shippingDetails });
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Steps */}
      <View style={styles.steps}>
        {['Details', 'Payment', 'Confirm'].map((step, index) => (
          <View key={step} style={styles.stepItem}>
            <View
              style={[
                styles.stepCircle,
                index <= 1 && styles.stepCircleActive,
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  index <= 1 && styles.stepNumberActive,
                ]}
              >
                {index + 1}
              </Text>
            </View>
            <Text
              style={[
                styles.stepLabel,
                index <= 1 && styles.stepLabelActive,
              ]}
            >
              {step}
            </Text>
            {index < 2 && (
              <View
                style={[
                  styles.stepLine,
                  index === 0 && styles.stepLineActive,
                ]}
              />
            )}
          </View>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Shipping Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📦 Delivering to</Text>
          <Text style={styles.addressName}>{shippingDetails.fullName}</Text>
          <Text style={styles.addressText}>
            {shippingDetails.address}, {shippingDetails.city}
          </Text>
          <Text style={styles.addressText}>
            {shippingDetails.state} - {shippingDetails.pincode}
          </Text>
          <Text style={styles.addressPhone}>
            📱 {shippingDetails.phone}
          </Text>
        </View>

        {/* Test Card Info */}
        <View style={styles.testCard}>
          <Text style={styles.testCardTitle}>
            🔐 Stripe Test Payment
          </Text>
          <Text style={styles.testCardSubtitle}>
            Use these test card details:
          </Text>
          <View style={styles.testCardDetails}>
            <View style={styles.testCardRow}>
              <Text style={styles.testCardLabel}>Card Number</Text>
              <Text style={styles.testCardValue}>
                4242 4242 4242 4242
              </Text>
            </View>
            <View style={styles.testCardRow}>
              <Text style={styles.testCardLabel}>Expiry</Text>
              <Text style={styles.testCardValue}>12/34</Text>
            </View>
            <View style={styles.testCardRow}>
              <Text style={styles.testCardLabel}>CVC</Text>
              <Text style={styles.testCardValue}>123</Text>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🧾 Order Items</Text>
          {items.map((item) => (
            <View key={item.product.id} style={styles.orderItem}>
              <Text style={styles.orderItemName} numberOfLines={1}>
                {item.product.name}
              </Text>
              <Text style={styles.orderItemQty}>×{item.quantity}</Text>
              <Text style={styles.orderItemPrice}>
                ${(item.product.price * item.quantity).toLocaleString()}
              </Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.orderItem}>
            <Text style={styles.orderItemLabel}>Shipping</Text>
            <Text
              style={[
                styles.orderItemPrice,
                shipping === 0 && { color: COLORS.green },
              ]}
            >
              {shipping === 0 ? 'FREE' : `${shipping}`}
            </Text>
          </View>
          <View style={styles.orderItem}>
            <Text style={styles.orderItemLabel}>Sales Tax (8%)</Text>
            <Text style={styles.orderItemPrice}>
              ${tax.toLocaleString()}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.orderItem}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>
              ${grandTotal.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Secure Note */}
        <View style={styles.secureNote}>
          <Text style={styles.secureNoteText}>
            🔒 Your payment is secured by Stripe.{'\n'}
            256-bit SSL encryption. No card data stored.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Pay Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.payBtn, loading && { opacity: 0.7 }]}
          onPress={handlePayment}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.payBtnText}>
              🔒 Pay ${grandTotal.toLocaleString()}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
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
  stepLineActive: {
    backgroundColor: COLORS.terracotta,
  },
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.brown,
    marginBottom: 10,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.brown,
  },
  addressText: {
    fontSize: 14,
    color: COLORS.textMedium,
    marginTop: 2,
  },
  addressPhone: {
    fontSize: 14,
    color: COLORS.textMedium,
    marginTop: 4,
  },
  testCard: {
    backgroundColor: COLORS.goldLight,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  testCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.brown,
    marginBottom: 4,
  },
  testCardSubtitle: {
    fontSize: 13,
    color: COLORS.textMedium,
    marginBottom: 12,
  },
  testCardDetails: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  testCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  testCardLabel: {
    fontSize: 13,
    color: COLORS.textMedium,
  },
  testCardValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.brown,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderItemName: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textMedium,
  },
  orderItemQty: {
    fontSize: 13,
    color: COLORS.textLight,
    marginRight: 8,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.brown,
  },
  orderItemLabel: {
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
  secureNote: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    backgroundColor: COLORS.greenLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.green,
  },
  secureNoteText: {
    fontSize: 13,
    color: COLORS.green,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
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
  payBtn: {
    backgroundColor: COLORS.terracotta,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  payBtnText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '800',
  },
});