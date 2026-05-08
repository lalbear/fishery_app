/**
 * Cascading District → Block → Panchayat picker.
 * Currently supports Bihar (state code 'BR'). Add more states as their data is seeded.
 *
 * Shows nothing if stateCode is not in SUPPORTED_STATES.
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../ThemeContext';
import { locationService } from '../services/apiService';

export interface LocationSelection {
  districtCode: string;
  districtName: string;
  blockCode: string;
  blockName: string;
  panchayatCode: string;
  panchayatName: string;
}

interface Props {
  stateCode: string;
  value: Partial<LocationSelection>;
  onChange: (sel: Partial<LocationSelection>) => void;
}

type LocItem = { code: string; name: string };

const SUPPORTED_STATES = new Set(['BR']);

function PickerModal({
  visible,
  title,
  items,
  loading,
  onSelect,
  onClose,
  theme,
}: {
  visible: boolean;
  title: string;
  items: LocItem[];
  loading: boolean;
  onSelect: (item: LocItem) => void;
  onClose: () => void;
  theme: any;
}) {
  const [search, setSearch] = useState('');
  const filtered = search.trim()
    ? items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
    : items;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={[modalStyles.sheet, { backgroundColor: theme.colors.background }]}>
          <View style={[modalStyles.header, { borderBottomColor: theme.colors.border }]}>
            <Text style={[modalStyles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={[modalStyles.close, { color: theme.colors.primary }]}>Done</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[
              modalStyles.search,
              { color: theme.colors.textPrimary, backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border },
            ]}
            placeholder="Search..."
            placeholderTextColor={theme.colors.textMuted}
            value={search}
            onChangeText={setSearch}
            autoFocus
          />
          {loading ? (
            <ActivityIndicator style={{ marginTop: 24 }} color={theme.colors.primary} />
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[modalStyles.item, { borderBottomColor: theme.colors.border }]}
                  onPress={() => { onSelect(item); setSearch(''); }}
                >
                  <Text style={[modalStyles.itemText, { color: theme.colors.textPrimary }]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              keyboardShouldPersistTaps="handled"
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

export default function LocationCascadePicker({ stateCode, value, onChange }: Props) {
  const { theme } = useTheme();

  const [districts, setDistricts] = useState<LocItem[]>([]);
  const [blocks, setBlocks] = useState<LocItem[]>([]);
  const [panchayats, setPanchayats] = useState<LocItem[]>([]);

  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [loadingPanchayats, setLoadingPanchayats] = useState(false);

  const [openModal, setOpenModal] = useState<'district' | 'block' | 'panchayat' | null>(null);

  const supported = SUPPORTED_STATES.has(stateCode);

  useEffect(() => {
    if (!supported) return;
    setLoadingDistricts(true);
    locationService.getDistricts(stateCode)
      .then((res) => { if (res.success) setDistricts(res.data); })
      .catch(() => {})
      .finally(() => setLoadingDistricts(false));
  }, [stateCode, supported]);

  useEffect(() => {
    if (!value.districtCode) { setBlocks([]); return; }
    setLoadingBlocks(true);
    locationService.getBlocks(value.districtCode)
      .then((res) => { if (res.success) setBlocks(res.data); })
      .catch(() => {})
      .finally(() => setLoadingBlocks(false));
  }, [value.districtCode]);

  useEffect(() => {
    if (!value.blockCode) { setPanchayats([]); return; }
    setLoadingPanchayats(true);
    locationService.getPanchayats(value.blockCode)
      .then((res) => { if (res.success) setPanchayats(res.data); })
      .catch(() => {})
      .finally(() => setLoadingPanchayats(false));
  }, [value.blockCode]);

  const selectDistrict = useCallback((item: LocItem) => {
    onChange({ districtCode: item.code, districtName: item.name, blockCode: '', blockName: '', panchayatCode: '', panchayatName: '' });
    setOpenModal(null);
  }, [onChange]);

  const selectBlock = useCallback((item: LocItem) => {
    onChange({ ...value, blockCode: item.code, blockName: item.name, panchayatCode: '', panchayatName: '' });
    setOpenModal(null);
  }, [onChange, value]);

  const selectPanchayat = useCallback((item: LocItem) => {
    onChange({ ...value, panchayatCode: item.code, panchayatName: item.name });
    setOpenModal(null);
  }, [onChange, value]);

  if (!supported) return null;

  return (
    <View>
      <Row
        label="District"
        selected={value.districtName}
        loading={loadingDistricts}
        onPress={() => setOpenModal('district')}
        theme={theme}
      />
      {value.districtCode ? (
        <Row
          label="Block"
          selected={value.blockName}
          loading={loadingBlocks}
          onPress={() => setOpenModal('block')}
          theme={theme}
        />
      ) : null}
      {value.blockCode ? (
        <Row
          label="Panchayat"
          selected={value.panchayatName}
          loading={loadingPanchayats}
          onPress={() => setOpenModal('panchayat')}
          theme={theme}
        />
      ) : null}

      <PickerModal
        visible={openModal === 'district'}
        title="Select District"
        items={districts}
        loading={loadingDistricts}
        onSelect={selectDistrict}
        onClose={() => setOpenModal(null)}
        theme={theme}
      />
      <PickerModal
        visible={openModal === 'block'}
        title="Select Block"
        items={blocks}
        loading={loadingBlocks}
        onSelect={selectBlock}
        onClose={() => setOpenModal(null)}
        theme={theme}
      />
      <PickerModal
        visible={openModal === 'panchayat'}
        title="Select Panchayat"
        items={panchayats}
        loading={loadingPanchayats}
        onSelect={selectPanchayat}
        onClose={() => setOpenModal(null)}
        theme={theme}
      />
    </View>
  );
}

function Row({
  label,
  selected,
  loading,
  onPress,
  theme,
}: {
  label: string;
  selected?: string;
  loading: boolean;
  onPress: () => void;
  theme: any;
}) {
  return (
    <TouchableOpacity
      style={[rowStyles.row, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      onPress={onPress}
    >
      <View style={{ flex: 1 }}>
        <Text style={[rowStyles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
        <Text style={[rowStyles.value, { color: selected ? theme.colors.textPrimary : theme.colors.textMuted }]}>
          {loading ? 'Loading...' : selected || `Select ${label}`}
        </Text>
      </View>
      <Text style={[rowStyles.chevron, { color: theme.colors.textMuted }]}>›</Text>
    </TouchableOpacity>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  label: { fontSize: 11, fontWeight: '700', marginBottom: 2 },
  value: { fontSize: 15, fontWeight: '600' },
  chevron: { fontSize: 22, marginLeft: 8 },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: { fontSize: 17, fontWeight: '800' },
  close: { fontSize: 15, fontWeight: '700' },
  search: {
    margin: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 15,
  },
  item: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemText: { fontSize: 15 },
});
