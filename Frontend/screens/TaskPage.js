// Import necessary modules
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, Alert, Modal, TouchableHighlight } from 'react-native'; // Import Modal and TouchableHighlight
import { Ionicons } from '@expo/vector-icons';
import Header from './Header';
import CustomBottomNavbar from '../navigation/CustomBottomNavbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../../Backend/apiConfig';
import { UserContext } from "../../Backend/UserContext";

// Define TaskPage component
const TaskPage = () => {
  const [task, setTask] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // State variable for modal visibility
  const [selectedTaskId, setSelectedTaskId] = useState(null); // State variable to store the task ID to be deleted
  const { user } = useContext(UserContext);
  
  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks(1); // assuming user ID is 1
  }, []);

  // Fetch tasks from API
  const fetchTasks = async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}Studybuddy/api/get_tasks.php?user_id=${user.userID}`);
      const data = await response.json();
      setTaskList(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Add new task
  const addTask = async () => {
    if (task.trim() !== '') {
      try {
        const url = `${BASE_URL}Studybuddy/api/create_tasks.php?task_text=${encodeURIComponent(task)}&user_id=${user.userID}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        if (response.ok) {
          fetchTasks(user.userID);
          setTask('');
        } else {
          Alert.alert('Error', 'Failed to add task.');
        }
      } catch (error) {
        console.error('Error adding task:', error);
        Alert.alert('Error', 'Failed to add task.');
      }
    } else {
      Alert.alert('Error', 'Please enter a task.');
    }
  };

  // Toggle task completion status
  const toggleDone = async (taskId, isDone) => {
    try {
      const newStatus = isDone === "0" ? "1" : "0"; // Toggle the status
      const response = await fetch(`${BASE_URL}Studybuddy/api/update_task_status.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `task_id=${taskId}`,
      });
      if (response.ok) {
        fetchTasks(1);
      } else {
        Alert.alert('Error', 'Failed to update task status.');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      Alert.alert('Error', 'Failed to update task status.');
    }
  };

  // Delete task
  const deleteTask = async () => {
    try {
      const response = await fetch(`${BASE_URL}Studybuddy/api/delete_task.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `task_id=${selectedTaskId}`, // Use selectedTaskId state
      });
      if (response.ok) {
        fetchTasks(1);
      } else {
        Alert.alert('Error', 'Failed to delete task.');
      }
      setModalVisible(false); // Close the modal after deletion
    } catch (error) {
      console.error('Error deleting task:', error);
      Alert.alert('Error', 'Failed to delete task.');
    }
  };

  // Render TaskPage component
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.containerContent}>
        <Text style={styles.title}>Task List</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add Task"
            value={task}
            onChangeText={(text) => setTask(text)}
          />
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.taskListContainer}>
          {taskList.map((taskItem) => (
            <TouchableOpacity
              key={taskItem.task_id}
              style={styles.taskItem}
              onPress={() => toggleDone(taskItem.task_id, taskItem.is_done)}
              onLongPress={() => { // Open modal and set selected task ID
                setSelectedTaskId(taskItem.task_id);
                setModalVisible(true);
              }}
            >
              <View style={[styles.checkbox, { backgroundColor: taskItem.is_done === "1" ? '#007EA4' : '#fff' }]}>
                {taskItem.is_done === "1" && <Ionicons name="checkmark" size={20} color="#fff" />}
              </View>
              <Text style={[styles.taskText, { textDecorationLine: taskItem.is_done === "1" ? 'line-through' : 'none', marginLeft: 10 }]}>
                {taskItem.task_text}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <CustomBottomNavbar />

      {/* Modal for task deletion confirmation */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to delete this task?</Text>
            <View style={styles.modalButtons}>
              <TouchableHighlight
                style={{ ...styles.modalButton, backgroundColor: '#007EA4' }}
                onPress={() => {
                  deleteTask();
                }}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{ ...styles.modalButton, backgroundColor: '#ccc' }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Define styles for TaskPage component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 0,
  },
  containerContent: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 0,
    paddingTop: StatusBar.currentHeight || 0,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007EA4',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: '#007EA4',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskListContainer: {
    flex: 1,
    width: '100%',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskText: {
    fontSize: 16,
    flex: 1,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '45%', // Adjust button width
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default TaskPage; // Export TaskPage component
