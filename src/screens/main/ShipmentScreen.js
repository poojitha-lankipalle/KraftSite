import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { COLORS } from '../../theme/colors';

export default function ShipmentScreen({ navigation, route }) {
  const { shippingDetails } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Generate random order ID
  const orderId = `KS${Math.floor(100000 + Math.random() * 900000)}`;
  const trackingId = `TRK${Math.floor(1000000 + Math.random() * 9000000)}`;

  // Estimated delivery — 5 to 7 days from now
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 6);
  const deliveryDateStr = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const steps = [
    {
      icon: '✅',
      title: 'Order Placed',
      subtitle: 'Your order has been confirmed',
      done: true,
    },
    {
      icon: '🏺',
      title: 'Artisan Preparing',
      subtitle: 'Your item is being carefully packed',
      done: true,
    },
    {
      icon: '🚚',
      title: 'Out for Delivery',
      subtitle: 'Expected in 5-7 business days',
      done: false,
    },
    {
      icon: '🏠',
      title: 'Delivered',
      subtitle: deliveryDateStr,
      done: false,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order Confirmed!</Text>
        <Text style={styles.headerSubtitle}>
          Order #{orderId}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Success Banner */}
          <View style={styles.successBanner}>
            <Text style={styles.successEmoji}>🎉</Text>
            <Text style={styles.successTitle}>
              Payment Successful!
            </Text>
            <Text style={styles.successSubtitle}>
              Thank you for supporting Indian artisans.{'\n'}
              Your handcrafted treasure is on its way!
            </Text>
          </View>

          {/* Tracking Card */}
          <View style={styles.trackingCard}>
            <Text style={styles.cardTitle}>📍 Tracking Details</Text>
            <View style={styles.trackingRow}>
              <Text style={styles.trackingLabel}>Tracking ID</Text>
              <Text style={styles.trackingValue}>{trackingId}</Text>
            </View>
            <View style={styles.trackingRow}>
              <Text style={styles.trackingLabel}>Estimated Delivery</Text>
              <Text style={styles.trackingValue}>{deliveryDateStr}</Text>
            </View>
            <View style={styles.trackingRow}>
              <Text style={styles.trackingLabel}>Shipping To</Text>
              <Text style={styles.trackingValue}>
                {shippingDetails.city}, {shippingDetails.state}
              </Text>
            </View>
          </View>

          {/* Shipment Steps */}
          <View style={styles.stepsCard}>
            <Text style={styles.cardTitle}>🚚 Shipment Status</Text>
            {steps.map((step, index) => (
              <View key={index} style={styles.stepRow}>
                <View style={styles.stepLeft}>
                  <View
                    style={[
                      styles.stepIconWrap,
                      step.done && styles.stepIconWrapDone,
                    ]}
                  >
                    <Text style={styles.stepIcon}>{step.icon}</Text>
                  </View>
                  {index < steps.length - 1 && (
                    <View
                      style={[
                        styles.stepConnector,
                        step.done && styles.stepConnectorDone,
                      ]}
                    />
                  )}
                </View>
                <View style={styles.stepRight}>
                  <Text
                    style={[
                      styles.stepTitle,
                      !step.done && styles.stepTitlePending,
                    ]}
                  >
                    {step.title}
                  </Text>
                  <Text style={styles.stepSubtitle}>
                    {step.subtitle}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Delivery Address */}
          <View style={styles.addressCard}>
            <Text style={styles.cardTitle}>📦 Delivery Address</Text>
            <Text style={styles.addressName}>
              {shippingDetails.fullName}
            </Text>
            <Text style={styles.addressText}>
              {shippingDetails.address}
            </Text>
            <Text style={styles.addressText}>
              {shippingDetails.city}, {shippingDetails.state} -{' '}
              {shippingDetails.pincode}
            </Text>
            <Text style={styles.addressPhone}>
              📱 {shippingDetails.phone}
            </Text>
          </View>

          {/* Artisan Note */}
          <View style={styles.artisanNote}>
            <Text style={styles.artisanNoteText}>
              🧑‍🎨 A portion of your purchase goes directly to the
              artisan who crafted your doll. Your support helps keep
              these ancient Indian art forms alive for future
              generations.
            </Text>
          </View>

          <View style={{ height: 100 }} />
        </Animated.View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => navigation.navigate('ThankYou', {
            orderId,
            trackingId,
            shippingDetails,
          })}
          activeOpacity={0.85}
        >
          <Text style={styles.continueBtnText}>
            Continue →
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
  header: {
    backgroundColor: COLORS.brown,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.cream,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.beige,
    marginTop: 4,
  },
  successBanner: {
    backgroundColor: COLORS.green,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  successEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.9,
  },
  trackingCard: {
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
    marginBottom: 12,
  },
  trackingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  trackingLabel: {
    fontSize: 13,
    color: COLORS.textMedium,
  },
  trackingValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.brown,
    maxWidth: '55%',
    textAlign: 'right',
  },
  stepsCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  stepLeft: {
    alignItems: 'center',
    width: 40,
  },
  stepIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.beige,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  stepIconWrapDone: {
    backgroundColor: COLORS.greenLight,
    borderColor: COLORS.green,
  },
  stepIcon: {
    fontSize: 18,
  },
  stepConnector: {
    width: 2,
    height: 24,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  stepConnectorDone: {
    backgroundColor: COLORS.green,
  },
  stepRight: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 16,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.brown,
  },
  stepTitlePending: {
    color: COLORS.textLight,
  },
  stepSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  addressCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
  },
  addressName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.brown,
  },
  addressText: {
    fontSize: 14,
    color: COLORS.textMedium,
    marginTop: 4,
  },
  addressPhone: {
    fontSize: 14,
    color: COLORS.textMedium,
    marginTop: 4,
  },
  artisanNote: {
    backgroundColor: COLORS.goldLight,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  artisanNoteText: {
    fontSize: 13,
    color: COLORS.brown,
    lineHeight: 20,
    textAlign: 'center',
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