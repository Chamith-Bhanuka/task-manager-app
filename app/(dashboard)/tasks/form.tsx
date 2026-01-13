import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { addTask, getTaskById, updateTask } from '@/services/taskService';

// 1. Define the shape of the data we expect
interface TaskData {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
}

export default function TaskForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditing = !!id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadTaskData();
    }
  }, [id]);

  const loadTaskData = async () => {
    setFetching(true);
    try {
      // 2. Cast the result to 'TaskData' so TS knows title/description exist
      const task = (await getTaskById(id as string)) as TaskData;

      if (task) {
        setTitle(task.title);
        setDescription(task.description);
      } else {
        Alert.alert('Error', 'Task not found');
        router.back();
      }
    } catch (e: any) {
      Alert.alert('Error', 'Failed to load task details');
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Task title is required');
      return;
    }

    try {
      setSaving(true);

      if (isEditing) {
        await updateTask(id as string, title, description);
      } else {
        await addTask(title, description);
      }

      router.back();
    } catch (e: any) {
      Alert.alert('Failed', e.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={PRIMARY} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>
          {isEditing ? 'Edit Task' : 'Create Task'}
        </Text>
        <Text style={styles.subtitle}>
          {isEditing
            ? 'Update your task details'
            : 'Add a new task to your list'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Task title"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description (optional)"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Pressable
          style={[styles.button, saving && styles.disabledBtn]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isEditing ? 'Update Task' : 'Save Task'}
            </Text>
          )}
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const PRIMARY = '#4A90E2';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: PRIMARY,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: PRIMARY,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    height: 55,
    justifyContent: 'center',
  },
  disabledBtn: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    marginTop: 16,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PRIMARY,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: PRIMARY,
    fontWeight: '600',
    fontSize: 16,
  },
});
