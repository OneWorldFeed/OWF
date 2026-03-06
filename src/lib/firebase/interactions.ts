// Firestore interaction service
// Every like, share, save, comment writes to Firestore
// Powers the glow pulse system and accolade engine

import { db } from './config';
import {
  doc,
  updateDoc,
  increment,
  setDoc,
  serverTimestamp,
  collection,
  addDoc,
} from 'firebase/firestore';

export type InteractionType = 'like' | 'comment' | 'share' | 'save';

// Glow pulse intensity per interaction type
export const GLOW_PULSE: Record<InteractionType, {
  scale: number;
  duration: number;
  label: string;
}> = {
  like:    { scale: 1.04, duration: 400,  label: 'soft pulse'      },
  comment: { scale: 1.06, duration: 600,  label: 'medium pulse'    },
  share:   { scale: 1.10, duration: 800,  label: 'radiant pulse'   },
  save:    { scale: 1.05, duration: 1200, label: 'long warm pulse'  },
};

// Write interaction to Firestore
export async function recordInteraction(
  postId: string,
  userId: string,
  type: InteractionType,
  moodId: string,
  city: string,
) {
  try {
    // 1. Increment counter on the post document
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      [`${type}Count`]: increment(1),
      lastInteractionAt: serverTimestamp(),
    });

    // 2. Write the interaction event (powers accolade engine)
    await addDoc(collection(db, 'interactions'), {
      postId,
      userId,
      type,
      moodId,
      city,
      createdAt: serverTimestamp(),
    });

  } catch (err) {
    // Fail silently — optimistic UI already updated
    console.warn('Interaction write failed:', err);
  }
}

// Toggle like (like/unlike)
export async function toggleLike(
  postId: string,
  userId: string,
  currentlyLiked: boolean,
  moodId: string,
  city: string,
) {
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, {
    likeCount: increment(currentlyLiked ? -1 : 1),
    lastInteractionAt: serverTimestamp(),
  });

  if (!currentlyLiked) {
    await addDoc(collection(db, 'interactions'), {
      postId,
      userId,
      type: 'like',
      moodId,
      city,
      createdAt: serverTimestamp(),
    });
  }
}
