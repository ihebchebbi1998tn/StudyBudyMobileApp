import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BASE_URL } from '../../Backend/apiConfig';
import { UserContext } from '../../Backend/UserContext';
import { useContext } from "react";

const SessionParticipationChart = () => {
  const [dailyHours, setDailyHours] = useState(0);
  const [monthlyHours, setMonthlyHours] = useState(0);
  const { user } = useContext(UserContext);
  const [todayTasks, setTodayTasks] = useState(0);
  const [monthlyTasks, setMonthlyTasks] = useState(0);

  const fetchData = () => {
    // Get current date in 'YYYY-MM-DD' format
    const today = new Date().toISOString().slice(0, 10);
    const apiUrl = `${BASE_URL}Studybuddy/api/study_stats.php?user_id=${user.userID}&date=${today}`;
  
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.daily_hours !== undefined && data.monthly_hours !== undefined) {
          // Convert the result from minutes to hours
          const dailyHoursInMinutes = parseInt(data.daily_hours);
          const monthlyHoursInMinutes = parseInt(data.monthly_hours);
          
          const newDailyHours = isNaN(dailyHoursInMinutes) ? 0 : dailyHoursInMinutes;
          const newMonthlyHours = isNaN(monthlyHoursInMinutes) ? 0 : monthlyHoursInMinutes;
  
          setDailyHours(newDailyHours);
          setMonthlyHours(newMonthlyHours);
        } else {
          // If no data is available, set both daily and monthly hours to 0
          setDailyHours(0);
          setMonthlyHours(0);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        // In case of error, set both daily and monthly hours to 0
        setDailyHours(0);
        setMonthlyHours(0);
      });
  };
  
  const fetchTasks = () => {
    const apiUrl = `${BASE_URL}Studybuddy/api/count_tasks.php?user_id=${user.userID}`;
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.task_count_per_day !== undefined && data.task_count_per_month !== undefined) {
          setTodayTasks(data.task_count_per_day || 0);
          setMonthlyTasks(data.task_count_per_month || 0);
        } else {
          setTodayTasks(0);
          setMonthlyTasks(0);
        }
      })
      .catch(error => {
        console.error('Error fetching task counts:', error);
        setTodayTasks(0);
        setMonthlyTasks(0);
      });
  };
  
  // Fetch data initially when the component mounts
  useEffect(() => {
    fetchData();
    fetchTasks();
    // Fetch data every second (1000 milliseconds)
    const interval = setInterval(() => {
      fetchData();
      fetchTasks();
    }, 1000);
  
    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Highlights</Text>
      <View style={styles.row}>
        <View style={styles.box}>
          <Text style={styles.number}>{dailyHours}</Text>
          <Text style={styles.label}>Minutes Studied (Daily)</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.number}>{monthlyHours}</Text>
          <Text style={styles.label}>Minutes Studied (Monthly)</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>My tasks</Text>
      <View style={styles.row}>
        <View style={styles.box}>
          <Text style={styles.number}>{todayTasks}</Text>
          <Text style={styles.label}>Task(s) done (Today)</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.number}>{monthlyTasks}</Text>
          <Text style={styles.label}>Task(s) done (Monthly)</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007EA4',
  },
  box: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  number: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007EA4',
    textAlign: 'center', // Align the number in the center
  },
  label: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center', // Align the label in the center
  },
});

export default SessionParticipationChart;
