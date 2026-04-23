import { NextRequest } from 'next/server';
import { apiResponse, apiError, requireAuth, withRateLimit, validators, sanitizeObject } from '@/lib/api-utils';
import { connectDB } from '@/lib/db';

// GET /api/cars - List cars with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const skip = (page - 1) * limit;

    // Sanitize filters
    const filters: any = {};
    if (searchParams.get('brand')) filters.brand = searchParams.get('brand')?.slice(0, 50);
    if (searchParams.get('minPrice')) filters.minPrice = parseInt(searchParams.get('minPrice') || '0');
    if (searchParams.get('maxPrice')) filters.maxPrice = parseInt(searchParams.get('maxPrice') || '10000000');

    const db = await connectDB();
    // const cars = await db.collection('cars').find(filters).skip(skip).limit(limit).toArray();
    // const total = await db.collection('cars').countDocuments(filters);

    // Mock response
    return apiResponse({ cars: [], total: 0, page, limit });
  } catch (error) {
    return apiError('Failed to fetch cars', 500);
  }
}

// POST /api/cars - Create car (protected, dealer only)
export const POST = withRateLimit(async (request: NextRequest) => {
  try {
    const { error, user } = await requireAuth(request);
    if (error) return error;

    if (user.role !== 'dealer') {
      return apiError('Only dealers can list cars', 403);
    }

    const body = await request.json();

    // Validate required fields
    const allowedFields = ['brand', 'model', 'year', 'price', 'mileage', 'fuelType', 'transmission', 'owners', 'location', 'description', 'features', 'images'];
    const carData = sanitizeObject(body, allowedFields);

    // Validate data
    if (!carData.brand || !carData.model) {
      return apiError('Brand and model are required', 400);
    }
    if (!validators.year(carData.year)) {
      return apiError('Invalid year', 400);
    }
    if (!validators.price(carData.price)) {
      return apiError('Invalid price', 400);
    }
    if (!validators.mileage(carData.mileage)) {
      return apiError('Invalid mileage', 400);
    }

    // Add metadata
    carData.dealerId = user.userId;
    carData.status = 'pending';
    carData.createdAt = new Date().toISOString();

    const db = await connectDB();
    // const result = await db.collection('cars').insertOne(carData);

    return apiResponse({ car: carData, id: 'mock-id' }, 201);
  } catch (error) {
    return apiError('Failed to create car listing', 500);
  }
}, 5);

// PUT /api/cars/[id] - Update car
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error, user } = await requireAuth(request);
    if (error) return error;

    const carId = params.id;
    const body = await request.json();

    // Verify ownership
    const db = await connectDB();
    // const car = await db.collection('cars').findOne({ _id: carId });
    // if (!car || car.dealerId !== user.userId) {
    //   return apiError('Unauthorized', 403);
    // }

    const allowedFields = ['price', 'description', 'features', 'status'];
    const updateData = sanitizeObject(body, allowedFields);
    updateData.updatedAt = new Date().toISOString();

    // await db.collection('cars').updateOne({ _id: carId }, { $set: updateData });

    return apiResponse({ car: updateData });
  } catch (error) {
    return apiError('Failed to update car', 500);
  }
}

// DELETE /api/cars/[id] - Delete car
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error, user } = await requireAuth(request);
    if (error) return error;

    const carId = params.id;

    // Verify ownership or admin
    const db = await connectDB();
    // const car = await db.collection('cars').findOne({ _id: carId });
    // if (!car || (car.dealerId !== user.userId && user.role !== 'admin')) {
    //   return apiError('Unauthorized', 403);
    // }

    // await db.collection('cars').deleteOne({ _id: carId });

    return apiResponse({ success: true });
  } catch (error) {
    return apiError('Failed to delete car', 500);
  }
}
