'use server';
import { convertToPlainObject, formatError } from '../utils';
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '../constants';
import { prisma } from '@/db/prisma';
import { revalidatePath } from 'next/cache';
import { insertProductSchema, updateProductSchema } from '../validator';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

// Get the latest products
export async function getLatestProducts() {

  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: 'desc' },
  });

  return convertToPlainObject(data);
}

export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}


// Get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query: string;
  category: string;
  limit?: number;
  page: number;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  const queryFilter: Prisma.ProductWhereInput =
  query && query !== 'all'
    ? {
        name: {
          contains: query,
          mode: 'insensitive',
        } as Prisma.StringFilter,
      }
    : {};

  const categoryFilter = category && category !== 'all' ? { category } : {};

  const priceFilter: Prisma.ProductWhereInput =
  price && price !== 'all'
    ? {
        price: {
          gte: Number(price.split('-')[0]),
          lte: Number(price.split('-')[1]),
        },
      }
    : {};

  const ratingFilter =
  rating && rating !== 'all' ? { rating: { gte: Number(rating) } } : {};

  const data = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...ratingFilter,
      ...priceFilter,
    },
    orderBy:
      sort === 'Prix le plus bas'
        ? { price: 'asc' }
        : sort === 'Prix le plus élevé'
        ? { price: 'desc' }
        : sort === 'Meilleure note'
        ? { rating: 'desc' }
        : { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });


  const dataCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete Product
export async function deleteProduct(id: string) {
  try {
    const productExists = await prisma.product.findFirst({
      where: { id },
    });

    if (!productExists) throw new Error('Produit non trouvé');

    await prisma.product.delete({ where: { id } });

      // ⚡ Forcer la mise à jour de la page
    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Produit supprimé avec succès',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}


// Create Product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    // Validate and create product
    const product = insertProductSchema.parse(data);
    await prisma.product.create({ data: product });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Produit créé avec succés',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update Product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    // Validate and find product
    const product = updateProductSchema.parse(data);
    const productExists = await prisma.product.findFirst({
      where: { id: product.id },
    });

    if (!productExists) throw new Error('Produit non trouvé');

    // Update product
    await prisma.product.update({ where: { id: product.id }, data: product });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Produit mis à jour avec succès',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get single product by id
export async function getProductById(productId: string) {
  const data = await prisma.product.findFirst({
    where: { id: productId },
  });

  return convertToPlainObject(data);
}

// Get product categories
export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ['category'],
    _count: true,
  });

  return data;
}

// Get featured products
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: 'desc' },
    take: 4,
  });

  return convertToPlainObject(data);
}

// Remove image from product
export async function removeProductImage(productId: string, imageUrl: string) {
  try {
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });

    if (!product) throw new Error('Produit non trouvé');

    // Filter out the image to remove
    const updatedImages = product.images.filter((img: string) => img !== imageUrl);

    // Update the product with the new images array
    await prisma.product.update({
      where: { id: productId },
      data: { images: updatedImages },
    });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Image supprimée avec succès',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Remove banner from product
export async function removeProductBanner(productId: string) {
  try {
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });

    if (!product) throw new Error('Produit non trouvé');

    // Update the product to remove the banner
    await prisma.product.update({
      where: { id: productId },
      data: { banner: null },
    });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Bannière supprimée avec succès',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

