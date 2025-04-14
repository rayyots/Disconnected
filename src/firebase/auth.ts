
import { auth, db } from "./config";
import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier,
  PhoneAuthProvider 
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";

// Initialize reCAPTCHA verifier
let recaptchaVerifier: RecaptchaVerifier | null = null;

export const initRecaptcha = (containerId: string) => {
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear();
  }
  
  try {
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });
    
    window.recaptchaVerifier = recaptchaVerifier;
  } catch (error) {
    console.error("Error initializing reCAPTCHA", error);
    toast.error("Error initializing phone verification");
  }
};

export const sendVerificationCode = async (phoneNumber: string) => {
  try {
    if (!recaptchaVerifier) {
      throw new Error("reCAPTCHA not initialized");
    }
    
    // Format phone number if needed
    const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+1${phoneNumber}`;
    
    // Send verification code
    const confirmationResult = await signInWithPhoneNumber(auth, formattedNumber, recaptchaVerifier);
    
    // Store confirmationResult in window for later use
    window.confirmationResult = confirmationResult;
    
    return true;
  } catch (error) {
    console.error("Error sending verification code", error);
    toast.error("Could not send verification code. Please try again.");
    return false;
  }
};

export const verifyCode = async (code: string) => {
  try {
    if (!window.confirmationResult) {
      throw new Error("No verification in progress");
    }
    
    // Verify the code
    const result = await window.confirmationResult.confirm(code);
    const user = result.user;
    
    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (!userDoc.exists()) {
      // Create new user record
      await setDoc(doc(db, "users", user.uid), {
        phoneNumber: user.phoneNumber,
        name: "Omar Rayyan",
        email: "OmarRayyan@gmail.com",
        avatar: "",
        rating: 4.94,
        memberSince: "2025",
        verifiedUser: true,
        dataBalance: 500, // MB
        dataUsed: 0, // MB
        createdAt: new Date()
      });
    }
    
    // Store authentication state
    localStorage.setItem('isAuthenticated', 'true');
    
    // Fetch and store user data
    const updatedUserDoc = await getDoc(doc(db, "users", user.uid));
    if (updatedUserDoc.exists()) {
      localStorage.setItem('user', JSON.stringify({
        id: user.uid,
        ...updatedUserDoc.data()
      }));
      localStorage.setItem('userId', user.uid);
    }
    
    return true;
  } catch (error) {
    console.error("Error verifying code", error);
    toast.error("Invalid verification code. Please try again.");
    return false;
  }
};

// Add global types for reCAPTCHA
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | null;
    confirmationResult: any;
  }
}
