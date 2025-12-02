'use client'
import { createContext, useContext } from 'react';
export const BlockContext = createContext({ parentId: 'root' });
export const useBlockContext = () => useContext(BlockContext);