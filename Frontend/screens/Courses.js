import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

function Courses() {
  const [courses, setCourses] = useState([
    { id: 1, name: 'Course 1', sessions: ['Session 1', 'Session 2'] },
    { id: 2, name: 'Course 2', sessions: ['Session 3', 'Session 4'] },
    { id: 3, name: 'Course 3', sessions: ['Session 5', 'Session 6'] },
    { id: 4, name: 'Course 4', sessions: ['Session 7', 'Session 8'] },
    { id: 5, name: 'Course 5', sessions: ['Session 9', 'Session 10'] },
  ]);

  const [expandedCourse, setExpandedCourse] = useState(null);

  const handleCourseClick = (courseId) => {
    setExpandedCourse((prevCourse) => (prevCourse === courseId ? null : courseId));
  };

  return (
    <ScrollView style={styles.container}>
      {courses.map((course) => (
        <View key={course.id} style={styles.courseContainer}>
          <TouchableOpacity
            onPress={() => handleCourseClick(course.id)}
            style={[
              styles.courseItem,
              { backgroundColor: expandedCourse === course.id ? '#007EA4' : 'transparent' },
            ]}
          >
            <Text style={[styles.courseName, { color: expandedCourse === course.id ? '#fff' : '#000' }]}>
              {course.name}
            </Text>
            <Text style={[styles.arrow, { color: expandedCourse === course.id ? '#fff' : '#000' }]}>
              {expandedCourse === course.id ? '▼' : '▶'}
            </Text>
          </TouchableOpacity>

          {expandedCourse === course.id && (
            <View style={styles.sessionsContainer}>
              <Text style={styles.title}>Ongoing Sessions for {course.name}</Text>
              {course.sessions.map((session, index) => (
                <Text key={index} style={styles.sessionItem}>
                  {session}
                </Text> 
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  courseContainer: {
    marginBottom: 10,
  },
  courseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007EA4',
    backgroundColor: '#007EA4',
  },
  courseName: {
    fontSize: 20,
  },
  arrow: {
    fontSize: 20,
  },
  sessionsContainer: {
    padding: 20,
    backgroundColor: '#007EA4',
    marginTop: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  sessionItem: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
  },
});

export default Courses;
