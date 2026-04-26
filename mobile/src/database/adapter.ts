/**
 * Native SQLite adapter for WatermelonDB
 *
 * WHY SQLiteAdapter instead of LokiJSAdapter:
 * LokiJS is an in-memory store with optional IndexedDB sync — it is designed
 * for web browsers (Expo Web). On native Android/iOS builds the data is NOT
 * written to a persistent file by LokiJS, so it can be lost whenever the
 * app process is killed, the APK is reinstalled, or the OS clears memory.
 *
 * SQLiteAdapter writes to a real SQLite database file on the device storage,
 * which survives app kills, restarts, and over-the-air updates (expo-updates).
 * It only wipes on a full uninstall or an explicit database reset.
 */
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import schema from './schema';

const adapter = new SQLiteAdapter({
    schema,
    dbName: 'fishing_god_db',
    // jsi: true enables the faster JSI bridge if the native module supports it.
    // Set to false if you hit a build error — it gracefully falls back.
    jsi: true,
    onSetUpError: (error: Error) => {
        console.error('[WatermelonDB] Database setup error:', error);
    },
});

export default adapter;
