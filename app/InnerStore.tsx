'use client'
import {useMemo,useState} from'react'
import{ArrowRight,CheckCircle2,Heart,Home,Minus,Plus,Search,ShoppingBag,ShoppingCart,SlidersHorizontal,Sparkles,Trash2,UserRound,X}from'lucide-react'

type View='Главная'|'Каталог'|'Избранное'|'Корзина'
type Product={id:number;name:string;color:string;price:number;image:string;sizes:string[]}
type CartItem={product:Product;size:string;quantity:number}

const INNER_H