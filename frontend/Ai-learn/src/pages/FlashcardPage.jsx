import React from 'react'
import { useParams, Link } from "react-router-dom";
import FlashcardManager from '../components/flashcards/FlashcardManager';
const FlashcardPage = () => {
  const { id } = useParams();
  return (
    <div>
     <FlashcardManager documentId={id}/>
    </div>
  )
}

export default FlashcardPage
