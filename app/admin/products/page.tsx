'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Cloud, ImagePlus, Loader2, Pencil, Plus, Save, Trash2, Upload, X } from 'lucide-react'
import { CatalogProduct, ProductCategory, ProductStatus, seedProducts } from '@/lib/catalog'
import styles from './products.module.css'

const emptyProduct: Omit<CatalogProduct, 'id'> = {
  name: '', category: 'Кроссовки', color: '', price: 0, status: 'Под заказ',
  delivery: '10