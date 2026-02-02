import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FeatureCard = ({ title, description, icon, color, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.cardContainer}>
        <LinearGradient
            colors={[color, color + '99']}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <View style={styles.baseIconContainer}>
                <MaterialCommunityIcons name={icon} size={32} color="white" />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardDesc}>{description}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="white" style={styles.arrow} />
        </LinearGradient>
    </TouchableOpacity>
);

export default function HomeScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>👁️ Vision Aid</Text>
                    <Text style={styles.headerSubtitle}>Assistive Technology Suite</Text>
                </View>

                <View style={styles.grid}>
                    <FeatureCard
                        title="Color Simulator"
                        description="Simulate color blindness"
                        icon="eye-outline"
                        color="#3B82F6"
                        onPress={() => navigation.navigate('Simulator')}
                    />
                    <FeatureCard
                        title="Live Detector"
                        description="Identify colors in real-time"
                        icon="eyedropper-variant"
                        color="#8B5CF6"
                        onPress={() => navigation.navigate('Detector')}
                    />
                    <FeatureCard
                        title="Traffic Signal"
                        description="Detect traffic lights"
                        icon="traffic-light"
                        color="#EF4444"
                        onPress={() => navigation.navigate('Traffic')}
                    />
                    <FeatureCard
                        title="Contrast Checker"
                        description="Check accessibility"
                        icon="contrast-circle"
                        color="#10B981"
                        onPress={() => navigation.navigate('Contrast')}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollContent: {
        padding: 20,
        paddingTop: 60,
    },
    header: {
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500',
    },
    grid: {
        gap: 20,
    },
    cardContainer: {
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    cardGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        borderRadius: 20,
    },
    baseIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '500',
    },
    arrow: {
        opacity: 0.8,
    }
});
