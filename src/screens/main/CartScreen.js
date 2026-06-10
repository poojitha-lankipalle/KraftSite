import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../theme/colors';

// ─── Cart Item Row ───
function CartItemRow({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  const confirmRemove = () => {
    Alert.alert(
      'Remove item',
      `Remove "${item.product.name}" from cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFromCart(item.product.id),
        },
      ]
    );
  };

  return (
    <View style={styles.itemRow}>
      <Image
        source={{ uri: item.product.image }}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemOrigin}>{item.product.origin}</Text>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.product.name}
        </Text>
        <Text style={styles.itemArtisan}>by {item.product.artisan}</Text>
        <Text style={styles.itemPrice}>
          ${(item.product.price * item.quantity).toLocaleString()}
        </Text>
      </View>
      <View style={styles.itemControls}>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() =>
            updateQuantity(item.product.id, item.quantity + 1)
          }
        >
          <Text style={styles.qtyBtnText}>+</Text>
        </TouchableOpacity>
        <Text style={styles.qtyValue}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() =>
            updateQuantity(item.product.id, item.quantity - 1)
          }
        >
          <Text style={styles.qtyBtnText}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={confirmRemove}
        >
          <Text style={styles.removeBtnText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function CartScreen({ navigation }) {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const { isGuest } = useAuth();

  const shipping = totalPrice > 75 ? 0 : 9.99;
  const tax = parseFloat((totalPrice * 0.08).toFixed(2));
  const grandTotal = parseFloat((totalPrice + shipping + tax).toFixed(2));

  // Empty cart
  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySub}>
          Explore our handcrafted dolls and add something beautiful!
        </Text>
        <TouchableOpacity
          style={styles.shopBtn}
          onPress={() => navigation.navigate('HomeTab')}
          activeOpacity={0.85}
        >
          <Text style={styles.shopBtnText}>Browse Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

 const handleCheckout = () => {
  if (isGuest) {
    Alert.alert(
      'Login required',
      'Please login or create an account to checkout.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Login',
          onPress: () => navigation.navigate('Login'),
        },
      ]
    );
    return;
  }
  navigation.navigate('ConfirmDetails');
};

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        <Text style={styles.headerCount}>
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <View style={styles.itemsList}>
          {items.map((item) => (
            <CartItemRow key={item.product.id} item={item} />
          ))}
        </View>

        {/* Free Shipping Banner */}
        {shipping > 0 && (
          <View style={styles.shippingBanner}>
            <Text style={styles.shippingBannerText}>
              🚚 Add ${(75 - totalPrice).toFixed(2)}  more for
              FREE shipping!
            </Text>
          </View>
        )}

        {/* Price Breakdown */}
        <View style={styles.priceCard}>
          <Text style={styles.priceCardTitle}>Price Details</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              Price ({totalItems} items)
            </Text>
            <Text style={styles.priceValue}>
              ${totalPrice.toLocaleString()}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Shipping</Text>
            <Text
              style={[
                styles.priceValue,
                shipping === 0 && { color: COLORS.green },
              ]}
            >
              {shipping === 0 ? 'FREE' : `${shipping}`}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Sales Tax (8%)</Text>
            <Text style={styles.priceValue}>${tax.toLocaleString()}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>
              ${grandTotal.toLocaleString()}
            </Text>
          </View>

          {shipping === 0 && (
            <Text style={styles.savingText}>
              🎉 You are saving $9.99 on shipping!
            </Text>
          )}
        </View>

        {/* Artisan Note */}
        <View style={styles.artisanNote}>
          <Text style={styles.artisanNoteText}>
            🧑‍🎨 Your purchase directly supports Indian artisans and
            their families. Thank you for keeping these crafts alive!
          </Text>
        </View>

        {/* Clear Cart */}
        <TouchableOpacity
          style={styles.clearBtn}
          onPress={() =>
            Alert.alert('Clear cart', 'Remove all items from cart?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear', style: 'destructive', onPress: clearCart },
            ])
          }
        >
          <Text style={styles.clearBtnText}>Clear Cart</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.checkoutBar}>
        <View>
          <Text style={styles.checkoutTotal}>
            ${grandTotal.toLocaleString()}
          </Text>
          <Text style={styles.checkoutTotalLabel}>Total payable</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={handleCheckout}
          activeOpacity={0.85}
        >
          <Text style={styles.checkoutBtnText}>
            Proceed to Checkout →
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: COLORS.brown,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.cream,
  },
  headerCount: {
    fontSize: 14,
    color: COLORS.beige,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cream,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.brown,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 15,
    color: COLORS.textMedium,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  shopBtn: {
    backgroundColor: COLORS.terracotta,
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  shopBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  itemsList: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 10,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: COLORS.beige,
  },
  itemInfo: {
    flex: 1,
  },
  itemOrigin: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.terracotta,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.brown,
    marginTop: 2,
    lineHeight: 19,
  },
  itemArtisan: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.brown,
    marginTop: 4,
  },
  itemControls: {
    alignItems: 'center',
    gap: 6,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    backgroundColor: COLORS.beige,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  qtyBtnText: {
    fontSize: 16,
    color: COLORS.brown,
    fontWeight: '700',
    lineHeight: 20,
  },
  qtyValue: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.brown,
  },
  removeBtn: {
    marginTop: 2,
  },
  removeBtnText: {
    fontSize: 16,
  },
  shippingBanner: {
    backgroundColor: COLORS.goldLight,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  shippingBannerText: {
    fontSize: 13,
    color: COLORS.brown,
    fontWeight: '600',
    textAlign: 'center',
  },
  priceCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
  },
  priceCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.brown,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.textMedium,
  },
  priceValue: {
    fontSize: 14,
    color: COLORS.brown,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.brown,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.brown,
  },
  savingText: {
    fontSize: 13,
    color: COLORS.green,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  artisanNote: {
    backgroundColor: COLORS.goldLight,
    marginHorizontal: 16,
    marginTop: 12,
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
  clearBtn: {
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
  },
  clearBtnText: {
    fontSize: 14,
    color: COLORS.error,
    fontWeight: '600',
  },
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  checkoutTotal: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.brown,
  },
  checkoutTotalLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
  checkoutBtn: {
    backgroundColor: COLORS.terracotta,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  checkoutBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
});