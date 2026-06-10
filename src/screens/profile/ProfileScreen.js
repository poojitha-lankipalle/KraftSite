import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { COLORS } from '../../theme/colors';

function MenuItem({ icon, label, value, onPress, danger }) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
        <Text style={styles.menuIconText}>{icon}</Text>
      </View>
      <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>
        {label}
      </Text>
      {value ? (
        <Text style={styles.menuValue}>{value}</Text>
      ) : (
        <Text style={styles.menuArrow}>›</Text>
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen({ navigation }) {
  const { user, isGuest, logout } = useAuth();
  const { totalItems, totalPrice } = useCart();

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'G';

  const handleLogout = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  // Guest mode view
  if (isGuest) {
    return (
      <View style={styles.guestContainer}>
        <Text style={styles.guestEmoji}>🪆</Text>
        <Text style={styles.guestTitle}>You are browsing as Guest</Text>
        <Text style={styles.guestSubtitle}>
          Create an account to place orders, track shipments and save
          your favorite items
        </Text>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={logout}
          activeOpacity={0.85}
        >
          <Text style={styles.loginBtnText}>Login / Create Account</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <View style={styles.memberBadge}>
          <Text style={styles.memberBadgeText}>🏺 KraftSite Member</Text>
        </View>
      </View>

      {/* Cart Summary */}
      {totalItems > 0 && (
        <View style={styles.cartSummary}>
          <Text style={styles.cartSummaryText}>
            🛒 You have {totalItems} item{totalItems > 1 ? 's' : ''} in
            your cart worth ${totalPrice.toFixed(2)}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('CartTab')}
          >
            <Text style={styles.cartSummaryLink}>View Cart →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Account Section */}
      <Text style={styles.sectionLabel}>Account</Text>
      <View style={styles.menuGroup}>
        <MenuItem
          icon="👤"
          label="Full Name"
          value={user?.name}
        />
        <MenuItem
          icon="📧"
          label="Email"
          value={user?.email}
        />
        <MenuItem
          icon="📱"
          label="Phone"
          value="Not set"
        />
      </View>

      {/* Orders Section */}
      <Text style={styles.sectionLabel}>My Orders</Text>
      <View style={styles.menuGroup}>
        <MenuItem
          icon="📦"
          label="Active Orders"
          value="0"
        />
        <MenuItem
          icon="✅"
          label="Delivered Orders"
          value="0"
        />
        <MenuItem
          icon="❤️"
          label="Wishlist"
          value="0"
        />
      </View>

      {/* Support Section */}
      <Text style={styles.sectionLabel}>Support</Text>
      <View style={styles.menuGroup}>
        <MenuItem
          icon="🚚"
          label="Shipping Policy"
          onPress={() => Alert.alert(
            'Shipping Policy',
            'Free shipping on orders above $75. Standard delivery in 5-7 business days.'
          )}
        />
        <MenuItem
          icon="↩️"
          label="Returns & Refunds"
          onPress={() => Alert.alert(
            'Returns',
            'Easy 30-day returns. Contact us at support@kraftsite.com'
          )}
        />
        <MenuItem
          icon="💬"
          label="Contact Us"
          onPress={() => Alert.alert(
            'Contact',
            'Email: support@kraftsite.com\nPhone: +1 (555) 123-4567'
          )}
        />
      </View>

      {/* About Section */}
      <Text style={styles.sectionLabel}>About</Text>
      <View style={styles.menuGroup}>
        <MenuItem
          icon="🪆"
          label="About KraftSite"
          onPress={() => Alert.alert(
            'About KraftSite',
            'KraftSite connects you with authentic Indian handcrafted dolls and supports artisan communities across India.'
          )}
        />
        <MenuItem
          icon="⭐"
          label="Rate the App"
        />
        <MenuItem
          icon="📋"
          label="App Version"
          value="1.0.0"
        />
      </View>

      {/* Artisan Note */}
      <View style={styles.artisanNote}>
        <Text style={styles.artisanNoteText}>
          🧑‍🎨 KraftSite supports over 50 artisan families across 8
          states in India. Every purchase makes a difference!
        </Text>
      </View>

      {/* Sign Out */}
      <View style={[styles.menuGroup, { marginBottom: 40 }]}>
        <MenuItem
          icon="🚪"
          label="Sign Out"
          onPress={handleLogout}
          danger
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  guestContainer: {
    flex: 1,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  guestEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  guestTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.brown,
    textAlign: 'center',
    marginBottom: 8,
  },
  guestSubtitle: {
    fontSize: 15,
    color: COLORS.textMedium,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  loginBtn: {
    backgroundColor: COLORS.terracotta,
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  loginBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  header: {
    backgroundColor: COLORS.brown,
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: COLORS.gold,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.white,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.cream,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.beige,
    marginTop: 4,
  },
  memberBadge: {
    backgroundColor: COLORS.gold,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginTop: 10,
  },
  memberBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brown,
  },
  cartSummary: {
    backgroundColor: COLORS.goldLight,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  cartSummaryText: {
    fontSize: 13,
    color: COLORS.brown,
    fontWeight: '500',
    flex: 1,
  },
  cartSummaryLink: {
    fontSize: 13,
    color: COLORS.terracotta,
    fontWeight: '700',
    marginLeft: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 6,
  },
  menuGroup: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconDanger: {
    backgroundColor: '#FDEDED',
  },
  menuIconText: {
    fontSize: 16,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: COLORS.brown,
    fontWeight: '500',
  },
  menuLabelDanger: {
    color: COLORS.error,
  },
  menuValue: {
    fontSize: 13,
    color: COLORS.textLight,
    maxWidth: '40%',
    textAlign: 'right',
  },
  menuArrow: {
    fontSize: 20,
    color: COLORS.textLight,
  },
  artisanNote: {
    backgroundColor: COLORS.beige,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  artisanNoteText: {
    fontSize: 13,
    color: COLORS.textMedium,
    lineHeight: 20,
    textAlign: 'center',
  },
});