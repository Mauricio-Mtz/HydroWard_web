import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../config/firebaseConfig';
import { getFirestore, addDoc, collection } from 'firebase/firestore';

export default function Graf() {
    const [inputValue1, setInputValue1] = useState("");
    const [inputValue2, setInputValue2] = useState("");
    const sesion = JSON.parse(localStorage.getItem('userData'));
    const navigate = useNavigate();

    const db = getFirestore();

    const saveDataToFirestore = async () => {
        try {
            const docRef = await addDoc(collection(db, "myConnection"), { // Corrected collection name
                field1: inputValue1,
                field2: inputValue2,
            });
            alert("Document written to Database");
        } catch (error) {
            console.error("Error writing document:", error);
        }
    };

    return (
        <div>
            <h1>Save data to Firebase Firestore</h1> {/* Corrected heading */}
            <input type="text" value={inputValue1} onChange={(e) => setInputValue1(e.target.value)} /> {/* Corrected event name */}
            <input type="text" value={inputValue2} onChange={(e) => setInputValue2(e.target.value)} /> {/* Corrected event name */}
            <button onClick={saveDataToFirestore}>Save Data To Firestore</button> {/* Corrected button text */}
        </div>
    );
}
