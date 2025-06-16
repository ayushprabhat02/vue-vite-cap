<template>
    <div>
        <h1>📍 Live Location Tracker</h1>
        <p v-if="location">
            Latitude: {{ location.lat }}<br />
            Longitude: {{ location.lon }}<br />
            Last Updated: {{ lastFetchTime }}
        </p>
        <p v-if="errorMessage" style="color: red;">
            Error: {{ errorMessage }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
import BackgroundGeolocation from 'cordova-background-geolocation-lt'

const location = ref<{ lat: number; lon: number } | null>(null)
const lastFetchTime = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

const startNativeTracking = () => {
    // Add event listeners for debugging
    BackgroundGeolocation.onEnabledChange((enabled) => {
        console.log('[BGGeo] Enabled changed:', enabled);
    });

    BackgroundGeolocation.onConnectivityChange((event) => {
        console.log('[BGGeo] Connectivity changed:', event);
    });

    BackgroundGeolocation.onPowerSaveChange((event) => {
        console.log('[BGGeo] Power save changed:', event);
    });

    BackgroundGeolocation.onProviderChange((event) => {
        console.log('[BGGeo] Provider changed:', event);
    });

    // Handle location updates
    BackgroundGeolocation.onLocation(
        locationData => {
            const coords = locationData.coords
            location.value = {
                lat: coords.latitude,
                lon: coords.longitude,
            }
            lastFetchTime.value = new Date().toLocaleTimeString()
            console.log('📍 [Location]', location.value, 'Battery:', locationData.battery?.level, 'IsMoving:', locationData.is_moving)
        },
        error => {
            const message = typeof error === 'object' && error !== null && 'message' in error
                ? (error as any).message
                : 'Unknown error'
            errorMessage.value = message
            console.error('[BGGeo] Location error:', error)
        }
    )

    // Heartbeat listener
    BackgroundGeolocation.onHeartbeat(() => {
        console.log('❤️ [Heartbeat] Fetching location...')
        BackgroundGeolocation.getCurrentPosition(
            {
                persist: true,
                timeout: 30,
                maximumAge: 0,
                desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
                samples: 1,
                extras: {
                    "heartbeat": true
                }
            },
            position => {
                const coords = position.coords
                location.value = {
                    lat: coords.latitude,
                    lon: coords.longitude,
                }
                lastFetchTime.value = new Date().toLocaleTimeString()
                console.log('📍 [Heartbeat Fetch]', location.value)
            },
            error => {
                const message = typeof error === 'object' && error !== null && 'message' in error
                    ? (error as any).message
                    : 'Heartbeat location error'
                errorMessage.value = message
                console.error('[Heartbeat Error]', error)
            }
        )
    })

    BackgroundGeolocation.ready(
        {
            // Location accuracy settings
            desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
            distanceFilter: 10,

            // Background operation settings
            stopOnTerminate: false,
            startOnBoot: true,
            enableHeadless: true,
            foregroundService: true,
            notification: {
                title: "Location Tracking",
                text: "Tracking your location in background",
                channelName: "Location Tracking",
                priority: BackgroundGeolocation.NOTIFICATION_PRIORITY_MAX,
                sticky: true,
                smallIcon: "mipmap/ic_launcher",
                largeIcon: "mipmap/ic_launcher",
                color: "#4CAF50"
            },

            // Battery optimization settings
            preventSuspend: true,
            heartbeatInterval: 5,
            enableTimestampMeta: true,

            // Debug settings
            debug: true,
            logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,

            // Activity recognition settings
            activityRecognitionInterval: 1000,
            stopTimeout: 5,
            activityType: BackgroundGeolocation.ACTIVITY_TYPE_OTHER_NAVIGATION,

            // Location settings
            locationUpdateInterval: 1000,
            fastestLocationUpdateInterval: 500,

            // Persistence settings
            persistMode: BackgroundGeolocation.PERSIST_MODE_ALL,
            maxDaysToPersist: 7,

            // Additional settings for reliability
            disableElasticity: true,
            disableStopDetection: true,
            disableMotionActivityUpdates: false,
            disableLocationAuthorizationAlert: true,
            stopDetectionDelay: 0,
            stopOnStationary: false,
            pausesLocationUpdatesAutomatically: false,
            allowIdenticalLocations: true,
            useSignificantChangesOnly: false,
            deferTime: 0,
            autoSync: true,
            autoSyncThreshold: 5,
            batchSync: true,
            maxBatchSize: 50,
            maxRecordsToPersist: -1,
            locationsOrderDirection: "ASC"
        },
        state => {
            console.log('[BGGeo] Ready state:', state);
            if (!state.enabled) {
                BackgroundGeolocation.start(() => {
                    console.log('[BGGeo] Tracking started with optimized settings for background operation')
                })
            } else {
                console.log('[BGGeo] Already running')
            }
        }
    )
}

// Remove the stop tracking on unmount
onUnmounted(() => {
    console.log('[BGGeo] Component unmounting, but keeping tracking active...');
    // Don't stop tracking when component unmounts
});

onMounted(() => {
    startNativeTracking()
})
</script>
