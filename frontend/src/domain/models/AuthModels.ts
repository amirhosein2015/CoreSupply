export interface LoginRequest {
  email: string; // 
  password: string;
}

export interface LoginResponse {
  token: string; // در بک‌اند Token است (با حرف بزرگ T در سی‌شارپ، ولی Json معمولا کوچک می‌کند)
  refreshToken: string;
  expiration: string;
}
