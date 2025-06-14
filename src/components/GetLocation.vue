<!-- <template>
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
import { onMounted, ref } from 'vue'
import BackgroundGeolocation from 'cordova-background-geolocation-lt'

// Reactive location state
const location = ref<{ lat: number; lon: number } | null>(null)
const lastFetchTime = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

// Setup background location tracking
const startNativeTracking = () => {
    // Called every time location changes
    BackgroundGeolocation.onLocation(
        locationData => {
            const coords = locationData.coords
            location.value = {
                lat: coords.latitude,
                lon: coords.longitude,
            }
            lastFetchTime.value = new Date().toLocaleTimeString()
            console.log('📍 [Native] Location:', location.value)
        },
        error => {
            // Catch any tracking error
            if (typeof error === 'object' && error !== null && 'message' in error) {
                errorMessage.value = (error as any).message
            } else {
                errorMessage.value = 'Unknown error'
            }
            console.error('[BGGeo] Location error:', error)
        }
    )

    // Configure background geolocation
    BackgroundGeolocation.ready(
        {
            desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
            distanceFilter: 10, // Update every 10 meters
            stopOnTerminate: false,
            startOnBoot: true,
            debug: false,
            logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
            enableHeadless: true,
        },
        state => {
            if (!state.enabled) {
                BackgroundGeolocation.start(() => {
                    console.log('[BGGeo] Tracking started')
                })
            } else {
                console.log('[BGGeo] Already running')
            }
        }
    )
}

// Start tracking on mount
onMounted(() => {
    startNativeTracking()
})
</script> -->


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
import { onMounted, ref } from 'vue'
import BackgroundGeolocation from 'cordova-background-geolocation-lt'

const location = ref<{ lat: number; lon: number } | null>(null)
const lastFetchTime = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

const startNativeTracking = () => {
    // Handle location updates
    BackgroundGeolocation.onLocation(
        locationData => {
            const coords = locationData.coords
            location.value = {
                lat: coords.latitude,
                lon: coords.longitude,
            }
            lastFetchTime.value = new Date().toLocaleTimeString()
            console.log('📍 [Location]', location.value)
        },
        error => {
            // Type-safe error handling
            const message = typeof error === 'object' && error !== null && 'message' in error
                ? (error as any).message
                : 'Unknown error'
            errorMessage.value = message
            console.error('[BGGeo] Location error:', error)
        }
    )

    // Heartbeat listener (we don't need the event object)
    BackgroundGeolocation.onHeartbeat(() => {
        console.log('❤️ [Heartbeat] Fetching location...')
        BackgroundGeolocation.getCurrentPosition(
            {
                persist: false,
                timeout: 30,
                maximumAge: 5000,
                desiredAccuracy: 10,
                samples: 1,
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
            desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
            distanceFilter: 0,
            stopOnTerminate: false,
            startOnBoot: true,
            debug: false,
            heartbeatInterval: 4,
            logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
            enableHeadless: true
        },
        state => {
            if (!state.enabled) {
                BackgroundGeolocation.start(() => {
                    console.log('[BGGeo] Tracking started with 4s heartbeat.')
                })
            } else {
                console.log('[BGGeo] Already running')
            }
        }
    )
}

onMounted(() => {
    startNativeTracking()
})
</script>
