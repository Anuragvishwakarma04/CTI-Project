import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { city, latitude, longitude } = body;

    if (!city || !latitude || !longitude) {
      return NextResponse.json(
        { success: false, error: 'City, latitude, and longitude are required' },
        { status: 400 }
      );
    }

    // Store location (in production, save to database)
    const location = { city, latitude, longitude, updatedAt: new Date().toISOString() };

    return NextResponse.json({
      success: true,
      data: location,
      message: 'Location updated successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
