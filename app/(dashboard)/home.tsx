import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { PieChart } from 'react-native-chart-kit';
import { getAllTasks } from '@/services/taskService';

// Get screen width to make the chart responsive
const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });

  // Reload data every time the screen is focused (e.g., coming back from Tasks tab)
  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  const fetchStats = async () => {
    setLoading(true);
    try {
      const tasks = await getAllTasks();
      const total = tasks.length;
      const completed = tasks.filter((t) => t.isComplete).length;
      const pending = total - completed;

      setStats({ total, completed, pending });
    } catch (error) {
      console.error('Failed to load stats', error);
    } finally {
      setLoading(false);
    }
  };

  // Configuration for the Pie Chart data
  const chartData = [
    {
      name: 'Completed',
      population: stats.completed,
      color: '#4CAF50', // Green
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'Pending',
      population: stats.pending,
      color: '#FF9800', // Orange
      legendFontColor: '#333',
      legendFontSize: 14,
    },
  ];

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchStats} />
      }
    >
      <Text style={styles.headerTitle}>Task Overview</Text>

      {/* Summary Cards Row */}
      <View style={styles.statsContainer}>
        {/* Total Card */}
        <View style={[styles.card, { backgroundColor: '#E3F2FD' }]}>
          <Text style={[styles.cardLabel, { color: '#1565C0' }]}>Total</Text>
          <Text style={[styles.cardNumber, { color: '#1565C0' }]}>
            {stats.total}
          </Text>
        </View>

        {/* Completed Card */}
        <View style={[styles.card, { backgroundColor: '#E8F5E9' }]}>
          <Text style={[styles.cardLabel, { color: '#2E7D32' }]}>Done</Text>
          <Text style={[styles.cardNumber, { color: '#2E7D32' }]}>
            {stats.completed}
          </Text>
        </View>

        {/* Pending Card */}
        <View style={[styles.card, { backgroundColor: '#FFF3E0' }]}>
          <Text style={[styles.cardLabel, { color: '#EF6C00' }]}>Pending</Text>
          <Text style={[styles.cardNumber, { color: '#EF6C00' }]}>
            {stats.pending}
          </Text>
        </View>
      </View>

      {/* Chart Section */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Task Overview</Text>

        {stats.total === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No tasks available to show chart.
            </Text>
          </View>
        ) : (
          <PieChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            accessor={'population'}
            backgroundColor={'transparent'}
            paddingLeft={'0'} // Change this to "0" to fix horizontal skew
            center={[10, 0]} // Optional: Adjusts the pie circle position slightly if needed
            absolute
          />
        )}
      </View>
    </ScrollView>
  );
}

// Chart configuration object
const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flexGrow: 1, // Allows the content to fill the screen height
    justifyContent: 'center', // Centers content vertically
    padding: 20,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center', // Ensures the title text itself is centered
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 20, // Increased vertical padding for better look
    alignItems: 'center',
    marginHorizontal: 6, // Added spacing between cards
    backgroundColor: '#fff', // Fallback color
    // improved shadow for "floating" effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  cardNumber: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#555',
    marginBottom: 20,
    alignSelf: 'center', // Centers the "Task Overview" text
  },
  emptyState: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
  },
  center: {},
});
