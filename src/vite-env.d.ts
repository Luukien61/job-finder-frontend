interface ImportMetaEnv {
    readonly VITE_GOOGLE_SCOPE: string;
    readonly VITE_GOOGLE_REDIRECT_URL: string;
    readonly VITE_BACKEND_URL: string;
    readonly VITE_CLOUDINARY_CLOUD_NAME: string;
    readonly VITE_MAIL_SERVER_URL: string;
    readonly VITE_GOOGLE_CLIENT_ID: string;
    readonly VITE_GOOGLE_CLIENT_SECRET: string;
    readonly VITE_WS_BASE_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}


declare module '*.png' {
    const value: string;
    export default value;
}

declare module '*.jpg' {
    const value: string;
    export default value;
}

declare module '*.jpeg' {
    const value: string;
    export default value;
}

declare module '*.svg' {
    const value: string;
    export default value;
}

declare module '*.gif' {
    const value: string;
    export default value;
}

declare module '*.webp' {
    const value: string;
    export default value;
}
