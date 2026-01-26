import Document from "../models/document";
import Flashcard from "../models/flashcard"
import Quiz from "../models/quiz"
import {extractTextFromPDF} from "../utils/pdfparser"
import {chunkText} from "../utils/textchunker.js"
import fs from "fs/promises"
import mongoose from 'mongoose'

export const uploadDocument=async (req,res,next)=>{
    try {
        
    } catch (error) {
        if(req.file){
            await fs.unlink(req.file.path).catch(()=>{{

            }})
        }
        next(error);
    }
}

export const getDocument=async(req,res,next)=>{
    try {
        
    } catch (error) {
        
    }
}
export const getDocuments=async(req,res,next)=>{
    try {
        
    } catch (error) {
        
    }
}
export const deleteDocument=async(req,res,next)=>{
    try {
        
    } catch (error) {
        
    }
}
export const updateDocument=async(req,res,next)=>{
    try {
        
    } catch (error) {
        
    }
}