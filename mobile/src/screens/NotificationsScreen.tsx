import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import {
  FarmNotification,
  getNotificationFeed,
  markAllNotificationsRead,
  markNotificationRead,
} from '../utils/notificationCenter';

export default function NotificationsScreen() {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [notifications, setNotifications] = useState<FarmNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const feed = await getNotificationFeed();
      setNotifications(feed);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications])
  );

  const handleOpenNotification = async (item: FarmNotification) => {
    await markNotificationRead(item.id);
    await loadNotifications();

    if (item.type === 'water_quality') {
      navigation.navigate('WaterQuality', { pondId: item.pondId, initialTab: 'history' });
      return;
    }

    if (item.pondId) {
      navigation.navigate('AddEditPond', { pondId: item.pondId });
      return;
    }

    navigation.navigate('PondsList');
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead(notifications.map((item) => item.id));
    await loadNotifications();
  };

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={handleMarkAllRead} disabled={notifications.length === 0}>
          <Text style={[styles.markAllText, notifications.length === 0 && styles.markAllTextDisabled]}>
            Mark all
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryTitle}>Farm alerts and reminders</Text>
          <Text style={styles.summaryText}>
            {unreadCount > 0
              ? `${unreadCount} unread update${unreadCount === 1 ? '' : 's'} based on your ponds and recent readings`
              : 'You are caught up. New harvest and water-quality alerts will show here.'}
          </Text>
        </View>
        <View style={styles.summaryBadge}>
          <Ionicons name="notifications" size={18} color={theme.colors.primary} />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="notifications-off-outline" size={44} color={theme.colors.textMuted} />
          <Text style={styles.emptyTitle}>No notifications yet</Text>
          <Text style={styles.emptyText}>
            Add ponds, log water quality, and keep active crops updated to start receiving useful alerts.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const accentColor = item.severity === 'critical'
              ? theme.colors.error
              : item.severity === 'warning'
                ? theme.colors.accent
                : theme.colors.primary;

            return (
              <TouchableOpacity
                style={[styles.card, !item.isRead && styles.cardUnread]}
                onPress={() => handleOpenNotification(item)}
                activeOpacity={0.88}
              >
                <View style={[styles.iconWrap, { backgroundColor: `${accentColor}22` }]}>
                  <Ionicons
                    name={item.type === 'water_quality' ? 'water-outline' : item.type === 'harvest' ? 'timer-outline' : 'construct-outline'}
                    size={18}
                    color={accentColor}
                  />
                </View>
                <View style={styles.cardCopy}>
                  <View style={styles.cardTopRow}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    {!item.isRead ? <View style={[styles.unreadDot, { backgroundColor: accentColor }]} /> : null}
                  </View>
                  <Text style={styles.cardMessage}>{item.message}</Text>
                  <Text style={styles.cardTime}>
                    {new Date(item.timestamp).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  markAllText: {
    color: theme.colors.primary,
    fontWeight: '800',
  },
  markAllTextDisabled: {
    color: theme.colors.textMuted,
  },
  summaryCard: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  summaryTitle: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  summaryText: {
    color: theme.colors.textSecondary,
    lineHeight: 19,
    marginTop: 4,
    maxWidth: '92%',
  },
  summaryBadge: {
    marginLeft: 'auto',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  cardUnread: {
    borderColor: theme.colors.primary,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCopy: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  cardMessage: {
    color: theme.colors.textSecondary,
    lineHeight: 19,
    marginTop: 6,
  },
  cardTime: {
    color: theme.colors.textMuted,
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  emptyTitle: {
    color: theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 12,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
  },
});
