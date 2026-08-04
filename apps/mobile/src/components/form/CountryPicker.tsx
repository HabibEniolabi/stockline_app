import { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppIcon } from '../icons/AppIcon';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import {
  countries,
  type Country,
} from '../../components/types/countries';

type CountryPickerProps = {
  selectedCountry: Country;
  onSelectCountry: (country: Country) => void;
};

export function CountryPicker({
  selectedCountry,
  onSelectCountry,
}: CountryPickerProps) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');

  const filteredCountries = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return countries;
    }

    return countries.filter((country) => {
      return (
        country.name.toLowerCase().includes(query) ||
        country.dialCode.includes(query) ||
        country.iso2.toLowerCase().includes(query)
      );
    });
  }, [search]);

  const handleSelectCountry = (country: Country) => {
    onSelectCountry(country);
    setSearch('');
    setVisible(false);
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Select country. Current country is ${selectedCountry.name}`}
        hitSlop={8}
        style={({ pressed }) => [
          styles.trigger,
          pressed && styles.triggerPressed,
        ]}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.flag}>
          {selectedCountry.flag}
        </Text>

        <AppIcon
          name="chevronDown"
          size={16}
          color={colors.neutral[700]}
        />
      </Pressable>

      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Select country
            </Text>

            <Pressable
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => {
                setSearch('');
                setVisible(false);
              }}
            >
              <Text style={styles.closeText}>
                Close
              </Text>
            </Pressable>
          </View>

          <TextInput
            value={search}
            placeholder="Search country or code"
            placeholderTextColor={colors.neutral[300]}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.searchInput}
            onChangeText={setSearch}
          />

          <FlatList
            data={filteredCountries}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item) => item.iso2}
            contentContainerStyle={styles.countryList}
            renderItem={({ item }) => {
              const isSelected =
                item.iso2 === selectedCountry.iso2;

              return (
                <Pressable
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.countryItem,
                    isSelected &&
                      styles.countryItemSelected,
                    pressed &&
                      styles.countryItemPressed,
                  ]}
                  onPress={() => {
                    handleSelectCountry(item);
                  }}
                >
                  <Text style={styles.countryFlag}>
                    {item.flag}
                  </Text>

                  <View style={styles.countryDetails}>
                    <Text style={styles.countryName}>
                      {item.name}
                    </Text>

                    <Text style={styles.countryIso}>
                      {item.iso2}
                    </Text>
                  </View>

                  <Text style={styles.countryCode}>
                    {item.dialCode}
                  </Text>
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No country found.
              </Text>
            }
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  triggerPressed: {
    opacity: 0.6,
  },

  flag: {
    fontSize: 20,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: colors.other.white,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[50],
  },

  modalTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    lineHeight: 28,
    color: colors.neutral[900],
  },

  closeText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    color: colors.primary[100],
  },

  searchInput: {
    height: 48,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.neutral[100],
    borderRadius: 12,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.neutral[900],
  },

  countryList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  countryItem: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
  },

  countryItemSelected: {
    backgroundColor: colors.primary[0],
  },

  countryItemPressed: {
    opacity: 0.7,
  },

  countryFlag: {
    marginRight: 12,
    fontSize: 24,
  },

  countryDetails: {
    flex: 1,
  },

  countryName: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.neutral[900],
  },

  countryIso: {
    marginTop: 2,
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.neutral[400],
  },

  countryCode: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.neutral[600],
  },

  emptyText: {
    paddingTop: 40,
    textAlign: 'center',
    fontFamily: fontFamily.regular,
    color: colors.neutral[400],
  },
});