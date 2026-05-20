import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../ThemeContext';

const HELPLINE_NUMBER = '1962';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function dialHelpline(t: (k: string, opts?: any) => string) {
  const phoneUrl = Platform.OS === 'ios'
    ? `telprompt:${HELPLINE_NUMBER}`
    : `tel:${HELPLINE_NUMBER}`;

  Linking.canOpenURL(phoneUrl)
    .then((supported) => {
      if (supported) {
        Linking.openURL(phoneUrl);
      } else {
        Alert.alert(
          t('helpline.title'),
          t('helpline.simulatorBody', { number: HELPLINE_NUMBER })
        );
      }
    })
    .catch(() => {
      Alert.alert(
        t('helpline.title'),
        t('helpline.errorBody', { number: HELPLINE_NUMBER })
      );
    });
}

/**
 * A small pill button that sits in the header area.
 * Tapping it opens a full-screen modal with the helpline image + call button.
 */
export default function HelplineCard() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = getStyles(theme);
  const [visible, setVisible] = useState(false);

  return (
    <>
      {/* Trigger button — small green pill */}
      <TouchableOpacity
        style={styles.triggerButton}
        activeOpacity={0.85}
        onPress={() => setVisible(true)}
        accessibilityRole="button"
        accessibilityLabel={t('helpline.title')}
      >
        <Ionicons name="call" size={14} color="#fff" />
        <Text style={styles.triggerText}>1962</Text>
      </TouchableOpacity>

      {/* Full-screen modal */}
      <Modal
        visible={visible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setVisible(false)}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>

          {/* Image — fills the screen */}
          <Image
            source={require('../../assets/images/helpline.png')}
            style={styles.fullImage}
            resizeMode="contain"
          />

          {/* Floating call button at bottom */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.callButton}
              activeOpacity={0.85}
              onPress={() => dialHelpline(t)}
              accessibilityRole="button"
              accessibilityLabel={t('helpline.callButton', { number: HELPLINE_NUMBER })}
            >
              <Ionicons name="call" size={20} color="#fff" />
              <Text style={styles.callButtonText}>{t('helpline.callButton', { number: HELPLINE_NUMBER })}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const getStyles = (theme: any) => {
  const c = theme.colors;
  return StyleSheet.create({
    // Trigger pill in the header
    triggerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: '#22c55e',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 999,
      shadowColor: '#22c55e',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    triggerText: {
      color: '#fff',
      fontSize: 13,
      fontWeight: '800',
    },

    // Modal
    modalContainer: {
      flex: 1,
      backgroundColor: c.background,
    },
    closeButton: {
      position: 'absolute',
      top: 56,
      right: 20,
      zIndex: 10,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.isDark ? c.surfaceAlt : c.surface,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
      borderWidth: 1,
      borderColor: c.border,
    },
    fullImage: {
      flex: 1,
      width: SCREEN_WIDTH,
      marginTop: 50,
    },

    // Bottom floating bar
    bottomBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 20,
      paddingBottom: 40,
      paddingTop: 16,
      backgroundColor: 'transparent',
    },
    callButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      backgroundColor: '#22c55e',
      paddingVertical: 16,
      paddingHorizontal: 28,
      borderRadius: 999,
      shadowColor: '#22c55e',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 6,
    },
    callButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '800',
      letterSpacing: 0.3,
    },
  });
};
