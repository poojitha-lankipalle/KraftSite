import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { COLORS } from '../../theme/colors';

export default function ThankYouScreen({ navigation, route }) {
  const { orderId, trackingId, shippingDetails } = route.params;

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 6,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Animated Checkmark */}
        <Animated.View
          style={[
            styles.checkCircle,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={styles.checkEmoji}>✓</Text>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          {/* Title */}
          <Text style={styles.title}>Thank You!!!! 🙏</Text>
          <Text style={styles.subtitle}>
            Your order has been placed successfully
          </Text>

          {/* Order Details Card */}
          <View style={styles.orderCard}>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Order ID</Text>
              <Text style={styles.orderValue}>#{orderId}</Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Tracking ID</Text>
              <Text style={styles.orderValue}>{trackingId}</Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Delivering to</Text>
              <Text style={styles.orderValue}>
                {shippingDetails.city}, {shippingDetails.state}
              </Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Status</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Confirmed ✓</Text>
              </View>
            </View>
          </View>

          {/* What happens next */}
          <View style={styles.nextStepsCard}>
            <Text style={styles.nextStepsTitle}>What happens next?</Text>
            {[
              {
                icon: '📧',
                text: 'Confirmation email sent to ' + shippingDetails.email,
              },
              {
                icon: '🏺',
                text: 'Artisan will carefully pack your order',
              },
              {
                icon: '🚚',
                text: 'Order will be shipped in 1-2 business days',
              },
              {
                icon: '📱',
                text: 'You will receive SMS updates on ' + shippingDetails.phone,
              },
            ].map((item, index) => (
              <View key={index} style={styles.nextStepRow}>
                <Text style={styles.nextStepIcon}>{item.icon}</Text>
                <Text style={styles.nextStepText}>{item.text}</Text>
              </View>
            ))}
          </View>

          {/* Artisan Message */}
          <View style={styles.artisanMessage}>
            <Text style={styles.artisanMessageEmoji}>🪆</Text>
            <Text style={styles.artisanMessageText}>
              "Every doll I make carries a piece of my heart.
              Thank you for bringing our craft into your home."
            </Text>
            <Text style={styles.artisanMessageAuthor}>
              — Indian Artisan Community
            </Text>
          </View>

          {/* Share */}
          <View style={styles.shareCard}>
            <Text style={styles.shareTitle}>
              Spread the love! 💛
            </Text>
            <Text style={styles.shareText}>
              Share your purchase with friends and help support
              Indian artisans
            </Text>
          </View>
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => navigation.navigate('Tabs')}
          activeOpacity={0.85}
        >
          <Text style={styles.continueBtnText}>
            Continue Shopping 🛍️
          </Text>
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
  scroll: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  checkEmoji: {
    fontSize: 48,
    color: COLORS.white,
    fontWeight: '800',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.brown,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMedium,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginBottom: 16,
    shadowColor: COLORS.brown,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  orderLabel: {
    fontSize: 13,
    color: COLORS.textMedium,
  },
  orderValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.brown,
    maxWidth: '55%',
    textAlign: 'right',
  },
  statusBadge: {
    backgroundColor: COLORS.greenLight,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.green,
  },
  nextStepsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginBottom: 16,
  },
  nextStepsTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.brown,
    marginBottom: 12,
  },
  nextStepRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  nextStepIcon: {
    fontSize: 18,
  },
  nextStepText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textMedium,
    lineHeight: 20,
  },
  artisanMessage: {
    backgroundColor: COLORS.goldLight,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  artisanMessageEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  artisanMessageText: {
    fontSize: 14,
    color: COLORS.brown,
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  artisanMessageAuthor: {
    fontSize: 12,
    color: COLORS.textMedium,
    marginTop: 8,
    fontWeight: '600',
  },
  shareCard: {
    backgroundColor: COLORS.terracotta,
    borderRadius: 16,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  shareTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 6,
  },
  shareText: {
    fontSize: 13,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.9,
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
    backgroundColor: COLORS.brown,
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