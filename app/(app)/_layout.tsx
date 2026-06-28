import { Tabs } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'

type TabIconProps = {
  focused: boolean
  color: string
  label: string
  symbol: string
}

function TabIcon({ focused, color, label, symbol }: TabIconProps) {
  return (
    <View style={styles.tabItem}>
      <Text style={[styles.tabSymbol, { color }]}>{symbol}</Text>
      <Text style={[styles.tabLabel, { color }]}>{label}</Text>
    </View>
  )
}

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#475569',
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="(tabs)/home"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} label="Home" symbol="⌂" />
          ),
          tabBarAccessibilityLabel: 'Home tab',
        }}
      />
      <Tabs.Screen
        name="(tabs)/learn"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} label="Learn" symbol="◎" />
          ),
          tabBarAccessibilityLabel: 'Learn tab',
        }}
      />
      <Tabs.Screen
        name="(tabs)/log"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} label="Log" symbol="+" />
          ),
          tabBarAccessibilityLabel: 'Log dive tab',
        }}
      />
      <Tabs.Screen
        name="(tabs)/profile"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} label="Profile" symbol="○" />
          ),
          tabBarAccessibilityLabel: 'Profile tab',
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0F1626',
    borderTopColor: '#1E293B',
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
  },
  tabItem: {
    alignItems: 'center',
    gap: 2,
    paddingTop: 4,
  },
  tabSymbol: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
})
