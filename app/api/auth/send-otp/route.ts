import { NextResponse } from 'next/server';

// POST /api/auth/send-otp - Send OTP to mobile
export async function POST(request: Request) {
  const { mobile } = await request.json();
  
  // TODO: Integrate with OTP provider (Twilio, AWS SNS, etc.)
  // const otp = generateOTP();
  // await sendSMS(mobile, `Your OTP is: ${otp}`);
  // await saveOTPToCache(mobile, otp);

  return NextResponse.json({
    success: true,
    message: 'OTP sent successfully',
  });
}
