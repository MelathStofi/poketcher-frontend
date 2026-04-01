export type LoginRequest = {
    email: string;
    password: string;
};

export type RegisterRequest = {
    username: string;
    password: string;
    email?: string;
};

export type LoginResponse = {
    poketcher_token: string;
    username: string;
};

export type RegisterResponse = {
    success: boolean;
    message: string;
};

export type LogoutResponse = {
    success: boolean;
    message: string;
};