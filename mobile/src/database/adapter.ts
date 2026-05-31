/**
 * WatermelonDB adapter selection.
 *
 * Native/dev-client builds get SQLite persistence. Expo Go does not ship
 * WatermelonDB's native WMDatabaseBridge, so it must use LokiJS to boot.
 */
import { NativeModules } from 'react-native';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import type SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import schema from './schema';
import migrations from './migrations';

const hasWatermelonNativeBridge = Boolean(NativeModules.WMDatabaseBridge || NativeModules.DatabaseBridge);

let adapter: LokiJSAdapter | SQLiteAdapter;

if (hasWatermelonNativeBridge) {
    try {
        const SQLiteAdapter = require('@nozbe/watermelondb/adapters/sqlite').default;
        adapter = new SQLiteAdapter({
            schema,
            migrations,
            dbName: 'fishing_god_db',
            jsi: true,
            onSetUpError: (error: Error) => {
                console.error('[WatermelonDB] Database setup error:', error);
            },
        });
    } catch (err) {
        console.warn('[WatermelonDB] Failed to initialize SQLiteAdapter, falling back to LokiJS:', err);
        adapter = new LokiJSAdapter({
            schema,
            migrations,
            dbName: 'fishing_god_db_expo_go',
            useWebWorker: false,
            useIncrementalIndexedDB: false,
            onSetUpError: (error: Error) => {
                console.error('[WatermelonDB] Expo Go database setup error:', error);
            },
        });
    }
} else {
    adapter = new LokiJSAdapter({
        schema,
        migrations,
        dbName: 'fishing_god_db_expo_go',
        useWebWorker: false,
        useIncrementalIndexedDB: false,
        onSetUpError: (error: Error) => {
            console.error('[WatermelonDB] Expo Go database setup error:', error);
        },
    });
}

export default adapter;
