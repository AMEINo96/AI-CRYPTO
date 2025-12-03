import { initializeFirebase } from './index';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, Timestamp, orderBy, limit } from 'firebase/firestore';
import { getCoinData } from '@/lib/api/coingecko';

const { firestore: db } = initializeFirebase();

export interface Prediction {
    id?: string;
    ticker: string;
    action: 'Buy' | 'Sell' | 'Hold';
    entryPrice: string; // The price at the time of prediction
    predictedAt: Timestamp;
    status: 'Pending' | 'Correct' | 'Incorrect';
    rationale: string;
    confidence: string;
}

export async function savePrediction(prediction: Omit<Prediction, 'id' | 'status' | 'predictedAt'>) {
    if (!db) {
        console.error("Firestore not initialized");
        return;
    }

    try {
        await addDoc(collection(db, 'predictions'), {
            ...prediction,
            predictedAt: Timestamp.now(),
            status: 'Pending'
        });
        console.log("Prediction saved successfully.");
    } catch (error) {
        console.error("Error saving prediction:", error);
    }
}

export async function checkPredictionAccuracy() {
    if (!db) return;

    try {
        // Get pending predictions
        const q = query(collection(db, 'predictions'), where('status', '==', 'Pending'));
        const snapshot = await getDocs(q);

        for (const docSnap of snapshot.docs) {
            const data = docSnap.data() as Prediction;
            const now = Timestamp.now();

            // Check if enough time has passed (e.g., 24 hours)
            const oneDayInMillis = 24 * 60 * 60 * 1000;
            if (now.toMillis() - data.predictedAt.toMillis() < oneDayInMillis) {
                continue; // Too soon to verify
            }

            // Fetch current price
            const coinData = await getCoinData(data.ticker.toLowerCase());
            if (!coinData) continue;

            const currentPrice = coinData.current_price;
            const entryPrice = parseFloat(data.entryPrice.replace(/[^0-9.]/g, '')); // Remove '$' or ','

            let status: 'Correct' | 'Incorrect' = 'Incorrect';

            if (data.action === 'Buy' && currentPrice > entryPrice) {
                status = 'Correct';
            } else if (data.action === 'Sell' && currentPrice < entryPrice) {
                status = 'Correct';
            } else if (data.action === 'Hold') {
                const change = Math.abs((currentPrice - entryPrice) / entryPrice);
                if (change < 0.02) status = 'Correct';
            }

            await updateDoc(doc(db, 'predictions', docSnap.id), {
                status: status
            });
        }
    } catch (error) {
        console.error("Error checking prediction accuracy:", error);
    }
}

export async function getPastPerformance(ticker: string, limitCount: number = 5): Promise<Prediction[]> {
    if (!db) return [];

    try {
        const simpleQ = query(
            collection(db, 'predictions'),
            where('ticker', '==', ticker),
            orderBy('predictedAt', 'desc'),
            limit(limitCount * 2)
        );

        const snapshot = await getDocs(simpleQ);
        const predictions = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Prediction));

        return predictions.filter(p => p.status !== 'Pending').slice(0, limitCount);

    } catch (error) {
        console.error("Error fetching past performance:", error);
        return [];
    }
}

export async function getAccuracyStats(): Promise<{ accuracy: number, total: number }> {
    if (!db) return { accuracy: 0, total: 0 };

    try {
        const q = query(collection(db, 'predictions'), where('status', 'in', ['Correct', 'Incorrect']));
        const snapshot = await getDocs(q);

        const total = snapshot.size;
        if (total === 0) return { accuracy: 0, total: 0 };

        const correct = snapshot.docs.filter(d => d.data().status === 'Correct').length;
        return {
            accuracy: Math.round((correct / total) * 100),
            total: total
        };
    } catch (error) {
        console.error("Error fetching accuracy stats:", error);
        return { accuracy: 0, total: 0 };
    }
}
