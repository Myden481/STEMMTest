/**
 * chat.tsx
 * STEMM App – Text Filter Prototype: Mock Chat Interface
 *
 * Demonstrates real-time profanity filtering using @2toad/profanity.
 * Base project starter: Expo Router default template (acknowledged).
 */

import React, { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { filterText } from '@/utils/textFilter';
import { useColorScheme } from '@/hooks/use-color-scheme';

const THEME = {
  light: {
    bg: '#F2F5F8',
    header: '#0a7ea4',
    headerText: '#fff',
    headerSubtext: 'rgba(255,255,255,0.75)',
    bubbleUser: '#0a7ea4',
    bubbleUserText: '#fff',
    bubbleBot: '#fff',
    bubbleBotText: '#11181C',
    bubbleBotShadow: '#000',
    inputBg: '#fff',
    inputBorder: '#DDE0E3',
    inputFieldBg: '#F2F5F8',
    inputFieldBorder: '#DDE0E3',
    inputText: '#11181C',
    placeholder: '#9BA1A6',
    sendBtn: '#0a7ea4',
    sendBtnDisabled: '#B0BEC5',
    avatar: '#e0e0e0',
    warningBg: '#FFF3CD',
    warningBorder: '#FFCA28',
    warningText: '#856404',
    flagged: '#FF9500',
  },
  dark: {
    bg: '#0D1117',
    header: '#0a4f6e',
    headerText: '#fff',
    headerSubtext: 'rgba(255,255,255,0.6)',
    bubbleUser: '#0a7ea4',
    bubbleUserText: '#fff',
    bubbleBot: '#1E2530',
    bubbleBotText: '#ECEDEE',
    bubbleBotShadow: 'transparent',
    inputBg: '#161B22',
    inputBorder: '#30363D',
    inputFieldBg: '#0D1117',
    inputFieldBorder: '#30363D',
    inputText: '#ECEDEE',
    placeholder: '#6E7681',
    sendBtn: '#0a7ea4',
    sendBtnDisabled: '#3D4450',
    avatar: '#21262D',
    warningBg: '#2D2000',
    warningBorder: '#9E6A03',
    warningText: '#E3B341',
    flagged: '#FF9500',
  },
} as const;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  flagged: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '0',
    text: 'Welcome to STEMM Chat! This demo filters bad words before messages are sent.',
    sender: 'bot',
    flagged: false,
  },
  {
    id: '1',
    text: 'Try typing a message with a bad word to see the filter in action!',
    sender: 'bot',
    flagged: false,
  },
];

const BOT_REPLIES = [
  'Very good!',
  'Indeed!',
  'I love ice cream too!',
  'Let us end this chat right here, you are being rude!',
];

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const systemScheme = useColorScheme() ?? 'light';
  const [scheme, setScheme] = useState<'light' | 'dark'>(systemScheme);
  const t = THEME[scheme];

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [warning, setWarning] = useState('');
  const [blocked, setBlocked] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const listRef = useRef<FlatList<Message>>(null);

  function toggleScheme() {
    setScheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }

  function resetChat() {
    setMessages(INITIAL_MESSAGES);
    setInputText('');
    setWarning('');
    setBlocked(false);
    setUserMessageCount(0);
  }

  function handleSend() {
    const raw = inputText.trim();
    if (!raw || blocked) return;

    const { clean, hasProfanity } = filterText(raw);

    const userMsg: Message = {
      id: Date.now().toString(),
      text: clean,
      sender: 'user',
      flagged: hasProfanity,
    };

    const newCount = userMessageCount + 1;
    const willBlock = newCount >= 10;
    const replyIndex = willBlock
      ? BOT_REPLIES.length - 1
      : Math.floor(Math.random() * (BOT_REPLIES.length - 1));

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: BOT_REPLIES[replyIndex],
      sender: 'bot',
      flagged: false,
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
    setUserMessageCount(newCount);
    setInputText('');
    if (willBlock) {
      setBlocked(true);
      setWarning('You have been blocked.');
    } else {
      setWarning(hasProfanity ? '⚠️ Remember to behave nicely to others.' : '');
    }
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }

  function renderMessage({ item }: { item: Message }) {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageRow, isUser ? styles.rowRight : styles.rowLeft]}>
        {!isUser && (
          <View style={[styles.avatar, { backgroundColor: t.avatar }]}>
            <Text style={styles.avatarText}>🤖</Text>
          </View>
        )}
        <View
          style={[
            styles.bubble,
            isUser
              ? { backgroundColor: t.bubbleUser }
              : { backgroundColor: t.bubbleBot, shadowColor: t.bubbleBotShadow },
            item.flagged && styles.bubbleFlagged,
          ]}>
          <Text style={[styles.bubbleText, { color: isUser ? t.bubbleUserText : t.bubbleBotText }]}>
            {item.text}
          </Text>
          {item.flagged && <Text style={[styles.flaggedLabel, { color: t.flagged }]}>Filtered</Text>}
        </View>
        {isUser && (
          <View style={[styles.avatar, { backgroundColor: t.avatar }]}>
            <Text style={styles.avatarText}>🧑‍🔬</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: t.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: t.header }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.headerTitle, { color: t.headerText }]}>Team 2</Text>
            <Text style={[styles.headerSubtitle, { color: t.headerSubtext }]}>Text Filter Prototype</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={resetChat} style={styles.resetButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.resetButtonText}>↺ Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleScheme} style={styles.themeToggle} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.themeToggleIcon}>{scheme === 'light' ? '🌙' : '☀️'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
      />

      {warning ? (
        <View style={[styles.warningBanner, { backgroundColor: t.warningBg, borderTopColor: t.warningBorder }]}>
          <Text style={[styles.warningText, { color: t.warningText }]}>{warning}</Text>
        </View>
      ) : null}

      <View style={[styles.inputRow, { paddingBottom: insets.bottom + 8, backgroundColor: t.inputBg, borderTopColor: t.inputBorder }]}>
        <TextInput
          style={[styles.textInput, { backgroundColor: t.inputFieldBg, borderColor: t.inputFieldBorder, color: t.inputText }]}
          value={inputText}
          onChangeText={text => {
            setInputText(text);
            if (warning && !blocked) setWarning('');
          }}
          placeholder={blocked ? 'You have been blocked.' : 'Type a message…'}
          placeholderTextColor={t.placeholder}
          editable={!blocked}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          blurOnSubmit
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: (!inputText.trim() || blocked) ? t.sendBtnDisabled : t.sendBtn }]}
          onPress={handleSend}
          disabled={!inputText.trim() || blocked}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resetButton: {
    height: 30,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  themeToggle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeToggleIcon: {
    fontSize: 20,
  },
  messageList: {
    padding: 12,
    gap: 10,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginVertical: 4,
  },
  rowLeft: {
    justifyContent: 'flex-start',
  },
  rowRight: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
  },
  bubble: {
    maxWidth: '72%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleUser: {
    borderBottomRightRadius: 4,
  },
  bubbleBot: {
    borderBottomLeftRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  bubbleFlagged: {
    borderWidth: 1.5,
    borderColor: '#FF9500',
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 21,
  },
  flaggedLabel: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
  },
  warningBanner: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  warningText: {
    fontSize: 13,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
  },
  sendButton: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
