import jwt from 'jsonwebtoken';

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'fallback-access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';

// Expiry times
const ACCESS_EXPIRY = '15m'; // 15 minutes
const REFRESH_EXPIRY = '7d'; // 7 days

export function generateTokenPair(payload: TokenPayload): TokenPair {
  const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY });
  const refreshToken = jwt.sign({ id: payload.id }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });

  // Calculate expiresAt timestamp (in Unix seconds) for the access token
  const decoded = jwt.decode(accessToken) as jwt.JwtPayload;
  const expiresAt = decoded.exp || Math.floor(Date.now() / 1000) + 15 * 60;

  return {
    accessToken,
    refreshToken,
    expiresAt,
  };
}

export function verifyRefreshToken(token: string): { id: string } {
  return jwt.verify(token, REFRESH_SECRET) as { id: string };
}
