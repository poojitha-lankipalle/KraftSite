import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { PRODUCTS, BEST_SELLERS, NEW_ARRIVALS, CATEGORIES } from '../../data/products';
import { COLORS } from '../../theme/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

// ─── Product Card Component ───
function ProductCard({ product, onPress }) {
  const { addToCart } = useCart();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: product.image }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        {discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        )}
        {product.isBestSeller && (
          <View style={styles.bestSellerBadge}>
            <Text style={styles.bestSellerText}>🔥 Top</Text>
          </View>
        )}
        {!product.inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Out of stock</Text>
          </View>
        )}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardOrigin}>{product.origin}</Text>
        <Text style={styles.cardName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.cardArtisan}>by {product.artisan}</Text>
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.cardPrice}>${product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.cardOriginalPrice}>
                ${product.originalPrice}
              </Text>
            )}
          </View>
          {product.inStock && (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.addBtnText}>+</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Horizontal Product Card ───
function HorizontalCard({ product, onPress }) {
  const { addToCart } = useCart();

  return (
    <TouchableOpacity style={styles.hCard} onPress={onPress} activeOpacity={0.9}>
      <Image
        source={{ uri: product.image }}
        style={styles.hCardImage}
        resizeMode="cover"
      />
      <View style={styles.hCardBody}>
        <Text style={styles.cardOrigin}>{product.origin}</Text>
        <Text style={styles.hCardName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.cardArtisan}>by {product.artisan}</Text>
        <View style={styles.hCardFooter}>
          <Text style={styles.cardPrice}>${product.price}</Text>
          {product.inStock && (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.addBtnText}>+</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Section Header ───
function SectionHeader({ title, emoji, onSeeAll }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>
        {emoji} {title}
      </Text>
      <TouchableOpacity onPress={onSeeAll}>
        <Text style={styles.seeAll}>See all</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main Home Screen ───
export default function HomeScreen({ navigation }) {
  const { user, isGuest } = useAuth();
  const { totalItems } = useCart();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchCategory =
      selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch =
      !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.origin.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const greeting = user ? `Hello, ${user.name} 🙏` : 'Hello, Guest 🙏';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>🪆 KraftSite</Text>
          <Text style={styles.greeting}>{greeting}</Text>
        </View>
        <TouchableOpacity
          style={styles.cartIconWrap}
          onPress={() => navigation.navigate('CartTab')}
        >
          <Text style={styles.cartIcon}>🛒</Text>
          {totalItems > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search dolls, origin, artisan..."
            placeholderTextColor={COLORS.textLight}
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat && styles.categoryChipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Show search results if searching */}
        {search.trim() || selectedCategory !== 'All' ? (
          <View style={styles.section}>
            <Text style={styles.resultsText}>
              {filteredProducts.length} results found
            </Text>
            <View style={styles.grid}>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={() =>
                    navigation.navigate('ProductDetail', {
                      productId: product.id,
                    })
                  }
                />
              ))}
            </View>
          </View>
        ) : (
          <>
            {/* Banner */}
            <View style={styles.banner}>
              <Text style={styles.bannerTitle}>
                Authentic Indian{'\n'}Handcrafted Dolls
              </Text>
              <Text style={styles.bannerSubtitle}>
                Supporting artisans across India
              </Text>
              <View style={styles.bannerBadge}>
                <Text style={styles.bannerBadgeText}>
                  🏺 100% Handmade
                </Text>
              </View>
            </View>

            {/* Best Sellers */}
            <View style={styles.section}>
              <SectionHeader
                title="Best Sellers"
                emoji="🔥"
                onSeeAll={() => setSelectedCategory('All')}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingRight: 24 }}
              >
                {BEST_SELLERS.map((product) => (
                  <HorizontalCard
                    key={product.id}
                    product={product}
                    onPress={() =>
                      navigation.navigate('ProductDetail', {
                        productId: product.id,
                      })
                    }
                  />
                ))}
              </ScrollView>
            </View>

            {/* New Arrivals */}
            <View style={styles.section}>
              <SectionHeader
                title="New Arrivals"
                emoji="✨"
                onSeeAll={() => setSelectedCategory('All')}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingRight: 24 }}
              >
                {NEW_ARRIVALS.map((product) => (
                  <HorizontalCard
                    key={product.id}
                    product={product}
                    onPress={() =>
                      navigation.navigate('ProductDetail', {
                        productId: product.id,
                      })
                    }
                  />
                ))}
              </ScrollView>
            </View>

            {/* All Products */}
            <View style={styles.section}>
              <SectionHeader
                title="All Products"
                emoji="🪆"
                onSeeAll={() => {}}
              />
              <View style={styles.grid}>
                {PRODUCTS.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onPress={() =>
                      navigation.navigate('ProductDetail', {
                        productId: product.id,
                      })
                    }
                  />
                ))}
              </View>
            </View>
          </>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
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
    paddingBottom: 12,
    backgroundColor: COLORS.brown,
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.cream,
    letterSpacing: 1,
  },
  greeting: {
    fontSize: 12,
    color: COLORS.beige,
    marginTop: 2,
  },
  cartIconWrap: {
    position: 'relative',
    padding: 4,
  },
  cartIcon: {
    fontSize: 26,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.terracotta,
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 24,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
  },
  clearSearch: {
    fontSize: 14,
    color: COLORS.textLight,
    padding: 4,
  },
  categoriesScroll: {
    marginTop: 12,
  },
  categoriesContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  categoryChipActive: {
    backgroundColor: COLORS.terracotta,
    borderColor: COLORS.terracotta,
  },
  categoryChipText: {
    fontSize: 13,
    color: COLORS.textMedium,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  banner: {
    backgroundColor: COLORS.brownLight,
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.cream,
    lineHeight: 30,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: COLORS.beige,
    marginTop: 6,
  },
  bannerBadge: {
    backgroundColor: COLORS.gold,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 12,
  },
  bannerBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brown,
  },
  section: {
    marginTop: 24,
    paddingLeft: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.brown,
  },
  seeAll: {
    fontSize: 13,
    color: COLORS.terracotta,
    fontWeight: '600',
  },
  resultsText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 12,
    paddingRight: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingRight: 24,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: COLORS.brown,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageWrap: {
    width: '100%',
    height: CARD_WIDTH,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.terracotta,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  bestSellerBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.gold,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  bestSellerText: {
    color: COLORS.brown,
    fontSize: 10,
    fontWeight: '700',
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMedium,
  },
  cardBody: {
    padding: 10,
  },
  cardOrigin: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.terracotta,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cardName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.brown,
    marginTop: 2,
    lineHeight: 18,
  },
  cardArtisan: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
    marginBottom: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.brown,
  },
  cardOriginalPrice: {
    fontSize: 11,
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
  },
  addBtn: {
    width: 28,
    height: 28,
    backgroundColor: COLORS.terracotta,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
  },
  hCard: {
    width: 180,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: COLORS.brown,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  hCardImage: {
    width: '100%',
    height: 120,
  },
  hCardBody: {
    padding: 10,
  },
  hCardName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.brown,
    marginTop: 2,
    lineHeight: 18,
  },
  hCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
});