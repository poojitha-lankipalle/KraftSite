import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { PRODUCTS } from '../../data/products';
import { COLORS } from '../../theme/colors';

const { width } = Dimensions.get('window');

// ─── Star Rating ───
function StarRating({ rating }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Text key={star} style={{ fontSize: 14 }}>
          {rating >= star ? '⭐' : '☆'}
        </Text>
      ))}
    </View>
  );
}

// ─── Similar Products ───
function SimilarProducts({ currentProduct, navigation }) {
  const similar = PRODUCTS.filter(
    (p) =>
      p.id !== currentProduct.id &&
      p.category === currentProduct.category
  ).slice(0, 4);

  if (similar.length === 0) return null;

  return (
    <View style={styles.similarSection}>
      <Text style={styles.similarTitle}>🪆 Similar Products</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      >
        {similar.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.similarCard}
            onPress={() =>
              navigation.replace('ProductDetail', {
                productId: product.id,
              })
            }
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: product.image }}
              style={styles.similarImage}
              resizeMode="cover"
            />
            <View style={styles.similarBody}>
              <Text style={styles.similarName} numberOfLines={2}>
                {product.name}
              </Text>
              <Text style={styles.similarPrice}>${product.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default function ProductDetailScreen({ navigation, route }) {
  const { productId } = route.params;
  const product = PRODUCTS.find((p) => p.id === productId);
  const { addToCart, items } = useCart();
  const { isGuest } = useAuth();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Product not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.goBack}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const cartItem = items.find((i) => i.product.id === product.id);
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
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
    addToCart(product);
    navigation.navigate('ConfirmDetails');
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
          />
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>

          {/* Badges */}
          {discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          )}
          {product.isBestSeller && (
            <View style={styles.bestSellerBadge}>
              <Text style={styles.bestSellerText}>🔥 Best Seller</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          {/* Origin & Category */}
          <View style={styles.tagRow}>
            <View style={styles.originTag}>
              <Text style={styles.originTagText}>📍 {product.origin}</Text>
            </View>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>{product.category}</Text>
            </View>
          </View>

          {/* Name */}
          <Text style={styles.productName}>{product.name}</Text>

          {/* Artisan */}
          <Text style={styles.artisan}>
            🧑‍🎨 Handcrafted by {product.artisan}
          </Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <StarRating rating={product.rating} />
            <Text style={styles.ratingText}>{product.rating}</Text>
            <Text style={styles.reviewCount}>
              ({product.reviewCount} reviews)
            </Text>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>
                ${product.originalPrice}
              </Text>
            )}
            {discount && (
              <View style={styles.savingBadge}>
                <Text style={styles.savingText}>Save {discount}%</Text>
              </View>
            )}
          </View>

          {/* Stock */}
          <View style={styles.stockRow}>
            <View
              style={[
                styles.stockDot,
                {
                  backgroundColor: product.inStock
                    ? COLORS.success
                    : COLORS.error,
                },
              ]}
            />
            <Text
              style={[
                styles.stockText,
                {
                  color: product.inStock ? COLORS.success : COLORS.error,
                },
              ]}
            >
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionLabel}>About this piece</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Details */}
          <View style={styles.detailsCard}>
            <Text style={styles.sectionLabel}>Product Details</Text>
            {[
              { label: '🪵 Material', value: product.material },
              { label: '📐 Dimensions', value: product.dimensions },
              { label: '📍 Origin', value: product.origin },
              { label: '🧑‍🎨 Artisan', value: product.artisan },
            ].map(({ label, value }) => (
              <View key={label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{label}</Text>
                <Text style={styles.detailValue}>{value}</Text>
              </View>
            ))}
          </View>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {product.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>

          {/* Quantity Selector */}
          {product.inStock && (
            <View style={styles.quantityRow}>
              <Text style={styles.sectionLabel}>Quantity</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Cart status */}
          {cartItem && (
            <View style={styles.inCartBanner}>
              <Text style={styles.inCartText}>
                ✓ {cartItem.quantity} already in your cart
              </Text>
            </View>
          )}

          {/* Similar Products */}
          <SimilarProducts
            currentProduct={product}
            navigation={navigation}
          />
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      {product.inStock && (
        <View style={styles.cta}>
          <TouchableOpacity
            style={[styles.addToCartBtn, added && styles.addedBtn]}
            onPress={handleAddToCart}
            activeOpacity={0.85}
          >
            <Text style={styles.addToCartBtnText}>
              {added ? '✓ Added!' : '🛒 Add to Cart'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buyNowBtn}
            onPress={handleBuyNow}
            activeOpacity={0.85}
          >
            <Text style={styles.buyNowBtnText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: COLORS.textMedium,
  },
  goBack: {
    color: COLORS.terracotta,
    marginTop: 12,
    fontSize: 15,
  },
  imageContainer: {
    width,
    height: width * 0.9,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: 20,
    width: 40,
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  backBtnText: {
    fontSize: 20,
    color: COLORS.brown,
    fontWeight: '700',
  },
  discountBadge: {
    position: 'absolute',
    top: 52,
    right: 20,
    backgroundColor: COLORS.terracotta,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  discountText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  bestSellerBadge: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    backgroundColor: COLORS.gold,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  bestSellerText: {
    color: COLORS.brown,
    fontSize: 12,
    fontWeight: '700',
  },
  infoContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    padding: 24,
    paddingBottom: 120,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  originTag: {
    backgroundColor: COLORS.goldLight,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  originTagText: {
    fontSize: 12,
    color: COLORS.brown,
    fontWeight: '600',
  },
  categoryTag: {
    backgroundColor: COLORS.beige,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  categoryTagText: {
    fontSize: 12,
    color: COLORS.textMedium,
    fontWeight: '600',
  },
  productName: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.brown,
    lineHeight: 32,
    marginBottom: 6,
  },
  artisan: {
    fontSize: 13,
    color: COLORS.textMedium,
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.brown,
  },
  reviewCount: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.brown,
  },
  originalPrice: {
    fontSize: 16,
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
  },
  savingBadge: {
    backgroundColor: COLORS.greenLight,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  savingText: {
    fontSize: 12,
    color: COLORS.green,
    fontWeight: '700',
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stockText: {
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMedium,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: COLORS.textMedium,
    lineHeight: 24,
    marginBottom: 20,
  },
  detailsCard: {
    backgroundColor: COLORS.beige,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    fontSize: 13,
    color: COLORS.textMedium,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 13,
    color: COLORS.brown,
    fontWeight: '700',
    maxWidth: '55%',
    textAlign: 'right',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: COLORS.beige,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.textMedium,
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: COLORS.beige,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  qtyBtnText: {
    fontSize: 18,
    color: COLORS.brown,
    fontWeight: '700',
    lineHeight: 22,
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.brown,
    minWidth: 24,
    textAlign: 'center',
  },
  inCartBanner: {
    backgroundColor: COLORS.greenLight,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  inCartText: {
    fontSize: 13,
    color: COLORS.green,
    fontWeight: '600',
  },
  similarSection: {
    marginTop: 8,
  },
  similarTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.brown,
    marginBottom: 12,
  },
  similarCard: {
    width: 140,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  similarImage: {
    width: '100%',
    height: 100,
  },
  similarBody: {
    padding: 8,
  },
  similarName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.brown,
    lineHeight: 16,
  },
  similarPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.terracotta,
    marginTop: 4,
  },
  cta: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: COLORS.beige,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.terracotta,
  },
  addedBtn: {
    borderColor: COLORS.green,
    backgroundColor: COLORS.greenLight,
  },
  addToCartBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.brown,
  },
  buyNowBtn: {
    flex: 1,
    backgroundColor: COLORS.terracotta,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buyNowBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
});