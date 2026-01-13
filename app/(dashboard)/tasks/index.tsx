import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  getAllTasks,
  toggleTaskComplete,
  deleteTask,
} from '@/services/taskService';

type Task = {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
};

export default function TasksScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Reload tasks every time screen is focused
  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const loadTasks = async () => {
    setLoading(true);
    const data = await getAllTasks();
    setTasks(data);
    setLoading(false);
  };

  const handleToggle = async (task: Task) => {
    // Optimistic update: Update UI immediately for better feel
    const newTasks = tasks.map((t) =>
      t.id === task.id ? { ...t, isComplete: !t.isComplete } : t
    );
    setTasks(newTasks);

    // Update database in background
    await toggleTaskComplete(task.id, task.isComplete);
  };

  const handleDelete = (taskId: string) => {
    Alert.alert('Delete Task', 'Are you sure you want to remove this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteTask(taskId);
          loadTasks(); // Refresh list
        },
      },
    ]);
  };

  const handleEdit = (id: string) => {
    // Navigate to form with the ID to enable "Edit Mode"
    router.push({ pathname: '/tasks/form', params: { id } });
  };

  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.taskCard}>
      {/* Checkbox Button */}
      <Pressable
        onPress={() => handleToggle(item)}
        style={styles.checkContainer}
      >
        <Ionicons
          name={item.isComplete ? 'checkmark-circle' : 'ellipse-outline'}
          size={26}
          color={item.isComplete ? PRIMARY : '#ccc'}
        />
      </Pressable>

      {/* Task Content (Click to Edit) */}
      <Pressable style={styles.taskContent} onPress={() => handleEdit(item.id)}>
        <Text
          style={[styles.taskTitle, item.isComplete && styles.completedText]}
        >
          {item.title}
        </Text>
        {item.description ? (
          <Text style={styles.taskDesc} numberOfLines={1}>
            {item.description}
          </Text>
        ) : null}
      </Pressable>

      {/* Delete Button */}
      <Pressable onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={22} color="#E53935" />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Tasks</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={PRIMARY}
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No tasks yet. Add one below!</Text>
          }
        />
      )}

      {/* Static FAB (No Animation) */}
      <Pressable style={styles.fab} onPress={() => router.push('/tasks/form')}>
        <Ionicons name="add" size={32} color="#fff" />
      </Pressable>
    </View>
  );
}

const PRIMARY = '#4A90E2';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 50, // Added padding for top status bar area
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#333',
    marginBottom: 20,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  checkContainer: {
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  taskDesc: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  deleteBtn: {
    padding: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: PRIMARY,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Android Shadow
    shadowColor: '#000', // iOS Shadow
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
  },
});
