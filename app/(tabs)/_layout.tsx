import { View, Text } from 'react-native'
import React from 'react'
import { Tabs, Redirect } from 'expo-router'

const TabsLayout = () => {
  return (
    <>
      <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#FFA001',
        tabBarInactiveTintColor: '#CDCDE0',
        tabBarStyle:{
          backgroundColor: '#AB79FD',
          borderTopColor: '#232533',
          height: 84
        }
      }}>
        <Tabs.Screen
          name="home"
          options={{
            title:'Home',
            headerShown: false

          }}
        />

        <Tabs.Screen
          name="explore"
          options={{
            title:'Explore',
            headerShown: false

          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title:'Progress',
            headerShown: false

          }}/>
          <Tabs.Screen
          name="profile"
          options={{
            title:'Profile',
            headerShown: false

          }}
        />
      </Tabs>
      <Text>_layout</Text>
    </>
  )
}

export default TabsLayout