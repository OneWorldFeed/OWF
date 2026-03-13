import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore }  from 'firebase-admin/firestore';
import { getAuth }       from 'firebase-admin/auth';

let adminApp: App;

function getAdminApp(): App {
  if (getApps().length > 0) return getApps()[0];

  // In production: set FIREBASE_ADMIN_SDK env var to the JSON string
  // of your service account key from Firebase Console > Project Settings > Service Accounts
  const serviceAccount = process.env.FIREBASE_ADMIN_SDK
    ? JSON.parse(process.env.FIREBASE_ADMIN_SDK)
    : null;

  if (serviceAccount) {
    return initializeApp({ credential: cert(serviceAccount) });
  }

  // Dev fallback — uses Application Default Credentials
  return initializeApp();
}

adminApp = getAdminApp();

export const adminDb   = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
export default adminApp;
