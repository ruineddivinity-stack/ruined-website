import { NextResponse } from "next/server";

// Temporary diagnostic — reports presence/shape of the register auth env
// vars without exposing their actual values. Delete after use.
export async function GET() {
  const field = process.env.WP_REGISTER_AUTH_KEY_FIELD;
  const value = process.env.WP_REGISTER_AUTH_KEY;
  return NextResponse.json({
    fieldSet: !!field,
    fieldLength: field?.length ?? 0,
    fieldPreview: field ? `${field.slice(0, 4)}...${field.slice(-4)}` : null,
    valueSet: !!value,
    valueLength: value?.length ?? 0,
    valuePreview: value ? `${value.slice(0, 4)}...${value.slice(-4)}` : null,
  });
}
