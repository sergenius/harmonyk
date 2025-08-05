import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { Globe, Check, X } from 'lucide-react-native';
import { t, changeLanguage, getCurrentLanguage } from '@/lib/i18n';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
  },
];

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
  onLanguageChange?: (language: string) => void;
  showTrigger?: boolean;
}

export default function LanguageSelector({ 
  visible, 
  onClose, 
  onLanguageChange,
  showTrigger = false 
}: LanguageSelectorProps) {
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());
  const [tempLanguage, setTempLanguage] = useState(currentLanguage);

  const handleLanguageSelect = (languageCode: string) => {
    setTempLanguage(languageCode);
  };

  const handleApply = async () => {
    if (tempLanguage !== currentLanguage) {
      await changeLanguage(tempLanguage);
      setCurrentLanguage(tempLanguage);
      onLanguageChange?.(tempLanguage);
      
      // Show success message
      setTimeout(() => {
        alert('Language updated successfully! The app interface will now display in your selected language.');
      }, 500);
    }
    onClose();
  };

  const handleCancel = () => {
    setTempLanguage(currentLanguage);
    onClose();
  };

  const getCurrentLanguageData = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  return (
    <>
      {showTrigger && (
        <TouchableOpacity style={styles.trigger} onPress={() => {}}>
          <Globe size={20} color="#3B82F6" />
          <Text style={styles.triggerText}>
            {getCurrentLanguageData().nativeName}
          </Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
            <Text style={styles.title}>{t('language.selectLanguage')}</Text>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>{t('language.apply')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.subtitle}>{t('language.choosePreferred')}</Text>

            <ScrollView style={styles.languageList} showsVerticalScrollIndicator={false}>
              {languages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageItem,
                    tempLanguage === language.code && styles.selectedLanguageItem,
                  ]}
                  onPress={() => handleLanguageSelect(language.code)}
                >
                  <View style={styles.languageInfo}>
                    <Text style={styles.flag}>{language.flag}</Text>
                    <View style={styles.languageTexts}>
                      <Text style={[
                        styles.languageName,
                        tempLanguage === language.code && styles.selectedLanguageName,
                      ]}>
                        {language.nativeName}
                      </Text>
                      <Text style={styles.languageNameEn}>{language.name}</Text>
                    </View>
                  </View>
                  {tempLanguage === language.code && (
                    <Check size={20} color="#3B82F6" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.info}>
              <Text style={styles.infoText}>
                {getCurrentLanguage() === 'en' && 'App will restart to apply language changes'}
                {getCurrentLanguage() === 'es' && 'La aplicación se reiniciará para aplicar los cambios de idioma'}
                {getCurrentLanguage() === 'pt' && 'O aplicativo será reiniciado para aplicar as mudanças de idioma'}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  triggerText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(248, 250, 252, 0.95)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  applyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#3B82F6',
    borderRadius: 20,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 24,
    textAlign: 'center',
  },
  languageList: {
    flex: 1,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
    backgroundColor: 'rgba(248, 250, 252, 0.7)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  selectedLanguageItem: {
    backgroundColor: 'rgba(235, 244, 255, 0.8)',
    borderColor: 'rgba(59, 130, 246, 0.7)',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 24,
    marginRight: 16,
  },
  languageTexts: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  selectedLanguageName: {
    color: '#3B82F6',
  },
  languageNameEn: {
    fontSize: 14,
    color: '#64748B',
  },
  info: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  infoText: {
    fontSize: 14,
    color: '#0369A1',
    textAlign: 'center',
    lineHeight: 20,
  },
});