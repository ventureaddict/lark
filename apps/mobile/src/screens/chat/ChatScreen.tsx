import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { GiftedChat, IMessage, Send } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuthStore } from '../../store/authStore';
import { chatService, Conversation } from '../../services/chatService';

export const ChatScreen: React.FC = () => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const currentMessageRef = useRef<string>('');

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      const newConversation = await chatService.createConversation();
      setConversation(newConversation);
      
      // Add welcome message
      const welcomeMessage: IMessage = {
        _id: 'welcome',
        text: `Hi ${user?.name}! I'm Lark, your AI date planning concierge. I'm here to help you create the perfect date experience! 🌟\n\nWhat kind of date are you thinking about? I can help with:\n• Romantic dinners\n• Fun activities\n• Cultural experiences\n• Outdoor adventures\n• Special occasions\n\nJust tell me what you have in mind!`,
        createdAt: new Date(),
        user: {
          _id: 'assistant',
          name: 'Lark',
          avatar: '🐦',
        },
      };
      
      setMessages([welcomeMessage]);
    } catch (error) {
      Alert.alert('Error', 'Failed to initialize chat');
    }
  };

  const onSend = async (newMessages: IMessage[] = []) => {
    if (!conversation) return;

    const userMessage = newMessages[0];
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    setIsTyping(true);
    currentMessageRef.current = '';

    try {
      const stream = await chatService.sendMessage(conversation.id, userMessage.text);
      const reader = stream.getReader();
      const decoder = new TextDecoder();

      // Create assistant message
      const assistantMessage: IMessage = {
        _id: Math.random().toString(),
        text: '',
        createdAt: new Date(),
        user: {
          _id: 'assistant',
          name: 'Lark',
          avatar: '🐦',
        },
      };

      setMessages(previousMessages => GiftedChat.append(previousMessages, [assistantMessage]));

      // Stream the response
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        currentMessageRef.current += chunk;

        // Update the last message (assistant response)
        setMessages(previousMessages => {
          const updatedMessages = [...previousMessages];
          if (updatedMessages[0]?.user._id === 'assistant') {
            updatedMessages[0] = {
              ...updatedMessages[0],
              text: currentMessageRef.current,
            };
          }
          return updatedMessages;
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setIsTyping(false);
    }
  };

  const renderSend = (props: any) => (
    <Send {...props}>
      <View style={styles.sendButton}>
        <Icon name="send" size={20} color="#FF6B6B" />
      </View>
    </Send>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🐦 Lark</Text>
        <Text style={styles.headerSubtitle}>Your Date Planning Concierge</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.chatContainer}
      >
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: user?.id || 'user',
            name: user?.name || 'You',
          }}
          renderSend={renderSend}
          isTyping={isTyping}
          placeholder="Ask me to plan your perfect date..."
          alwaysShowSend
          scrollToBottom
          messagesContainerStyle={styles.messagesContainer}
          textInputStyle={styles.textInput}
          renderBubble={(props) => (
            <View
              style={[
                styles.bubble,
                props.currentMessage?.user._id === 'assistant'
                  ? styles.assistantBubble
                  : styles.userBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  props.currentMessage?.user._id === 'assistant'
                    ? styles.assistantText
                    : styles.userText,
                ]}
              >
                {props.currentMessage?.text}
              </Text>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    paddingBottom: 10,
  },
  textInput: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 10,
    marginVertical: 8,
    fontSize: 16,
  },
  sendButton: {
    marginRight: 10,
    marginBottom: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 16,
    maxWidth: '80%',
  },
  assistantBubble: {
    backgroundColor: '#F8F8F8',
    alignSelf: 'flex-start',
  },
  userBubble: {
    backgroundColor: '#FF6B6B',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  assistantText: {
    color: '#333333',
  },
  userText: {
    color: '#FFFFFF',
  },
});